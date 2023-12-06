import { CredentialType, IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { Option } from 'Admin/types/option'
import { Button } from 'common/Button'
import { GuildLabel } from 'common/GuildLabel'
import { APIGuild } from 'discord-api-types/v10'
import { generateGuildImage } from 'helpers'
import { Dispatch, memo, SetStateAction } from 'react'
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
  roles: { orb: Array<Option>; device: Array<Option> } | null
  credentials: Array<CredentialType.Device | CredentialType.Orb>
}) {
  return (
    <>
      <div className="grow">
        <GuildLabel image={generateGuildImage(props.guild.id, props.guild.icon)} name={props.guild.name} />

        <h1 className="max-w-[420px] mt-14 leading-8 text-24">Please verify you are a unique human with World ID</h1>

        <div className="grid gap-y-4 mt-8 mb-20">
          <div className="leading-5">How to verify?</div>

          {props.credentials.includes(CredentialType.Device) && (
            <CredentialsItem
              icon="mobile-device-huge"
              heading="Phone number"
              description="A single-use code will be delivered to you via SMS"
              roles={props.roles?.device || []}
            />
          )}

          {props.credentials.includes(CredentialType.Orb) && (
            <CredentialsItem
              icon="orb-huge"
              heading="The Orb"
              description="Completely private iris imaging with a device called an orb"
              roles={props.roles?.orb || []}
            />
          )}
        </div>
      </div>

      {props.app_id && props.action && props.signal && (
        <IDKitWidget
          bridge_url="https://staging-bridge.worldcoin.org" // FIXME: use production bridge
          credential_types={props.credentials}
          app_id={props.app_id}
          action={props.action}
          signal={props.signal}
          onSuccess={props.complete}
        >
          {({ open }: { open: () => void }) => (
            <Button type="button" variant="contained" color="primary" onClick={open}>
              Verify your identity
            </Button>
          )}
        </IDKitWidget>
      )}
    </>
  )
})
