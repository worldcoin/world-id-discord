import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { Option } from 'Admin/types/option'
import { Button } from 'common/Button'
import { GradientText } from 'common/GradientText'
import { GuildLabel } from 'common/GuildLabel'
import { APIGuild } from 'discord-api-types/v10'
import { generateGuildImage } from 'helpers'
import { Dispatch, Fragment, memo, SetStateAction } from 'react'
import { CredentialsItem } from 'Verification/InitialScene/CredentialsItem'
import { Scene } from 'Verification/types'

export const InitialScene = memo(function Initial(props: {
  action: string
  app_id: string
  signal: string | null
  complete: (result: ISuccessResult) => Promise<void>
  setScene: Dispatch<SetStateAction<Scene>>
  setLoading: Dispatch<SetStateAction<boolean>>
  guild: APIGuild
  roles: { orb: Array<Option> } | null
  credentials: Array<'orb'>
}) {
  return (
    <Fragment>
      <div className="flex justify-center items-center w-full">
        <GuildLabel image={generateGuildImage(props.guild.id, props.guild.icon)} name={props.guild.name} />
      </div>

      <div className="grid gap-y-12">
        <div className="grid gap-y-2">
          <p className="font-bold text-12 text-center uppercase tracking-[0.2em]">Welcome!</p>
          <GradientText as="h1" className="justify-self-center font-bold text-24 text-center max-w-[360px]">
            Please verify you are a unique person with World ID
          </GradientText>
        </div>

        <div className="grid gap-y-6">
          <div className="font-bold text-12 uppercase tracking-[0.2em]">How to verify?</div>

          {props.credentials.includes('orb') && (
            <CredentialsItem
              icon="orb-huge"
              heading="The Orb"
              description="Completely private iris imaging with a device called an orb"
              roles={props.roles?.orb || []}
            />
          )}
        </div>

        {props.app_id && props.action && props.signal && (
          <IDKitWidget app_id={props.app_id} action={props.action} signal={props.signal} onSuccess={props.complete}>
            {({ open }) => (
              <Button type="button" onClick={open}>
                Verify your identity
              </Button>
            )}
          </IDKitWidget>
        )}
      </div>
    </Fragment>
  )
})
