import cn from 'classnames'
import { Icon } from 'common/Icon'
import { memo } from 'react'

export const InfoLine = memo(function InfoLine(props: { className?: string; text: string }) {
  return (
    <div
      className={cn(
        'grid items-center py-6 px-8 grid-cols-container-wide',
        'bg-gradient-to-r from-4940e0 to-a39dff',
        props.className,
      )}
    >
      <div className="grid grid-cols-fr/auto col-start-2">
        <span>{props.text}</span>

        <a
          href="https://github.com/worldcoin/discord-bouncer"
          target="_blank"
          rel="noreferrer"
          className="text-[0px] leading-none"
        >
          <Icon className="w-6 h-6" name="github" />
        </a>
      </div>
    </div>
  )
})
