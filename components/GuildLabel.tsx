import { cn } from '@/lib/utils'
import Image from 'next/image'

export const GuildLabel = (props: { image: string; name: string; className?: string }) => {
  const { image, name, className } = props

  return (
    <div
      className={cn(
        'flex justify-start pl-1.5 py-1.5 pr-3 bg-white/10 items-center rounded-full gap-x-1.5',
        className
      )}
    >
      {image && (
        <Image
          src={image}
          alt="Discord guild logo"
          width={20}
          height={20}
          className="rounded-full min-w-0 min-h-0"
        />
      )}

      {!image && (
        <div className="size-6 rounded-full bg-white/10 flex items-center justify-center">
          <span className="text-sm leading-5">{name.slice(0, 1)}</span>
        </div>
      )}

      <span className="text-sm leading-[1.14] font-medium">{name}</span>
    </div>
  )
}
