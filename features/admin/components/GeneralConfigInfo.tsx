'use client'

import { GuildLabel } from '@/components/GuildLabel'
import { ConfigFormValues } from '@/schemas/config-form'
import { signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'
import { Switch } from './Switch'

export const GeneralConfigInfo = () => {
  const { control } = useFormContext<ConfigFormValues>()
  const t = useTranslations()
  const session = useSession()
  const guild = session?.data?.guild

  const changeGuild = () => {
    signOut()
  }

  return (
    <div className="relative grid grid-cols-[1fr_auto] items-start border-b p-6 border-gray-700">
      <div className="grid gap-y-3 w-full justify-items-start">
        <span className="text-xl font-semibold">
          {t('Discord_Integration_GeneralConfigInfo_Title')}
        </span>

        <div className="flex items-center gap-x-2">
          <GuildLabel image={guild?.icon ?? ''} name={guild?.name ?? 'Your server'} />

          <button
            type="button"
            className="cursor-pointer text-sm leading-5 font-medium text-gray-400"
            onClick={changeGuild}
          >
            {t('Discord_Integration_Switch_Server')}
          </button>
        </div>
      </div>

      <Switch control={control} name="botEnabled" />
    </div>
  )
}
