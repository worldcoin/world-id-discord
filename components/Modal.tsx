import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type ModalProps = { children: ReactNode; className?: string }

export const Modal = ({ children, className = '' }: ModalProps) => {
  return (
    <div className={cn('gradient-border-container', className)}>
      <div className="rounded-[20px] h-full border border-[#3C424B] bg-[#191C20]">
        {children}
      </div>

      <div className="gradient-border-overlay h-full" />
    </div>
  )
}
