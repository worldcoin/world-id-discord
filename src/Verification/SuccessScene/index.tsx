import {Option} from 'Admin/types/option'
import {Button} from 'common/Button'
import {GradientText} from 'common/GradientText'
import {GuildLabel} from 'common/GuildLabel'
import {Icon} from 'common/Icon'
import {memo} from 'react'

const guildData = {
  image: '/images/orb.png',
  name: 'Official Fortnite',
}

export const SuccessScene = memo(function SuccessScene(props: {assignedRoles: Array<Option>}) {
  return (
    <div className="grid justify-items-center gap-y-12">
      {/* FIXME: pass real data  */}
      <GuildLabel image={guildData.image} name={guildData.name} />

      <div className="grid justify-items-center gap-y-2 max-w-[400px]">
        <span className="font-semibold text-14 tracking-[0.1em] uppercase mb-2">SUCCESS!</span>

        <GradientText as="h1" className="text-center text-24 font-bold">
          Thanks for verifying! Enjoy your new roles
        </GradientText>

        <p className="text-center text-14 font-rubik text-bcc5f9">
          You can now close this window and return to Discord. Happy messaging! 🚀
        </p>
      </div>

      <div className="flex flex-wrap gap-x-1">
        {props.assignedRoles.map((role, index) => (
          <div
            className="grid grid-cols-auto/fr items-center gap-x-2 py-1.5 px-2.5 bg-ffffff/10 rounded-lg"
            key={`assignedRole-${role.value}-${index}`}
          >
            <Icon path="/icons/gradient-human.png" className="h-4 w-4 z-50" noMask />
            <span className="text-11">{role.label}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-y-6 mt-4 justify-self-stretch">
        <Button>Return to Discord</Button>
      </div>
    </div>
  )
})
