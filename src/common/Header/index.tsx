import cn from 'classnames'
import {Icon} from 'common/Icon'
import Link from 'next/link'
import {memo} from 'react'

export const Header = memo(function Header(props: {hideLinks?: boolean; onTop?: boolean}) {
  return (
    <div
      className={cn(
        'z-10 grid py-8 grid-cols-container-wide px-4 md:px-8',
        {relative: !props.onTop},
        {'fixed top-0 inset-x-0': props.onTop},
      )}
    >
      <div className="grid items-center justify-between grid-flow-col col-start-2">
        <Link href="/" className="relative grid items-center grid-flow-col gap-x-4 auto-cols-max text-ffffff">
          <Icon className="w-6 h-8" name="logo" />
          <span className="hidden md:block text-20 uppercase font-semibold">DISCORD BOUNCER</span>
          <span className="absolute right-0 -bottom-4 font-rubik text-12">Powered by World ID</span>
        </Link>

        {!props.hideLinks && (
          <div className="grid grid-flow-col auto-cols-max gap-x-6 text-13 font-medium">
            {/* FIXME: add link */}
            <a className="hover:opacity-75 transition-opacity" href="#!">
              About Discord Bouncer
            </a>

            <a
              className="hover:opacity-75 transition-opacity"
              href="https://github.com/worldcoin/discord-bouncer"
              target="_blank"
              rel="noreferrer"
            >
              Open source code
            </a>
          </div>
        )}
      </div>
    </div>
  )
})
