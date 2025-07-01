import { ReactNode } from 'react'
import { Switch } from './Switch'
import { Control, FieldValues, Path } from 'react-hook-form'

type VerificationLevelToggleProps<TFieldValues extends FieldValues = FieldValues> = {
  icon: ReactNode
  titleAddon?: ReactNode
  heading: string
  description: string
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  disabled?: boolean
}

export const VerificationLevelToggle = <TFieldValues extends FieldValues = FieldValues>({
  icon,
  titleAddon = null,
  name,
  description,
  heading,
  control,
  disabled,
}: VerificationLevelToggleProps<TFieldValues>) => {
  return (
    <div className="grid gap-y-2">
      <div className="flex justify-between">
        <div className="grid grid-cols-[auto_auto_1fr] gap-x-2 items-center">
          {icon}
          <span className="text-16 font-semibold">{heading}</span>
          {titleAddon}
        </div>

        <Switch control={control} name={name} disabled={disabled} />
      </div>

      <span className="max-w-[580px] font-rubik text-sm leading-[1.4] text-grey-400">
        {description}
      </span>
    </div>
  )
}
