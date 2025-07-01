'use client'

import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

export type SwitchBaseProps = ComponentProps<typeof SwitchPrimitive.Root>

export const SwitchBase = ({ className, ...props }: SwitchBaseProps) => {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'relative rounded-full w-10 h-6 cursor-pointer select-none border-0 outline-none transition-colors duration-200 ease-in-out',
        'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#4940e0] data-[state=checked]:to-[#a39dff]',
        'data-[state=unchecked]:bg-[#3e4152]',
        'focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block h-[20px] w-[20px] rounded-full bg-white shadow-sm ring-0',
          'transition-all duration-200 ease-in-out',
          'data-[state=checked]:translate-x-[calc(100%-2px)]',
          'data-[state=unchecked]:translate-x-[calc(0%+2px)]'
        )}
      />
    </SwitchPrimitive.Root>
  )
}
