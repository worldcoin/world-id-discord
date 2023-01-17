import cn from 'classnames'
import {memo, ReactNode} from 'react'

export const GradientText = memo(function GradientText(props: {
  children: ReactNode
  as: keyof JSX.IntrinsicElements
  className?: string
}) {
  return (
    <props.as className={cn('bg-clip-text text-transparent bg-gradient-81.5 from-4940e0 to-a39dff', props.className)}>
      {props.children}
    </props.as>
  )
})
