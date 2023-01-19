import cn from 'classnames'
import Image from 'next/image'
import {memo} from 'react'

export const GuildLabel = memo(function GuildLabel(props: {image: string; name: string; className?: string}) {
  return (
    <div
      className={cn('grid items-center grid-cols-fr/auto py-2 px-3 bg-ffffff/10 rounded-lg gap-x-2', props.className)}
    >
      <Image src={props.image} alt="Discord guild logo" width={24} height={24} className="rounded-full" />
      <span className="leading-none">{props.name}</span>
    </div>
  )
})
