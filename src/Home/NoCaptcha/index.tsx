import cn from 'classnames'
import {Button} from 'common/Button'
import {memo} from 'react'

interface NoCaptchaProps {
  onInstall: () => void
}

export const NoCaptcha = memo(function NoCaptcha(props: NoCaptchaProps) {
  return (
    <div className="grid grid-cols-container px-4 md:px-8 mt-24 md:mt-48 pb-32 md:pb-0">
      <div
        className={cn(
          'relative rounded-64 bg-gradient-81.5 from-4940e0 to-a39dff col-start-2 py-14 md:py-28 px-10 md:px-20',
        )}
      >
        <div className="justify-items-start grid gap-y-12 max-w-[620px]">
          <div className="grid gap-y-4">
            <h2 className="font-semibold text-32 md:text-48">Say goodbye to CAPTCHA and bots</h2>

            <p className="text-ffffff/70 text-18">
              Secure your Discord with <span className="text-ffffff font-semibold">World ID Bot</span>
            </p>
          </div>

          <Button
            type="button"
            variant="flat"
            className="justify-self-stretch md:justify-self-start bg-ffffff"
            onClick={props.onInstall}
          >
            <span className="bg-gradient-81.5 from-4940e0 to-a39dff bg-clip-text text-transparent">Install now</span>
          </Button>
        </div>

        <div className="mt-10 pb-20 md:mt-0 md:pb-0">
          <img
            className={cn(
              'absolute [filter:drop-shadow(0px_4px_12px_rgba(0,0,0,.08))_drop-shadow(0px_8px_64px_rgba(0,0,0,0.16))]',
              'w-[calc(100%-40px)] left-5',
              'md:left-[unset] md:w-auto md:top-10 md:right-14 md:h-[calc(100%+40px)]',
            )}
            src="/images/discord.png"
            alt="Discord"
          />
        </div>
      </div>
    </div>
  )
})
