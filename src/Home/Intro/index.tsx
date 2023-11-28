import cn from 'classnames'
import { Button } from 'common/Button'
import { GradientText } from 'common/GradientText'
import { Icon } from 'common/Icon'
import Image from 'next/image'
import { memo } from 'react'

interface IntroProps {
  onInstall: () => void
}

export const Intro = memo(function Intro(props: IntroProps) {
  return (
    <div
      className={cn(
        'relative -z-1 grid grid-cols-container px-4 md:px-8',
        'before:absolute before:w-52 before:h-52 before:-bottom-24 before:-left-10 before:blur-[500px]',
        'before:bg-gradient-to-r before:from-4940e0 before:to-a39dff ',
      )}
    >
      <Image src="/images/background.svg" fill alt="background" className="object-cover" />

      <div className={cn('grid col-start-2 content-center z-10 justify-items-center')}>
        <div className="grid justify-items-center">
          <span className="uppercase font-bold text-caption text-96a0db">Introducing Discord Bouncer</span>

          <GradientText
            as="h1"
            className="md:max-w-[1200px] mt-8 uppercase text-heading md:text-heading-md text-center"
          >
            Improve your Discord <span className="text-white">server by verifying unique people</span> with World ID
          </GradientText>

          <p className="mt-6 md:max-w-[860px] leading-7 font-rubik text-lg text-bcc5f9 text-center">
            Discord Bouncer helps prevent spam and increase the quality of the community by verifying humans. Allow only
            humans to join, only humans to post or DM, or have humans-only channels.
          </p>

          <div className="mt-16 grid justify-start">
            <Button
              type="button"
              className="grid grid-flow-col justify-center items-center gap-x-4"
              onClick={props.onInstall}
            >
              <Icon name="discord" className="h-5 w-5 text-ffffff" />
              <span>Add to Discord</span>
            </Button>

            <Button variant="flat" className="text-938cfa">
              Learn more
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
})
