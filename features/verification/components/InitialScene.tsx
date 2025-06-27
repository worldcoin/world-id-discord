'use client'

import { Button } from '@/components/Button'
import { GuildLabel } from '@/components/GuildLabel'
import { OrbIcon } from '@/components/icons/Orb'
import { SmartPhoneIcon } from '@/components/icons/SmartPhone'
import { ConfigFormValues } from '@/schemas/config-form'
import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { APIGuild } from 'discord-api-types/v10'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { calculateVerificationLevel } from '../utils/calculate-verification-level'
import { craftGuildImage } from '../utils/craft-guild-image'
import { CredentialsItem } from './CredentialsItem'

type InitialSceneProps = {
  configFormValues: ConfigFormValues
  complete: (result: ISuccessResult) => Promise<void>
  guild: APIGuild
}

export const InitialScene = ({ configFormValues, complete, guild }: InitialSceneProps) => {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const userId = searchParams.get('user_id')
  const appId = process.env.NEXT_PUBLIC_APP_ID

  return (
    <div className="grid grid-rows-[1fr_auto] h-full content-start">
      <div className="grid justify-items-start content-start">
        <GuildLabel
          image={craftGuildImage(guild?.id ?? '', guild?.icon ?? '')}
          name={guild?.name ?? ''}
        />

        <h1 className="max-w-[420px] mt-14 leading-[1.3] text-[24px] font-semibold">
          {t('Discord_Integration_Verify_InitialScene_Title')}
        </h1>

        <div className="grid gap-y-4 mt-8 mb-20">
          <div className="leading-5">
            {t('Discord_Integration_Verify_InitialScene_Description')}
          </div>

          {configFormValues.deviceEnabled && configFormValues?.deviceRoles?.length > 0 && (
            <CredentialsItem
              icon={<SmartPhoneIcon />}
              heading={t('Discord_Integration_Verify_InitialScene_Device_Title')}
              description={t('Discord_Integration_Verify_InitialScene_Device_Description')}
              roles={configFormValues.deviceRoles}
            />
          )}

          {configFormValues.orbEnabled && configFormValues?.orbRoles?.length > 0 && (
            <CredentialsItem
              icon={<OrbIcon />}
              heading={t('Discord_Integration_Verify_InitialScene_Orb_Title')}
              description={t('Discord_Integration_Verify_InitialScene_Orb_Description')}
              roles={configFormValues.orbRoles}
            />
          )}
        </div>
      </div>

      {appId && userId && guild.id && (
        <IDKitWidget
          verification_level={calculateVerificationLevel(configFormValues)}
          app_id={appId}
          action={guild.id}
          signal={userId}
          action_description={`verify in ${guild?.name ?? ''} server.`}
          onSuccess={complete}
        >
          {({ open }) => (
            <Button type="button" variant="contained" color="primary" onClick={open}>
              {t('Discord_Integration_Verify_InitialScene_Button')}
            </Button>
          )}
        </IDKitWidget>
      )}
    </div>
  )
}
