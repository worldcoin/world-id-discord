import cn from 'classnames'
import { Icon } from 'common/Icon'
import Link from 'next/link'
import { memo, ReactNode } from 'react'

export const Modal = memo(function Modal(props: { loading?: boolean; children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'md:min-w-[480px] relative border border-f9f9f9/20 rounded-xl bg-[#191c20]',
        'before:absolute before:h-60 before:top-[calc(135%)] before:left-[-50%] before:right-[-50%] before:blur-[240px]',
        'before:rounded-[100%]',
      )}
    >
      <div className="w-full absolute -top-16 left-0 flex justify-center">
        <Link href="/" className="relative grid items-center grid-flow-col gap-x-4 auto-cols-max text-white">
          <Icon className="w-[246px] h-[20px]" name="logo-full" />
        </Link>
      </div>

      {props.loading && (
        <div className="z-50 flex items-center justify-center absolute inset-0 bg-black/80">
          <Icon className="w-16 h-16 animate animate-ping" name="logo" />
        </div>
      )}

      <div className={cn('relative z-10', props.className)}>{props.children}</div>
    </div>
  )
})
