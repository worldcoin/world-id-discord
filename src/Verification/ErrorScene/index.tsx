import {GuildLabel} from 'common/GuildLabel'
import {memo, useEffect, useState} from 'react'
import {Footer} from 'Verification/common/Footer'
import {VerificationError} from 'Verification/types'

const guildData = {
  image: '/images/orb.png',
  name: 'Official Fortnite',
}

const texts = {
  heading: {
    [VerificationError.AlreadyVerified]: 'Uh, oh!  Looks like you have already verified for this server.',
    [VerificationError.Unknown]: 'Uh, oh! We couldn’t complete the verification process.',
  },

  description: {
    [VerificationError.AlreadyVerified]: 'You can only verify once for each server.',
    [VerificationError.Unknown]: 'Please try again.',
  },
}

export const ErrorScene = memo(function ErrorScene() {
  const [error, setError] = useState<VerificationError | null>(null)

  //NOTE: temporary useEffect to display different types of errors without real data
  useEffect(() => {
    if (Math.random() > 0.5) {
      return setError(VerificationError.AlreadyVerified)
    }

    return setError(VerificationError.Unknown)
  }, [])

  return (
    <div className="grid gap-y-12 px-6 justify-items-center">
      {/* FIXME: pass real data  */}
      <GuildLabel image={guildData.image} name={guildData.name} />

      {error !== null && (
        <div className="grid gap-y-2 max-w-[400px]">
          <h1 className="text-24 font-bold text-e06258 text-center">{texts.heading[error]}</h1>
          <p className="font-rubik text-ffffff/70 text-14 text-center">{texts.description[error]}</p>
        </div>
      )}

      <div className="w-full grid gap-y-4 mt-[22px]">
        <button
          type="button"
          className="bg-000000 shadow-[0_0_0_1px_rgba(255,255,255,1)_inset] rounded-2xl py-5 hover:opacity-70 transition-opacity"
        >
          Verify your identity
        </button>

        <button
          type="button"
          className="bg-gradient-to-r from-4940e0 to-a39dff shadow-[0_0_0_1px_rgba(255,255,255,0.4)_inset] py-5 rounded-2xl hover:opacity-70 transition-opacity"
          onClick={() => null}
        >
          Complete
        </button>

        <Footer className="mt-2 text-center" />
      </div>
    </div>
  )
})
