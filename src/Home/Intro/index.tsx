import cn from 'classnames'
import {Button} from 'common/Button'
import {GradientText} from 'common/GradientText'
import {Icon} from 'common/Icon'
import Image from 'next/image'
import {memo} from 'react'

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
        <div className="grid gap-y-4 justify-items-center max-w-[930px]">
          <span className="uppercase tracking-[0.2em] text-14 font-bold text-96a0db">Introducing Discord Bouncer</span>
          <div className="text-32 md:text-48 text-center">
            <GradientText as="span">Improve your Discord&nbsp;</GradientText>
            server by verifying unique people&nbsp;
            <GradientText as="span">with World ID</GradientText>
          </div>

          <p className="font-rubik text-bcc5f9 text-center mt-8 px-20">
            Discord Bouncer helps prevent spam and increase the quality of the community by verifying humans. Allow only
            humans to join, only humans to post or DM, or have humans-only channels.
          </p>

          <div className="mt-12 grid justify-start">
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
