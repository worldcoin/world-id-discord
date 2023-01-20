import {IDKitWidget, ISuccessResult} from '@worldcoin/idkit'
import {Option} from 'Admin/types/option'
import {Button} from 'common/Button'
import {GradientText} from 'common/GradientText'
import {GuildLabel} from 'common/GuildLabel'
import {APIGuild} from 'discord-api-types/v10'
import {generateGuildImage} from 'helpers'
import {Dispatch, Fragment, memo, SetStateAction} from 'react'
import {CredentialsItem} from 'Verification/InitialScene/CredentialsItem'
import {Scene} from 'Verification/types'

export const InitialScene = memo(function Initial(props: {
  actionId: [string, string]
  signal: string | null
  complete: (result: ISuccessResult) => Promise<void>
  setScene: Dispatch<SetStateAction<Scene>>
  setLoading: Dispatch<SetStateAction<boolean>>
  guild: APIGuild
  roles: {phone: Array<Option>; orb: Array<Option>} | null
}) {
  return (
    <Fragment>
      <div className="flex justify-center items-center w-full">
        <GuildLabel image={generateGuildImage(props.guild.id, props.guild.icon)} name={props.guild.name} />
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
            roles={props.roles?.phone || []}
          />

          <CredentialsItem
            icon="orb-huge"
            heading="Verify with Orb"
            description="Completely private iris imaging with a device called an orb"
            roles={props.roles?.orb || []}
          />
        </div>

        {props.actionId && props.signal && (
          <IDKitWidget actionId={props.actionId} signal={props.signal} onVerification={props.complete}>
            {({open}) => (
              <Button type="button" onClick={open} className="mt-4">
                Verify your identity
              </Button>
            )}
          </IDKitWidget>
        )}
      </div>
    </Fragment>
  )
})
