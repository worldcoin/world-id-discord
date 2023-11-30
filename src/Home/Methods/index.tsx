import { CredentialType } from '@worldcoin/idkit'
import { GradientText } from 'common/GradientText'
import { memo } from 'react'
import { Card } from './Card'

export const Methods = memo(function Methods() {
  return (
    <section className="grid grid-cols-container mt-44">
      <div className="grid gap-y-16 col-start-2">
        <div className="grid justify-center justify-items-center">
          <span className="uppercase font-bold text-caption text-white">Verification methods</span>

          <GradientText as="h2" className="md:max-w-[500px] mt-3 uppercase text-heading md:text-heading-md text-center">
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
            decorationLayout={CredentialType.Device}
          />

          <Card
            heading="Orb"
            pros={[
              'Strongest level of protection',
              'Only humans allowed - verified with biometrics',
              'Fully privacy preserving through cryptographic proofs',
              // eslint-disable-next-line react/jsx-key -- key passed in maping inside component
              <span>
                Leverages users who have enrolled at{' '}
                <a href="https://worldcoin.org/" className="opacity-70 transition hover:opacity-100">
                  <GradientText as="span">Worldcoin Orb</GradientText>
                </a>
              </span>,
            ]}
            decorationLayout={CredentialType.Orb}
          />
        </div>
      </div>
    </section>
  )
})
