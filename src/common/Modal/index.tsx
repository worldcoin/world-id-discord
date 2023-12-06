import cn from 'classnames'
import { Icon } from 'common/Icon'
import { memo, ReactNode } from 'react'

export const Modal = memo(function Modal(props: { loading?: boolean; children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'md:min-w-[480px] relative border border-f9f9f9/20 rounded-xl bg-111318 overflow-hidden',
        'before:absolute before:h-60 before:top-[calc(135%)] before:left-[-50%] before:right-[-50%] before:blur-[240px]',
        'before:rounded-[100%] before:bg-gradient-81.5 before:from-4940e0 before:to-a39dff',
      )}
    >
      {props.loading && (
        <div className="z-50 flex items-center justify-center absolute inset-0 bg-black/80">
          <Icon className="w-16 h-16 animate animate-ping" name="logo" />
        </div>
      )}

      <div className={cn('relative z-10', props.className)}>{props.children}</div>
    </div>
  )
})
