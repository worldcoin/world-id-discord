import { assignRoles } from '@/features/verification/server/assign-roles'
import { verifyInteractionsToken } from '@/features/verification/server/verify-interactions-jwt'
import {
  assertProofBinding,
  assertProofEnvironment,
  credentialTypeFromIdentifier,
  getResultNullifier,
  normalizeNullifier,
  ProofBindingError,
  ProofEnvironmentError,
  verifyWorldIdProof,
} from '@/features/verification/server/verify-world-id-proof'
import { VerificationError } from '@/features/verification/types/verification-error'
import { sendDiscordErrorMessageResponse } from '@/features/verification/utils/send-discord-error-message-response'
import { sendDiscordSuccessMessageResponse } from '@/features/verification/utils/send-discord-success-message-response'
import { fetchBotConfig } from '@/lib/discord-integration-api/fetch-bot-config'
import { fetchVerificationResult } from '@/lib/discord-integration-api/fetch-verification-result'
import { saveVerificationResult } from '@/lib/discord-integration-api/save-verification-result'
import { ensureGuildRolesExist } from '@/lib/discord/ensure-guild-roles-exist'
import { getGuildData } from '@/lib/discord/get-guild-data'
import { userHasRoles } from '@/lib/discord/user-has-roles'
import { resolveRpId } from '@/lib/world-id/resolve-rp-id'
import { verificationCompleteInputSchema } from '@/schemas/verification-complete'
import { CredentialType } from '@/types/credential-type'
import { safeCall } from '@/utils/safe-call'
import { getTranslations } from 'next-intl/server'
import { NextRequest } from 'next/server'
import { inspect } from 'util'

export const POST = async (request: NextRequest) => {
  const originalBody = await request.json()
  const t = await getTranslations()

  // ANCHOR: Validate body
  const { success: bodyParseSuccess, data: body } =
    verificationCompleteInputSchema.safeParse(originalBody)

  if (!bodyParseSuccess) {
    return sendDiscordErrorMessageResponse({
      token: originalBody?.token,
      code: 400,
      message: t('Discord_Integration_Complete_Verification_Body_Error'),
    })
  }

  const { guildId, userId, token, result, interactionsToken } = body

  if (!resolveRpId()) {
    return sendDiscordErrorMessageResponse({
      token: originalBody?.token,
      code: 500,
      message: t('Discord_Integration_Complete_Verification_Body_Error'),
    })
  }

  try {
    await verifyInteractionsToken({
      interactionsToken,
      userId,
      guildId,
      discordToken: token,
    })
  } catch (error) {
    console.error('Error verifying interactions token', error)

    return sendDiscordErrorMessageResponse({
      token,
      code: 400,
      message: t('Discord_Integration_Complete_Verification_Unable_To_Verify_Proof'),
    })
  }

  // ANCHOR: Assert the proof is bound to this guild, this user, and this environment
  // The v4 verify endpoint checks the proof against the forwarded action and
  // signal hash without knowing the intended values, so the binding the v2
  // endpoint enforced is asserted here instead. The claimed nullifier is
  // derived from the same (still unverified) payload, exactly as the v2 flow
  // keyed its record lookup on the forwarded `nullifier_hash`. The result's
  // environment is asserted here too, before the record lookup, so a staging
  // or sandbox proof can neither be verified nor restore a recorded user's
  // roles on a production deployment.
  let claimedNullifier: string | null

  try {
    assertProofEnvironment(result)
    assertProofBinding(result, { guildId, userId })
    claimedNullifier = getResultNullifier(result)
  } catch (error) {
    if (error instanceof ProofEnvironmentError) {
      console.error('Proof environment check failed', error)
    } else if (error instanceof ProofBindingError) {
      console.error('Proof binding check failed', error)
    } else {
      console.error('Error checking proof binding', error)
    }

    return sendDiscordErrorMessageResponse({
      token,
      code: 400,
      message: t('Discord_Integration_Complete_Verification_Unable_To_Verify_Proof'),
    })
  }

  if (!claimedNullifier) {
    return sendDiscordErrorMessageResponse({
      token,
      code: 400,
      message: t('Discord_Integration_Complete_Verification_Unable_To_Verify_Proof'),
    })
  }

  // ANCHOR: Fetch verification result from DB to check if we have a record of it
  const {
    success: verificationResultFetchSuccess,
    data: internalVerificationResult,
    error: verificationResultFetchError,
  } = await safeCall(fetchVerificationResult)({
    guildId,
    nullifierHash: claimedNullifier,
  })

  if (!verificationResultFetchSuccess) {
    console.error('Error fetching verification result', verificationResultFetchError)

    return sendDiscordErrorMessageResponse({
      token,
      code: 500,
      message: t('Discord_Integration_Complete_Verification_Unable_To_Verify_Proof'),
    })
  }

  // ANCHOR: The same World ID is already bound to another Discord user
  if (internalVerificationResult && internalVerificationResult.user_id !== userId) {
    return sendDiscordErrorMessageResponse({
      token,
      code: 400,
      errorCode: VerificationError.AlreadyVerified,
      message: t('Discord_Integration_Complete_Verification_Already_Verified'),
    })
  }

  // ANCHOR: Fetch bot config
  const {
    success: botConfigFetchSuccess,
    data: botConfig,
    error: botConfigFetchError,
  } = await safeCall(fetchBotConfig)(guildId)

  if (!botConfigFetchSuccess || !botConfig) {
    console.error('Error fetching bot config', botConfigFetchError)

    return sendDiscordErrorMessageResponse({
      token,
      code: 500,
      message: t('Discord_Integration_Complete_Verification_Bot_Config_Error'),
    })
  }

  if (!botConfig.enabled) {
    return sendDiscordErrorMessageResponse({
      token,
      code: 400,
      message: t('Discord_Integration_Complete_Verification_Bot_Disabled'),
    })
  }

  // ANCHOR: Resolve credential type
  const claimedCredentialType = credentialTypeFromIdentifier(
    result.responses[0]?.identifier ?? ''
  )

  if (!internalVerificationResult && !claimedCredentialType) {
    return sendDiscordErrorMessageResponse({
      token,
      code: 400,
      message: t('Discord_Integration_Complete_Verification_Unable_To_Verify_Proof'),
    })
  }

  const credentialType: CredentialType = internalVerificationResult
    ? internalVerificationResult.signal_type
    : claimedCredentialType!

  if (!botConfig[credentialType]?.enabled) {
    return sendDiscordErrorMessageResponse({
      token,
      code: 400,
      message: t('Discord_Integration_Complete_Verification_Credential_Not_Enabled', {
        credentialType:
          credentialType.slice(0, 1).toUpperCase() + credentialType.slice(1).toLowerCase(),
      }),
    })
  }

  // ANCHOR: Get roles to assign
  const rolesToAssign = botConfig[credentialType]?.roles

  if (!rolesToAssign || !Array.isArray(rolesToAssign) || rolesToAssign.length === 0) {
    return sendDiscordErrorMessageResponse({
      token,
      code: 400,
      message: t('Discord_Integration_Complete_Verification_Can_Not_Find_Roles'),
    })
  }

  // ANCHOR: Ensure roles exist in Discord guild
  const rolesExistInDiscordGuild = await ensureGuildRolesExist(guildId, rolesToAssign)

  if (!rolesExistInDiscordGuild) {
    return sendDiscordErrorMessageResponse({
      token,
      code: 500,
      message: t('Discord_Integration_Complete_Verification_One_Or_More_Roles_Not_Found'),
    })
  }

  // ANCHOR: Fetch guild data
  const {
    success: guildFetchSuccess,
    data: guild,
    error: guildFetchError,
  } = await safeCall(getGuildData)(guildId)

  if (!guildFetchSuccess) {
    console.error('Error fetching guild data', guildFetchError)

    return sendDiscordErrorMessageResponse({
      token,
      code: 500,
      message: t('Discord_Integration_Complete_Verification_Guild_Not_Found'),
    })
  }

  //#region -- Handling users we already have a verification record for
  if (internalVerificationResult) {
    const userHasRolesResponse = await safeCall(userHasRoles)(userId, guildId, rolesToAssign)

    if (!userHasRolesResponse.success) {
      console.error('Error checking user roles', userHasRolesResponse.error)

      return sendDiscordErrorMessageResponse({
        token,
        code: 500,
        message: t('Discord_Integration_Complete_Verification_Unable_To_Verify_Proof'),
      })
    }

    if (userHasRolesResponse.data) {
      return sendDiscordErrorMessageResponse({
        token,
        code: 400,
        errorCode: VerificationError.AlreadyVerified,
        message: t('Discord_Integration_Complete_Verification_Already_Verified'),
      })
    }

    try {
      const assignedRoles = await assignRoles({
        guild,
        userId,
        rolesToAssign,
      })

      return sendDiscordSuccessMessageResponse(token, assignedRoles)
    } catch (error) {
      console.error('Error while assigning roles', error)

      return sendDiscordErrorMessageResponse({
        token,
        code: 500,
        message: t('Discord_Integration_Complete_Verification_Unable_To_Verify_Proof'),
      })
    }
  }
  //#endregion

  // ANCHOR: Verify proof
  let proofVerification: Awaited<ReturnType<typeof verifyWorldIdProof>> | null = null

  try {
    proofVerification = await verifyWorldIdProof(result)
  } catch (error) {
    console.error('Error verifying proof', error)

    return sendDiscordErrorMessageResponse({
      token,
      code: 400,
      message: t('Discord_Integration_Complete_Verification_Unable_To_Verify_Proof'),
    })
  }

  if (!proofVerification.success) {
    console.error('Proof verification failed', {
      code: proofVerification.code,
      detail: proofVerification.detail,
    })

    return sendDiscordErrorMessageResponse({
      token,
      code: 400,
      message: t('Discord_Integration_Complete_Verification_Unable_To_Verify_Proof'),
      errorCode: VerificationError.Unknown,
    })
  }

  // ANCHOR: Cross-check the verified proof against what was claimed
  // Roles are only ever assigned for the credential the Developer Portal
  // actually verified, under the canonical nullifier it returned.
  const verifiedResult = proofVerification.results.find(item => item.success)
  const verifiedCredentialType = verifiedResult
    ? credentialTypeFromIdentifier(verifiedResult.identifier)
    : null
  const verifiedNullifier = normalizeNullifier(proofVerification.nullifier)

  if (
    proofVerification.action !== guildId ||
    verifiedCredentialType !== credentialType ||
    !verifiedNullifier ||
    verifiedNullifier !== claimedNullifier
  ) {
    console.error('Verified proof does not match the claimed proof', {
      guildId,
      verifiedAction: proofVerification.action,
    })

    return sendDiscordErrorMessageResponse({
      token,
      code: 400,
      message: t('Discord_Integration_Complete_Verification_Unable_To_Verify_Proof'),
      errorCode: VerificationError.Unknown,
    })
  }

  //#region -- Handling successful verification
  // ANCHOR: Save verification result to DB
  const saveVerificationResultResponse = await safeCall(saveVerificationResult)({
    guildId,
    nullifierHash: verifiedNullifier,
    credentialType,
    userId,
  })

  if (!saveVerificationResultResponse.success) {
    console.error(
      'Error saving verification result',
      saveVerificationResultResponse.error,
      inspect(saveVerificationResultResponse.error.cause, { depth: 10 })
    )
  }

  // ANCHOR: Assign roles
  try {
    const assignedRoles = await assignRoles({
      guild,
      userId,
      rolesToAssign,
    })

    return sendDiscordSuccessMessageResponse(token, assignedRoles)
  } catch (error) {
    console.error('Error while assigning roles', error)

    return sendDiscordErrorMessageResponse({
      token,
      code: 500,
      message: t('Discord_Integration_Complete_Verification_Unable_To_Verify_Proof'),
    })
  }
  //#endregion
}
