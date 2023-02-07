import cn from 'classnames'
import { Button } from 'common/Button'
import { GradientText } from 'common/GradientText'
import { Icon } from 'common/Icon'
import { memo } from 'react'

interface NoCaptchaProps {
  onInstall: () => void
}

export const NoCaptcha = memo(function NoCaptcha(props: NoCaptchaProps) {
  return (
    <div className="grid grid-cols-container px-4 md:px-8 mt-24 md:mt-48 pb-32 md:pb-0">
      <div
        className={cn(
          'relative rounded-64 bg-111318 border border-ffffff/20 col-start-2 py-14 md:py-24  px-10 md:px-16',
        )}
      >
        <div className="justify-items-start grid gap-y-12 max-w-[620px]">
          <div className="grid gap-y-4">
            <GradientText className="text-48 uppercase" as="h3">
              Say goodbye to CAPTCHA and bots
            </GradientText>

            <p className="text-ffffff/70 font-normal text-18">
              Secure your Discord with <span className="text-ffffff font-semibold">Discord Bouncer</span>
            </p>
          </div>

          <Button
            type="button"
            variant="flat"
            className="flex items-center gap-x-4 bg-ffffff justify-center"
            onClick={props.onInstall}
          >
            <Icon name="discord" className="w-5 h-5 bg-gradient-81.5 from-4940e0 to-a39dff" />
            <span className="bg-gradient-81.5 from-4940e0 to-a39dff bg-clip-text text-transparent">Add to Discord</span>
          </Button>
        </div>

        <div className="mt-10 pb-20 md:mt-0 md:pb-0">
          {/* FIXME: Update this image */}
          <img
            className={cn(
              'absolute [filter:drop-shadow(0px_4px_12px_rgba(0,0,0,.08))_drop-shadow(0px_8px_64px_rgba(0,0,0,0.16))]',
              'w-[calc(100%-40px)] left-5',
              'md:left-[unset] md:w-auto md:top-10 md:-right-12 md:h-[calc(100%+40px)]',
            )}
            src="/images/home/verify-command-screenshot.png"
            alt="Discord"
          />
        </div>
      </div>
    </div>
  )
})
