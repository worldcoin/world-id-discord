import cn from 'classnames'
import Head from 'next/head'
import { Fragment, memo, ReactNode } from 'react'

export const Layout = memo(function Layout(props: { className?: string; children?: ReactNode; title?: string }) {
  return (
    <Fragment>
      <Head>
        <title>{props.title ? `${props.title} | Discord x Worldcoin` : 'Discord x Worldcoin'}</title>
      </Head>

      <div className={cn('bg-black text-white min-h-screen', props.className)}>{props.children}</div>
    </Fragment>
  )
})
