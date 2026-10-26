import { GuildLabel } from '@/components/GuildLabel'
import { ConfigFormValues } from '@/schemas/config-form'
import { IDKitResult } from '@worldcoin/idkit'
import { APIGuild } from 'discord-api-types/v10'
import Image from 'next/image'
import { VerificationError } from '../types/verification-error'
import { craftGuildImage } from '../utils/craft-guild-image'
import { WorldIdVerifyButton } from './WorldIdVerifyButton'

const texts = {
  [VerificationError.AlreadyVerified]: {
    heading: 'Looks like you have already verified for this server.',
    description:
      'You have already verified with this server and the server only supports one verification per person.',
  },

  [VerificationError.VerificationRecordMissing]: {
    heading: 'This World ID has already been used on this server.',
    description:
      "We couldn't find the verification record needed to restore your roles. Please contact a server administrator.",
  },

  [VerificationError.Unknown]: {
    heading: "We couldn't complete the verification process.",
    description: 'Please try again.',
  },
}

type ErrorSceneProps = {
  guild: APIGuild
  complete: (result: IDKitResult) => Promise<void>
  error: VerificationError
  configFormValues: ConfigFormValues
  onContextError: () => void
}

export const ErrorScene = ({
  guild,
  complete,
  error,
  configFormValues,
  onContextError,
}: ErrorSceneProps) => {
  return (
    <div className="grid grid-rows-[1fr_auto] h-full">
      <div className="grid justify-items-start content-start">
        <GuildLabel
          image={craftGuildImage(guild.id ?? '', guild.icon ?? '')}
          name={guild.name}
        />

        <div className="relative w-12 h-12 mt-14">
          <Image src="/images/verification/alert.svg" fill alt={''} />
        </div>

        <h1 className="mt-6 leading-8 font-semibold text-24">
          {(error !== null && texts[error].heading) || <>Something went wrong</>}
        </h1>

        <p className="mt-3 leading-6 font-rubik text-grey-400">
          {(error !== null && texts[error].description) || (
            <>We couldn’t complete the verification process. Please try it again.</>
          )}
        </p>
      </div>

      {error === VerificationError.Unknown && guild.id && (
        <WorldIdVerifyButton
          configFormValues={configFormValues}
          guild={guild}
          label="Try again"
          onSuccess={complete}
          onContextError={onContextError}
        />
      )}
    </div>
  )
}
