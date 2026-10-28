'use client'

import { GuildLabel } from '@/components/GuildLabel'
import { OrbIcon } from '@/components/icons/Orb'
import { SmartPhoneIcon } from '@/components/icons/SmartPhone'
import { ConfigFormValues } from '@/schemas/config-form'
import { IDKitResult } from '@worldcoin/idkit'
import { APIGuild } from 'discord-api-types/v10'
import { useTranslations } from 'next-intl'
import { craftGuildImage } from '../utils/craft-guild-image'
import { CredentialsItem } from './CredentialsItem'
import { WorldIdVerifyButton } from './WorldIdVerifyButton'

type InitialSceneProps = {
  configFormValues: ConfigFormValues
  complete: (result: IDKitResult) => Promise<void>
  guild: APIGuild
  onContextError: () => void
}

export const InitialScene = ({
  configFormValues,
  complete,
  guild,
  onContextError,
}: InitialSceneProps) => {
  const t = useTranslations()

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

      {guild.id && (
        <WorldIdVerifyButton
          configFormValues={configFormValues}
          guild={guild}
          label={t('Discord_Integration_Verify_InitialScene_Button')}
          onSuccess={complete}
          onContextError={onContextError}
        />
      )}
    </div>
  )
}
