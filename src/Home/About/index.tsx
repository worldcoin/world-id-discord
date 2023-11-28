import { GradientText } from 'common/GradientText'
import Image from 'next/image'
import { memo } from 'react'

export const About = memo(function About() {
  return (
    <div className="grid grid-cols-container mt-24 md:mt-52 px-4 md:px-8">
      <div className="grid items-center grid-flow-col gap-y-16 gap-x-40 col-start-2">
        <div className="grid content-start items-start justify-items-start">
          <span className="uppercase text-caption text-white">How to get verified</span>

          <GradientText as="h2" className="uppercase text-heading md:text-heading-md mt-3">
            What is World ID
          </GradientText>

          <div className="grid gap-y-8 leading-7 text-20 font-rubik text-bcc5f9 mt-8">
            <p>
              World ID is a decentralized protocol to verify unique humanness. This is done through completely private
              iris imaging with a device called an orb or, for when a weaker protection is needed, using your phone
              number.
            </p>

            <p>
              As a user, you can download the{' '}
              <a
                target="_blank"
                href="https://worldcoin.org/download-app"
                className="text-ffffff font-semibold transition-opacity hover:opacity-80"
              >
                Worldcoin app
              </a>
              , go to an orb and verify your identity once. You can then prove your a unique human to any number of
              apps.
            </p>

            <p>You can then prove your a unique human to any number of apps.</p>
          </div>
        </div>

        <Image width={639} height={727} src="/images/home/how-to-get-verified.png" alt="IDkit screenshot" />
      </div>
    </div>
  )
})
