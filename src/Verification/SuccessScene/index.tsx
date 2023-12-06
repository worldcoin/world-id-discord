import { GuildLabel } from 'common/GuildLabel'
import { Icon } from 'common/Icon'
import { APIGuild, APIRole } from 'discord-api-types/v10'
import { generateGuildImage } from 'helpers'
import Image from 'next/image'
import { memo } from 'react'

export const SuccessScene = memo(function SuccessScene(props: { guild: APIGuild; assignedRoles: Array<APIRole> }) {
  return (
    <div>
      <GuildLabel image={generateGuildImage(props.guild.id, props.guild.icon)} name={props.guild.name} />

      <div className="relative w-12 h-12 mt-14">
        <Image src="/images/verification/verified.svg" fill alt={''} />
      </div>

      <h1 className="mt-6 leading-8 font-semibold text-24">
        Thank you for verifying!
      </h1>

      <p className="mt-3 leading-6 font-rubik text-grey-400">
        You can now close this window and return to Discord. Happy messaging!
      </p>

      <h2 className="mt-8 leading-5 font-semibold">
        Enjoy your new roles!
      </h2>

      <div className="flex flex-wrap gap-x-1 justify-center mt-4">
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
  )
})
