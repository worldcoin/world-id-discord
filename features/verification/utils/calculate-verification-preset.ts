import { ConfigFormValues } from '@/schemas/config-form'
import { deviceLegacy, orbLegacy, Preset } from '@worldcoin/idkit'

/**
 * Picks the IDKit 4 preset matching the guild's credential configuration.
 *
 * The legacy presets preserve the IDKit 2.x `verification_level` semantics:
 * the Device preset accepts device or Orb credentials (the response item
 * identifier reports which one was used), while the Orb preset only accepts
 * Orb credentials.
 */
export const calculateVerificationPreset = (
  configFormValues: ConfigFormValues,
  signal: string
): Preset => {
  if (configFormValues.deviceEnabled) {
    return deviceLegacy({ signal })
  }

  return orbLegacy({ signal })
}
