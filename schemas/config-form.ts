import { useTranslations } from 'next-intl'
import z from 'zod'

export const craftConfigFormSchema = (t: ReturnType<typeof useTranslations>) => {
  return z.object({
    botEnabled: z.boolean(),
    deviceEnabled: z.boolean(),

    deviceRoles: z.array(z.object({ label: z.string(), value: z.string() })).min(1, {
      message: t('Discord_Integration_VerificationLevels_Roles_Error'),
    }),

    orbEnabled: z.boolean(),

    orbRoles: z.array(z.object({ label: z.string(), value: z.string() })).min(1, {
      message: t('Discord_Integration_VerificationLevels_Roles_Error'),
    }),
  })
}

export type ConfigFormValues = z.infer<ReturnType<typeof craftConfigFormSchema>>
