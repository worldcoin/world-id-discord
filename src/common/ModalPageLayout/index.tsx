import cn from 'classnames'
import {Header} from 'common/Header'
import {Icon} from 'common/Icon'
import {Layout} from 'common/Layout'
import {memo, ReactNode} from 'react'

export const ModalPageLayout = memo(function ModalPageLayout(props: {
  loading?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <Layout className="grid grid-rows-auto/fr min-h-screen pb-8">
      <Header hideLinks />

      <div className="grid grid-cols-container place-items-center justify-center px-2">
        <div
          className={cn(
            'w-full md:w-[660px] col-start-2 relative border-2 border-f9f9f9/20 rounded-xl bg-0c0e10 overflow-hidden',
            'before:absolute before:h-60 before:top-[calc(100%-20px)] before:left-0 before:right-0 before:blur-[240px]',
            'before:rounded-[100%] before:bg-gradient-81.5 before:from-4940e0 before:to-a39dff',
          )}
        >
          {props.loading && (
            <div className="z-50 flex items-center justify-center absolute inset-0 bg-000000/80">
              <Icon className="w-16 h-16 animate animate-ping" name="logo" />
            </div>
          )}

          <div className={cn('relative z-10', props.className)}>{props.children}</div>
        </div>
      </div>
    </Layout>
  )
})
