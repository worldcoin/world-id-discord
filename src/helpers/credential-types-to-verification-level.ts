import { CredentialType, VerificationLevel } from '@worldcoin/idkit-core'

/**
 * @dev use to convert credential types to verification level
 * @param credential_types
 * @returns
 */
export const credential_types_to_verification_level = (credential_types: CredentialType[]): VerificationLevel => {
  // REVIEW
  if (credential_types.includes(CredentialType.Orb) && credential_types.includes(CredentialType.Device)) {
    return VerificationLevel.Device
  }

  if (credential_types.includes(CredentialType.Orb)) {
    return VerificationLevel.Orb
  }

  throw new Error('Invalid credential types')
}
