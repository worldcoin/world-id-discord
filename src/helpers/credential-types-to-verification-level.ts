import { CredentialType, VerificationLevel } from '@worldcoin/idkit-core'

/**
 * @dev use to convert credential types to verification level
 * @param credential_types
 * @returns
 */
export const credential_types_to_verification_level = (credential_types: CredentialType[]): VerificationLevel => {
  if (credential_types.length === 1 && credential_types[0] === CredentialType.Orb) {
    return VerificationLevel.Orb
  }

  return VerificationLevel.Device
}
