import cn from 'classnames'
import {Button} from 'common/Button'
import {Captcha} from 'common/Captcha'
import {GradientText} from 'common/GradientText'
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
      <div
        className={cn('grid gap-y-8 md:items-center md:grid-cols-auto/fr gap-x-40 justify-between col-start-2 z-10')}
      >
        <div className="grid gap-y-6">
          <div className="text-32 md:text-48">
            <GradientText as="span">Improve your Discord&nbsp;</GradientText>
            server by verifying unique people&nbsp;
            <GradientText as="span">with World ID</GradientText>
          </div>

          <p className="font-rubik text-bcc5f9">
            The World ID Discord bot helps prevent spam and increase the quality of the community by verifying humans.
            Allow only humans to join, only humans to post or DM, or have humans-only channels.
          </p>

          <div className="mt-6 grid md:grid-flow-col justify-start">
            <Button type="button" onClick={props.onInstall}>
              Install now
            </Button>

            <Button variant="flat" className="text-938cfa">
              Learn more
            </Button>
          </div>
        </div>

        <div
          className={cn(
            'justify-self-center md:justify-self-start relative p-6 z-0 rounded-32 w-min',
            'before:absolute before:-z-20 before:w-full before:h-full before:-left-1 before:-bottom-1',
            'before:bg-gradient-81.5 before:from-4940e0 before:to-a39dff before:rounded-32',
            'after:bg-ffffff after:-z-10 after:rounded-32 after:absolute after:inset-0',
          )}
        >
          <div className="grid gap-y-6">
            {/* FIXME: replace with real qr code */}
            <img className="w-[275px]" src="/images/qr.png" alt="Qr Code" />

            <span
              className={cn(
                'px-2 text-24 font-semibold bg-clip-text text-center text-transparent bg-gradient-81.5 from-4940e0 to-a39dff',
              )}
            >
              Prove your unique-humanness with WorldID.
            </span>

            <div className="px-2">
              <Captcha variant="flat" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
