import cn from 'classnames'
import {memo, ReactNode} from 'react'

export const Layout = memo(function Layout(props: {className?: string; children?: ReactNode}) {
  return (
    <div className={cn('bg-0d1020 text-ffffff', props.className)}>
      <div className="absolute inset-0 overflow-x-clip">
        <span
          className={cn(
            "absolute z-0 top-[-350px] right-0 w-[800px] h-[800px] bg-[url('/public/images/honeycombs.png')]",
            'bg-center bg-contain bg-no-repeat',
            'before:absolute before:-z-10 before:inset-0 before:translate-x-[400px] before:bg-gradient-81.5',
            'before:from-4940e0 before:to-a39dff before:blur-[180px]',
            props.className,
          )}
        />
      </div>

      {props.children}
    </div>
  )
})
