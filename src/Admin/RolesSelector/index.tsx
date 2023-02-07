import { StyledCheckbox } from 'Admin/StyledCheckbox'
import { Option } from 'Admin/types/option'
import cn from 'classnames'
import { Icon, IconType } from 'common/Icon'
import { Dispatch, memo, SetStateAction } from 'react'
import { Selector } from './Selector'

export const RolesSelector = memo(function RolesSelector(props: {
  icon: IconType
  name: string
  description: string
  className?: string
  roles: Array<Option>
  setRoles: Dispatch<SetStateAction<Option[]>>
  selectedRoles: Array<Option>
  setSelectedRoles: Dispatch<SetStateAction<Array<Option>>>
  isEnabled: boolean
  setIsEnabled: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <div className={cn('grid gap-y-6', props.className)}>
      <div className="grid gap-y-2.5">
        <div className="flex justify-between">
          <div className="grid grid-cols-auto/fr gap-x-2 items-center">
            <Icon name={props.icon} className="w-5 h-5 text-fffff" />
            <span className="text-14 font-semibold">{props.name}</span>
          </div>

          <StyledCheckbox isOn={props.isEnabled} setIsOn={props.setIsEnabled} />
        </div>

        <span className="font-rubik text-14 text-ffffff/40">{props.description}</span>
      </div>

      <div className="grid gap-y-3">
        <span>Roles to assign</span>

        <Selector
          options={props.roles}
          setOptions={props.setRoles}
          selected={props.selectedRoles}
          setSelected={props.setSelectedRoles}
          isEnabled={props.isEnabled}
          setIsEnabled={props.setIsEnabled}
          placeholder="Choose a role"
          info="You can create more roles in your Discord server settings"
        />
      </div>
    </div>
  )
})
