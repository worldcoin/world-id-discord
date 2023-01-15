import cn from 'classnames'
import {memo} from 'react'

export const Footer = memo(function Footer(props: {className?: string}) {
  return (
    <p className={cn('font-rubik text-6673b9 text-14', props.className)}>
      The World ID Discord Bouncer helps prevent spam and increase the quality of the community by making sure everyone
      who joins is a human.{' '}
      <a href="#" className="text-ffffff">
        Learn more
      </a>
    </p>
  )
})
