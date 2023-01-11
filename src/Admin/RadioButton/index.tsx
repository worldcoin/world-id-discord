import {InputContainer} from 'Admin/common/InputContainer'
import cn from 'classnames'
import {Icon, IconType} from 'common/Icon'
import {memo} from 'react'

export const RadioButton = memo(function RadioButton(props: {
  icon: IconType
  title: string
  description: string
  selected: boolean
  onClick?: () => void
  className?: string
}) {
  return (
    <InputContainer
      className={cn('p-6 relative grid gap-y-3 cursor-pointer hover:bg-0c0e10/70 transition-colors', props.className)}
      onClick={props.onClick}
    >
      <div className="grid grid-cols-auto/fr items-center gap-x-2">
        <Icon name={props.icon} className="h-5 w-5 text-ffffff " />
        <span className="select-none text-14">{props.title}</span>
      </div>

      <p className="font-rubik select-none text-14 text-ffffff/40">{props.description}</p>

      <div
        className={cn(
          'absolute top-3 right-3 rounded-full w-5 h-5  flex justify-center items-center transition-colors',
          {'bg-gradient-to-r border-transparent from-4940e0 to-a39dff': props.selected},
          {
            'shadow-[0_0_0_1px_rgba(255,255,255,0.2)_inset] group-hover:shadow-[0_0_0_1px_rgba(102,115,185,0.5)_inset]':
              !props.selected,
          },
        )}
      >
        <Icon
          name="check"
          className={cn('h-4 w-4 text-ffffff', {'opacity-0 invisible select-none': !props.selected})}
        />
      </div>
    </InputContainer>
  )
})
