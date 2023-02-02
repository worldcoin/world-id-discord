import { GradientText } from 'common/GradientText'
import { GuildLabel } from 'common/GuildLabel'
import { Icon } from 'common/Icon'
import { APIGuild, APIRole } from 'discord-api-types/v10'
import { generateGuildImage } from 'helpers'
import Image from 'next/image'
import { memo } from 'react'

export const SuccessScene = memo(function SuccessScene(props: { guild: APIGuild; assignedRoles: Array<APIRole> }) {
  return (
    <div className="grid justify-items-center gap-y-6">
      <div className="relative w-24 h-24">
        <Image src="/images/verification/verified.svg" fill alt={''} />
      </div>

      <GuildLabel image={generateGuildImage(props.guild.id, props.guild.icon)} name={props.guild.name} />

      <div className="grid gap-y-2">
        <p className="font-bold text-12 text-center uppercase tracking-[0.2em]">Success!</p>
        <GradientText
          as="h1"
          className="justify-self-center font-bold text-24 text-center max-w-[360px] from-1d976c to-93f9b9"
        >
          Thanks for verifying! Enjoy your new roles
        </GradientText>
        <p className="text-bcc5f9 text-14 text-center">
          You can now close this window and return to Discord. Happy messaging! 🚀
        </p>
      </div>

      <div className="mt-6 grid gap-y-6">
        <p className="font-bold text-12 text-center uppercase tracking-[0.2em]">enjoy your new roles!</p>
        <div className="flex flex-wrap gap-x-1">
          {props.assignedRoles.map((role) => (
            <div
              className="grid grid-cols-auto/fr items-center gap-x-2 py-1.5 px-2.5 bg-ffffff/10 rounded-lg"
              key={role.id}
            >
              <Icon path="/icons/gradient-human.png" className="h-4 w-4 z-50" noMask />
              <span className="text-11">{role.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})
