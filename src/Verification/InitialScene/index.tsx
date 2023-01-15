import {GradientText} from 'common/GradientText'
import {GuildLabel} from 'common/GuildLabel'
import {Icon} from 'common/Icon'
import {Dispatch, Fragment, memo, SetStateAction, useCallback} from 'react'
import {Footer} from 'Verification/common/Footer'
import {CredentialsItem} from 'Verification/CredentialsItem'
import {Scene} from 'Verification/types'

const guildData = {
  image: '/images/orb.png',
  name: 'Official Fortnite',
}

const roles = {
  phone: [
    {label: 'Moderator', value: 'Moderator'},
    {label: 'Server Admin', value: 'Server Admin'},
    {label: 'Community MVP', value: 'Community MVP'},
  ],

  orb: [
    {label: 'Moderator', value: 'Moderator'},
    {label: 'Server Admin', value: 'Server Admin'},
  ],
}

export const InitialScene = memo(function Initial(props: {
  setScene: Dispatch<SetStateAction<Scene>>
  setLoading: Dispatch<SetStateAction<boolean>>
}) {
  // FIXME: implement relevant submit function
  const complete = useCallback(() => {
    props.setLoading(true)

    setTimeout(() => {
      if (Math.random() > 0.5) {
        props.setLoading(false)
        return props.setScene(Scene.Success)
      }

      props.setLoading(false)
      return props.setScene(Scene.Error)
    }, 1500)
  }, [props])

  return (
    <Fragment>
      <div className="flex justify-between items-center">
        {/* FIXME: pass real data  */}
        <GuildLabel image={guildData.image} name={guildData.name} />

        <button type="button" className="text-0 leading-none">
          <Icon name="cross" className="h-6 w-6 text-ffffff" />
        </button>
      </div>

      <div className="grid gap-y-6 justify-items-center">
        <div className="grid gap-y-2 justify-items-center max-w-[460px]">
          <GradientText as="h1" className="font-bold text-24 text-center">
            Welcome! Please verify you are a unique person with World ID
          </GradientText>

          <p className="font-rubik text-14 text-bcc5f9 text-center">
            You will only be able to do this verification once for this Discord server. Once you complete the
            verification, you’ll get a special role assigned.
          </p>
        </div>

        <div className="bg-242628 p-4 rounded-2xl grid grid-cols-2 gap-x-8 mt-1.5">
          {/* FIXME: apply real roles */}
          <CredentialsItem
            icon="mobile-device"
            heading="Verify with phone number"
            description="A single-use code will be delivered
      to you via SMS"
            roles={roles.phone}
          />

          <CredentialsItem
            icon="orb"
            heading="Verify with Orb"
            description="Completely private iris imaging with a device called an orb"
            roles={roles.orb}
          />
        </div>

        <div className="w-full grid grid-cols-2 gap-x-4 mt-[22px]">
          <button
            type="button"
            className="bg-000000 shadow-[0_0_0_1px_rgba(255,255,255,1)_inset] rounded-2xl py-5 hover:opacity-70 transition-opacity"
          >
            Verify your identity
          </button>

          <button
            type="button"
            className="bg-gradient-to-r from-4940e0 to-a39dff shadow-[0_0_0_1px_rgba(255,255,255,0.4)_inset] py-5 rounded-2xl hover:opacity-70 transition-opacity"
            onClick={complete}
          >
            Complete
          </button>
        </div>

        <Footer className="px-4" />
      </div>
    </Fragment>
  )
})
