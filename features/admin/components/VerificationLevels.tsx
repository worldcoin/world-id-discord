'use client'

import { useTranslations } from 'next-intl'
import { RolesSelector } from './RolesSelector'
import { useFormContext } from 'react-hook-form'
import { SmartPhoneIcon } from '@/components/icons/SmartPhone'
import { OrbIcon } from '@/components/icons/Orb'
import { VerificationLevelToggle } from './VerificationLevelToggle'
import { ConfigFormValues } from '@/schemas/config-form'
import useSWR from 'swr'
import { routes } from '@/utils/routes'
import { fetcher } from '@/utils/swr-fetcher'
import { APIRole } from 'discord-api-types/v10'

type VerificationLevelsProps = { initialRoles: APIRole[] }

export const VerificationLevels = ({ initialRoles }: VerificationLevelsProps) => {
  const t = useTranslations()
  const { control, getValues, setValue } = useFormContext<ConfigFormValues>()

  const {
    data: roles,
    isLoading: isRolesLoading,
    mutate,
  } = useSWR<APIRole[]>(routes.api.admin.roles(), fetcher, {
    fallbackData: initialRoles,
  })

  const formattedRoles = roles?.map(role => ({
    label: role.name,
    value: role.id,
  }))

  const copyFromOrb = () => {
    const orbRoles = getValues('orbRoles')
    setValue('deviceRoles', orbRoles)
  }

  const copyFromDevice = () => {
    const deviceRoles = getValues('deviceRoles')
    setValue('orbRoles', deviceRoles)
  }

  const refreshRoles = async () => {
    await mutate()
  }

  return (
    <section className="grid grid-cols-[100%] gap-y-6 p-6">
      <div className="grid gap-y-2">
        <span className="text-[18px] font-sora font-semibold">
          {t('Discord_Integration_VerificationLevels_Title')}
        </span>

        <p className="font-rubik text-14 text-grey-400">
          {t('Discord_Integration_VerificationLevels_Description')}
        </p>
      </div>

      <div className="grid gap-y-6">
        <div className="grid gap-y-4">
          <VerificationLevelToggle
            control={control}
            icon={<SmartPhoneIcon />}
            heading={t('Discord_Integration_VerificationLevels_DeviceRoles_Title')}
            name="deviceEnabled"
            description={t('Discord_Integration_VerificationLevels_DeviceRoles_Description')}
          />

          <RolesSelector
            name="deviceRoles"
            label={t('Discord_Integration_VerificationLevels_DeviceRoles_Title')}
            roles={formattedRoles ?? []}
            copyLabel={t('Discord_Integration_VerificationLevels_CopyFromOrb')}
            copy={copyFromOrb}
            disabled={isRolesLoading}
            refresh={refreshRoles}
          />
        </div>

        <div className="grid gap-y-4">
          <VerificationLevelToggle
            control={control}
            icon={<OrbIcon />}
            heading={t('Discord_Integration_VerificationLevels_OrbRoles_Title')}
            name="orbEnabled"
            description={t('Discord_Integration_VerificationLevels_OrbRoles_Description')}
            titleAddon={
              <span className="px-3 leading-6 text-[12px] text-[#928bf9] bg-[#6c64ee]/20 rounded-full">
                {t('Discord_Integration_VerificationLevels_Orb_Title_Addon')}
              </span>
            }
            disabled={true}
          />

          <RolesSelector
            name="orbRoles"
            label={t('Discord_Integration_VerificationLevels_OrbRoles_Title')}
            roles={formattedRoles ?? []}
            copyLabel={t('Discord_Integration_VerificationLevels_CopyFromDevice')}
            copy={copyFromDevice}
            disabled={isRolesLoading}
            refresh={refreshRoles}
          />
        </div>
      </div>
    </section>
  )
}
