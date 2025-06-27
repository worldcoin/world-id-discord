import { DiscordIcon } from '@/components/icons/Discord'
import { WorldcoinIcon } from '@/components/icons/Worldcoin'
import { cn } from '@/lib/utils'

type IconsSectionProps = { className?: string }

export const IconsSection = ({ className }: IconsSectionProps) => {
  return (
    <div className={cn('flex items-center gap-x-5 justify-center', className)}>
      <WorldcoinIcon />
      <DiscordIcon />
    </div>
  )
}
