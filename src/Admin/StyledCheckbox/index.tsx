import cn from 'classnames'
import { Dispatch, memo, SetStateAction, useCallback } from 'react'

const state: Record<string, 'Disabled' | 'Enabled'> = {
  false: 'Disabled',
  true: 'Enabled',
}

export const StyledCheckbox = memo(function StyledCheckbox(props: {
  isOn: boolean
  setIsOn: Dispatch<SetStateAction<boolean>>
  className?: string
}) {
  const toggle = useCallback(() => props.setIsOn(!props.isOn), [props])

  return (
    <div className={cn('grid grid-cols-fr/auto items-center gap-x-2', props.className)}>
      <span className="font-rubik text-14 text-ffffff/40">{state[String(props.isOn)]}</span>

      <span
        className={cn(
          'relative rounded-full p-0.5 w-10 h-6 cursor-pointer select-none',
          'before:absolute before:h-[20px] before:aspect-square before:top-2px before:bg-ffffff',
          'before:rounded-full before:transition-all before:ease-in-out',
          {
            'bg-gradient-81.5 from-4940e0 to-a39dff before:left-[calc(100%-2px)] before:-translate-x-full': props.isOn,
          },
          { 'bg-3e4152 before:left-0.5': !props.isOn },
        )}
        onClick={toggle}
      />
    </div>
  )
})
