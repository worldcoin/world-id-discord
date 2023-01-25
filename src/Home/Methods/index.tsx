import { GradientText } from 'common/GradientText'
import { memo } from 'react'
import { Card } from './Card'

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
              'Supporting weaker protection',
              'Phone numbers are not stored',
              "No user's privacy is compromised",
              ' A single phone number is used only once in server',
            ]}
            decorationLayout="phone"
          />

          <Card
            heading="Orb"
            // FIXME: update pros
            pros={[
              'Supporting weaker protection',
              'Phone numbers are not stored',
              "No user's privacy is compromised",
              'A single phone number is used only once in server',
            ]}
            decorationLayout="orb"
          />
        </div>
      </div>
    </section>
  )
})
