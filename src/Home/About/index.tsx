import cn from 'classnames'
import {Captcha} from 'common/Captcha'
import {GradientText} from 'common/GradientText'
import {memo} from 'react'

export const About = memo(function About() {
  return (
    <div className="grid grid-cols-container mt-24 md:mt-52 px-4 md:px-8">
      <div className="grid md:grid-cols-[auto_400px] gap-y-16 gap-x-40 col-start-2">
        <div className="grid content-start items-start justify-items-start">
          <span className="uppercase text-14 font-bold text-96a0db">how to get verified</span>

          <GradientText as="h2" className="text-32 md:text-48 font-semibold mt-4">
            What is World ID
          </GradientText>

          <div className="grid gap-y-6 text-18 font-rubik text-bcc5f9 mt-12">
            <p>
              World ID is a decentralized protocol to verify unique humanness. This is done through completely private
              iris imaging with a device called an orb.
            </p>

            <p>
              As a user, you can download the Worldcoin app, go to an orb and verify your identity once. You can then
              prove your a unique human to any number of apps.
            </p>

            <p>
              Whenever an action requires World ID verification, you see a prompt like this, you get a verification
              request in your Worldcoin app, and confirm the verification.
            </p>
          </div>

          <div className="mt-16">
            <Captcha />
          </div>
        </div>

        <div className="relative">
          <span
            className={cn(
              "absolute md:-left-12 w-full md:w-[90%] aspect-square bg-[url('/public/images/dots.png')]",
              'bg-contain bg-no-repeat',
            )}
          />

          <img className="mt-40 relative aspect-square" src="/images/orb.png" alt="Orb" />
        </div>
      </div>
    </div>
  )
})
