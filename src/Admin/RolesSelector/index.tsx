import { StyledCheckbox } from 'Admin/StyledCheckbox'
import { Option } from 'Admin/types/option'
import cn from 'classnames'
import { Icon, IconType } from 'common/Icon'
import { APIRole } from 'discord-api-types/v10'
import { Dispatch, memo, SetStateAction, useCallback, useState } from 'react'
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
  const [isFetching, setIsFetching] = useState(false)
  const refetchRoles = useCallback(() => {
    setIsFetching(true)
    fetch('/api/admin/roles', {})
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        const roles = data.roles as APIRole[]
        const options = roles.map((role) => ({
          label: role.name,
          value: role.id,
        }))
        props.setRoles(options)
        setIsFetching(false)
      })
  }, [props])

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
        <div className="grid grid-cols-fr/auto">
          Roles to assign
          <button
            className="grid grid-flow-col items-center gap-x-1 font-rubik text-14 text-938cfa leading-[1px]"
            onClick={refetchRoles}
          >
            <Icon name="reload" className="w-4 h-4" />
            Refresh Roles
          </button>
        </div>
        <Selector
          options={props.roles}
          setOptions={props.setRoles}
          selected={props.selectedRoles}
          setSelected={props.setSelectedRoles}
          isEnabled={props.isEnabled}
          setIsEnabled={props.setIsEnabled}
          placeholder="Choose a role"
          info="You can create more roles in your Discord server settings"
          disabled={isFetching}
        />
      </div>
    </div>
  )
})
