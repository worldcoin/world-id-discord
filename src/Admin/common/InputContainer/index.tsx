import cn from 'classnames'
import {memo, ReactNode} from 'react'

export const InputContainer = memo(function InputContainer(props: {
  className?: string
  children: ReactNode
  onClick?: () => void
}) {
  return (
    <div
      onClick={props.onClick}
      className={cn(
        props.className,
        'bg-0c0e10 border border-ffffff/20 hover:border-6673b9/50 transition-colors group rounded-xl',
      )}
    >
      {props.children}
    </div>
  )
})
