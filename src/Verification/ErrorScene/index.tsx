import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { Button } from 'common/Button'
import { GuildLabel } from 'common/GuildLabel'
import { memo, useEffect, useState } from 'react'
import { VerificationError } from 'Verification/types'

const guildData = {
  image: '/images/orb.png',
  name: 'Official Fortnite',
}

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
  complete: (result: ISuccessResult) => Promise<void>
}) {
  const [error, setError] = useState<VerificationError | null>(null)

  //NOTE: temporary useEffect to display different types of errors without real data
  useEffect(() => {
    if (Math.random() > 0.5) {
      return setError(VerificationError.AlreadyVerified)
    }

    return setError(VerificationError.Unknown)
  }, [])

  return (
    <div className="grid gap-y-12 justify-items-center">
      {/* FIXME: pass real data  */}
      <GuildLabel image={guildData.image} name={guildData.name} />

      {error !== null && (
        <div className="grid gap-y-2 max-w-[400px]">
          <h1 className="text-24 font-bold text-e06258 text-center">{texts[error].heading}</h1>
          <p className="font-rubik text-ffffff/70 text-14 text-center">{texts[error].description}</p>
        </div>
      )}

      {error !== VerificationError.AlreadyVerified && props.actionId && props.signal && (
        <IDKitWidget actionId={props.actionId} signal={props.signal} onVerification={props.complete}>
          {({open}) => (
            <Button type="button" className="mt-[22px] w-full" onClick={open}>
              Verify your identity
            </Button>
          )}
        </IDKitWidget>
      )}
    </div>
  )
})
