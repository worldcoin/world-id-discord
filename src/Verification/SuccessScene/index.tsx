import {Button} from 'common/Button'
import {GradientText} from 'common/GradientText'
import {GuildLabel} from 'common/GuildLabel'
import {memo} from 'react'
import {Footer} from 'Verification/common/Footer'

const guildData = {
  image: '/images/orb.png',
  name: 'Official Fortnite',
}

export const SuccessScene = memo(function SuccessScene() {
  return (
    <div className="grid px-6 justify-center justify-items-center gap-y-12">
      {/* FIXME: pass real data  */}
      <GuildLabel image={guildData.image} name={guildData.name} />

      <div className="grid justify-items-center gap-y-2 max-w-[400px]">
        <span className="font-semibold text-14 tracking-[0.1em] uppercase mb-2">SUCCESS!</span>

        <GradientText as="h1" className="text-center text-24 font-bold">
          We have applied the special “Verified” roles to your account.
        </GradientText>

        <p className="text-center text-14 font-rubik text-bcc5f9">
          You can now close this window and return to Discord. Happy messaging! 🚀
        </p>
      </div>

      <div className="grid gap-y-6">
        <Button>Return to Discord</Button>
        <Footer className="text-center" />
      </div>
    </div>
  )
})
