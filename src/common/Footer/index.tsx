import {Icon} from 'common/Icon'
import {memo} from 'react'

export const Footer = memo(function Footer() {
  return (
    <div className="grid grid-cols-container-wide px-4 md:px-8 py-4 md:py-8">
      <div className="grid items-center grid-flow-col gap-x-4 auto-cols-max col-start-2">
        <Icon className="w-3.5 h-4" name="logo" />
        <span className="text-14">&copy; 2022 Discord Bouncer</span>
      </div>
    </div>
  )
})
