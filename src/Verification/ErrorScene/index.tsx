import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { Button } from 'common/Button'
import { GradientText } from 'common/GradientText'
import { GuildLabel } from 'common/GuildLabel'
import { Icon } from 'common/Icon'
import { APIGuild } from 'discord-api-types/v10'
import { generateGuildImage } from 'helpers'
import Image from 'next/image'
import { memo } from 'react'
import { VerificationError } from 'Verification/types'

const texts = {
  [VerificationError.AlreadyVerified]: {
    heading: 'Looks like you have already verified for this server.',
    description: 'You have already verified with this server and the server only supports one verification per person.',
  },

  [VerificationError.Unknown]: {
    heading: 'We couldn’t complete the verification process.',
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
    <div className="grid gap-y-6 justify-items-center">
      <div className="relative w-24 h-24">
        <Image src="/images/verification/alert.svg" fill alt={''} />
      </div>

      <GuildLabel image={generateGuildImage(props.guild.id, props.guild.icon)} name={props.guild.name} />

      {props.error !== null && (
        <div className="grid gap-y-2">
          <p className="font-bold text-12 text-center uppercase tracking-[0.2em]">Uh, oh!</p>
          <GradientText
            as="h1"
            className="justify-self-center font-bold text-24 text-center max-w-[360px] from-e06258 to-ff8a81"
          >
            {texts[props.error].heading}
          </GradientText>
          <p className="text-bcc5f9 text-14 text-center">{texts[props.error].description}</p>
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
            <Button
              type="button"
              className="mt-6 py-0 w-full grid grid-flow-col gap-x-2 items-center justify-center"
              variant="flat"
              onClick={open}
            >
              <Icon name="reload" className="w-6 h-6" />
              Try Again!
            </Button>
          )}
        </IDKitWidget>
      )}
    </div>
  )
})
