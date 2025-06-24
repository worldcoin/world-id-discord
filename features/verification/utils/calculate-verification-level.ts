import { ConfigFormValues } from '@/schemas/config-form'
import { VerificationLevel } from '@worldcoin/idkit-core'

export const calculateVerificationLevel = (configFormValues: ConfigFormValues) => {
  if (configFormValues.deviceEnabled) {
    return VerificationLevel.Device
  }

  if (!configFormValues.deviceEnabled && configFormValues.orbEnabled) {
    return VerificationLevel.Orb
  }

  return VerificationLevel.Orb
}
