import cn from 'classnames'
import Image from 'next/image'
import { memo } from 'react'

export const GuildLabel = memo(function GuildLabel(props: { image: string; name: string; className?: string }) {
  return (
    <div
      className={cn('inline-flex items-center pl-1.5 py-1.5 pr-3 bg-ffffff/10 rounded-full gap-x-1.5', props.className)}
    >
      <Image src={props.image} alt="Discord guild logo" width={20} height={20} className="rounded-full" />
      <span className="text-14 leading-5">{props.name}</span>
    </div>
  )
})
