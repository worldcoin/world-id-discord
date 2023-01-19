import cn from 'classnames'
import {memo, ReactNode} from 'react'

export const Layout = memo(function Layout(props: {className?: string; children?: ReactNode}) {
  return <div className={cn('bg-0d0e11 text-ffffff min-h-screen', props.className)}>{props.children}</div>
})
