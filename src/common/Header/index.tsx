import cn from 'classnames'
import { Icon } from 'common/Icon'
import Link from 'next/link'
import { memo, useEffect, useState } from 'react'
import { useScrollDirection } from 'react-use-scroll-direction'

export const Header = memo(function Header(props: { hideLinks?: boolean; onTop?: boolean }) {
  const { isScrollingUp, isScrollingDown } = useScrollDirection()
  const [isVisible, setIsVisible] = useState<boolean>(true)

  // NOTE: hide header when scrolling down
  useEffect(() => {
    if (!props.onTop) {
      return
    }

    if (isScrollingDown) {
      setIsVisible(false)
    }

    if (isScrollingUp) {
      setIsVisible(true)
    }
  }, [isScrollingDown, isScrollingUp, props.onTop])

  return (
    <div
      className={cn(
        'z-10 grid py-8 grid-cols-container-wide px-4 md:px-8 transition-opacity',
        { relative: !props.onTop },
        { 'fixed top-0 inset-x-0': props.onTop },
        { 'opacity-0': props.onTop && !isVisible },
        { 'opacity-100': props.onTop && isVisible },
      )}
    >
      <div className="grid items-center justify-between grid-flow-col col-start-2">
        <Link href="/" className="relative grid items-center grid-flow-col gap-x-4 auto-cols-max text-white">
          <Icon className="w-[246px] h-[20px]" name="logo-full" />
        </Link>

        {!props.hideLinks && (
          <div className="grid grid-flow-col auto-cols-max gap-x-6 text-13 font-medium">
            <a className="hover:opacity-75 transition-opacity" href="https://worldcoin.org/apps/discord">
              About Discord Integration
            </a>

            <a
              className="hover:opacity-75 transition-opacity"
              href="https://github.com/worldcoin/world-id-discord"
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
