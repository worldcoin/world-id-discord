import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { Button } from 'common/Button'
import { GuildLabel } from 'common/GuildLabel'
import { APIGuild } from 'discord-api-types/v10'
import { generateGuildImage } from 'helpers'
import { memo } from 'react'
import { VerificationError } from 'Verification/types'

const texts = {
  [VerificationError.AlreadyVerified]: {
    heading: 'Uh, oh!  Looks like you have already verified for this server.',
    description: 'You can only verify once for each server.',
  },

  [VerificationError.Unknown]: {
    heading: 'Uh, oh! We couldn’t complete the verification process.',
    description: 'Please try again.',
  },
}

export const ErrorScene = memo(function ErrorScene(props: {
  actionId: string
  signal: string | null
  guild: APIGuild
  complete: (result: ISuccessResult) => Promise<void>
  credentials: Array<'phone' | 'orb'>
  error: VerificationError
}) {
  return (
    <div className="grid gap-y-12 justify-items-center">
      <GuildLabel image={generateGuildImage(props.guild.id, props.guild.icon)} name={props.guild.name} />

      {props.error !== null && (
        <div className="grid gap-y-2 max-w-[400px]">
          <h1 className="text-24 font-bold text-e06258 text-center">{texts[props.error].heading}</h1>
          <p className="font-rubik text-ffffff/70 text-14 text-center">{texts[props.error].description}</p>
        </div>
      )}

      {props.error !== VerificationError.AlreadyVerified && props.actionId && props.signal && (
        <IDKitWidget
          actionId={props.actionId}
          signal={props.signal}
          handleVerify={props.complete}
          methods={props.credentials}
        >
          {({ open }) => (
            <Button type="button" className="mt-[22px] w-full" onClick={open}>
              Verify your identity
            </Button>
          )}
        </IDKitWidget>
      )}
    </div>
  )
})
