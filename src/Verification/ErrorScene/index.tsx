import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { CredentialType } from '@worldcoin/idkit-core'
import { Button } from 'common/Button'
import { GuildLabel } from 'common/GuildLabel'
import { APIGuild } from 'discord-api-types/v10'
import { credential_types_to_verification_level, generateGuildImage } from 'helpers'
import Image from 'next/image'
import { memo } from 'react'
import { VerificationError } from 'Verification/types'

const texts = {
  [VerificationError.AlreadyVerified]: {
    heading: 'Looks like you have already verified for this server.',
    description: 'You have already verified with this server and the server only supports one verification per person.',
  },

  [VerificationError.Unknown]: {
    heading: "We couldn't complete the verification process.",
    description: 'Please try again.',
  },
}

export const ErrorScene = memo(function ErrorScene(props: {
  app_id: `app_${string}`
  action: string
  signal: string | null
  guild: APIGuild
  complete: (result: ISuccessResult) => Promise<void>
  credentials: Array<CredentialType>
  error: VerificationError
}) {
  return (
    <>
      <div className="grow">
        <GuildLabel image={generateGuildImage(props.guild.id, props.guild.icon)} name={props.guild.name} />

        <div className="relative w-12 h-12 mt-14">
          <Image src="/images/verification/alert.svg" fill alt={''} />
        </div>

        <h1 className="mt-6 leading-8 font-semibold text-24">
          {(props.error !== null && texts[props.error].heading) || <>Something went wrong</>}
        </h1>

        <p className="mt-3 leading-6 font-rubik text-grey-400">
          {(props.error !== null && texts[props.error].description) || (
            <>We couldn’t complete the verification process. Please try it again.</>
          )}
        </p>
      </div>

      {props.error !== VerificationError.AlreadyVerified && props.app_id && props.action && props.signal && (
        <IDKitWidget
          verification_level={credential_types_to_verification_level(props.credentials)}
          app_id={props.app_id}
          action={props.action}
          signal={props.signal}
          action_description={`verify in ${props.guild.name} server.`}
          onSuccess={props.complete}
        >
          {({ open }: { open: () => void }) => (
            <Button type="button" variant="contained" color="primary" onClick={open}>
              Try again
            </Button>
          )}
        </IDKitWidget>
      )}
    </>
  )
})
