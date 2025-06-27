import { GuildLabel } from '@/components/GuildLabel'
import { craftGuildImage } from '../utils/craft-guild-image'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { APIRole } from 'discord-api-types/v10'
import { GradientHumanIcon } from '@/components/icons/GradientHuman'
import { useTranslations } from 'next-intl'

type SuccessSceneProps = {
  assignedRoles: Array<APIRole>
}

export const SuccessScene = ({ assignedRoles }: SuccessSceneProps) => {
  const t = useTranslations()
  const session = useSession()
  const guild = session.data?.guild

  return (
    <div className="grid justify-items-start content-start">
      <GuildLabel
        image={craftGuildImage(guild?.id ?? '', guild?.icon ?? '')}
        name={guild?.name ?? ''}
      />

      <div className="relative w-12 h-12 mt-14">
        <Image src="/images/verification/verified.svg" fill alt={''} />
      </div>

      <h1 className="mt-6 leading-8 font-semibold text-24">
        {t('Discord_Integration_Verify_SuccessScene_Title')}
      </h1>

      <p className="mt-3 leading-6 font-rubik text-grey-400">
        {t('Discord_Integration_Verify_SuccessScene_Description')}
      </p>

      <h2 className="mt-8 leading-5 font-semibold">
        {t('Discord_Integration_Verify_SuccessScene_Roles_Title')}
      </h2>

      <div className="flex flex-wrap gap-x-1 justify-center mt-4">
        {assignedRoles.map(role => (
          <div
            className="grid grid-cols-[auto_1fr] items-center gap-x-2 py-1.5 px-2.5 bg-white/10 rounded-lg"
            key={role.id}
          >
            <GradientHumanIcon />
            <span className="text-11">{role.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
