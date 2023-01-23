import {GradientText} from 'common/GradientText'
import {memo} from 'react'
import {Card} from './Card'

export const Methods = memo(function Methods() {
  return (
    <section className="grid grid-cols-container mt-44">
      <div className="grid gap-y-20 col-start-2">
        <div className="grid justify-center justify-items-center gap-y-4">
          <span className="text-14 uppercase font-bold tracking-[0.2em] text-96a0db">VERIFICATION METHODS</span>

          <GradientText className="text-48" as="h3">
            Choose between two methods
          </GradientText>
        </div>

        <div className="grid grid-cols-2 gap-x-8">
          <Card
            heading="Phone number"
            pros={[
              'Very simple user experience',
              'Phone numbers are not stored anywhere',
              'Fully privacy preserving',
              'A single phone number is used only once in each server',
            ]}
            decorationLayout="phone"
          />

          <Card
            heading="Orb"
            pros={[
              'Strongest level of protection',
              'Only humans allowed - verified with biometrics',
              'Fully privacy preserving through cryptographic proofs',
              // eslint-disable-next-line react/jsx-key -- key passed in maping inside component
              <span>
                Leverages users who have enrolled at {/* FIXME: Add proper link */}
                <a href="#!" className="opacity-70 transition hover:opacity-100">
                  <GradientText as="span">Worldcoin Orb</GradientText>
                </a>
              </span>,
            ]}
            decorationLayout="orb"
          />
        </div>
      </div>
    </section>
  )
})
