import { Button } from '@/components/Button'
import { GuildLabel } from '@/components/GuildLabel'
import { ConfigFormValues } from '@/schemas/config-form'
import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { APIGuild } from 'discord-api-types/v10'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { VerificationError } from '../types/verification-error'
import { calculateVerificationLevel } from '../utils/calculate-verification-level'
import { craftGuildImage } from '../utils/craft-guild-image'

const texts = {
  [VerificationError.AlreadyVerified]: {
    heading: 'Looks like you have already verified for this server.',
    description:
      'You have already verified with this server and the server only supports one verification per person.',
  },

  [VerificationError.Unknown]: {
    heading: "We couldn't complete the verification process.",
    description: 'Please try again.',
  },
}

type ErrorSceneProps = {
  guild: APIGuild
  complete: (result: ISuccessResult) => Promise<void>
  error: VerificationError
  configFormValues: ConfigFormValues
}

export const ErrorScene = ({ guild, complete, error, configFormValues }: ErrorSceneProps) => {
  const searchParams = useSearchParams()
  const appId = process.env.NEXT_PUBLIC_APP_ID
  const userId = searchParams.get('user_id')

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

      {error !== VerificationError.AlreadyVerified && appId && userId && guild.id && (
        <IDKitWidget
          verification_level={calculateVerificationLevel(configFormValues)}
          app_id={appId}
          action={guild.id}
          signal={userId}
          action_description={`verify in ${guild.name} server.`}
          onSuccess={complete}
        >
          {({ open }: { open: () => void }) => (
            <Button type="button" variant="contained" color="primary" onClick={open}>
              Try again
            </Button>
          )}
        </IDKitWidget>
      )}
    </div>
  )
}
