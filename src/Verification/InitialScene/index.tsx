import {Button} from 'common/Button'
import {GradientText} from 'common/GradientText'
import {GuildLabel} from 'common/GuildLabel'
import {Dispatch, Fragment, memo, SetStateAction, useCallback} from 'react'
import {CredentialsItem} from 'Verification/InitialScene/CredentialsItem'
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
  const verifyIdentity = useCallback(() => {
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
      <div className="flex justify-center items-center w-full">
        {/* FIXME: pass real data  */}
        <GuildLabel image={guildData.image} name={guildData.name} />
      </div>

      <div className="grid gap-y-12">
        <GradientText as="h1" className="justify-self-center font-bold text-24 text-center max-w-[460px]">
          Welcome! Please verify you are a unique person with World ID
        </GradientText>

        <div className="rounded-2xl grid grid-cols-2 gap-x-4">
          {/* FIXME: apply real roles */}
          <CredentialsItem
            icon="mobile-device-huge"
            heading="Verify with phone number"
            description="A single-use code will be delivered
      to you via SMS"
            roles={roles.phone}
          />

          <CredentialsItem
            icon="orb-huge"
            heading="Verify with Orb"
            description="Completely private iris imaging with a device called an orb"
            roles={roles.orb}
          />
        </div>

        <Button type="button" onClick={verifyIdentity} className="mt-4">
          Verify your identity
        </Button>
      </div>
    </Fragment>
  )
})