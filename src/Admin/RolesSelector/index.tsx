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
  copyLabel: string
  copy: () => void
  highestSecurity?: boolean
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
    props.setIsEnabled(true) // NOTE: We keep it enabled by default
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
    <div className={cn('grid gap-y-4', props.className)}>
      <div className="grid gap-y-2">
        <div className="flex justify-between">
          <div className="grid grid-cols-auto/auto/fr gap-x-2 items-center">
            <Icon name={props.icon} className="w-5 h-5 text-fffff" />

            <span className="text-16 font-semibold">{props.name}</span>

            {props.highestSecurity && (
              <span className="ml-2 px-3 leading-6 text-12 text-928bf9 bg-6c64ee/20 rounded-lg">Highest security</span>
            )}
          </div>

          <StyledCheckbox isOn={props.isEnabled} setIsOn={props.setIsEnabled} />
        </div>

        <span className="max-w-[580px] font-rubik text-14 text-grey-400">{props.description}</span>
      </div>

      <div className="grid gap-y-2.5">
        <div className="grid grid-cols-fr/auto">
          <div className="text-14 leading-5">Roles to assign</div>
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
          onExpanded={refetchRoles}
        />

        <div className="grid justify-end">
          <button className="block font-rubik text-12 text-938cfa leading-4" onClick={props.copy}>
            {props.copyLabel}
          </button>
        </div>
      </div>

      {/*<div className="grid gap-y-2.5">*/}
      {/*  <div className="flex justify-between">*/}
      {/*    <div className="grid grid-cols-auto/auto/fr gap-x-2 items-center">*/}
      {/*      <Icon name={props.icon} className="w-5 h-5 text-fffff" />*/}

      {/*      <span className="text-16 font-semibold">{props.name}</span>*/}

      {/*      {props.highestSecurity && (*/}
      {/*        <span className="ml-2 px-3 leading-6 text-12 text-928bf9 bg-6c64ee/20 rounded-lg">Highest security</span>*/}
      {/*      )}*/}
      {/*    </div>*/}

      {/*    <StyledCheckbox isOn={props.isEnabled} setIsOn={props.setIsEnabled} />*/}
      {/*  </div>*/}

      {/*  <span className="max-w-[580px] font-rubik text-14 text-grey-400">{props.description}</span>*/}
      {/*</div>*/}

      {/*<div className="grid">*/}
      {/*  <div className="grid grid-cols-fr/auto">*/}
      {/*    <div className="text-12 leading-8">Roles to assign</div>*/}
      {/*  </div>*/}

      {/*  <Selector*/}
      {/*    options={props.roles}*/}
      {/*    setOptions={props.setRoles}*/}
      {/*    selected={props.selectedRoles}*/}
      {/*    setSelected={props.setSelectedRoles}*/}
      {/*    isEnabled={props.isEnabled}*/}
      {/*    setIsEnabled={props.setIsEnabled}*/}
      {/*    placeholder="Choose a role"*/}
      {/*    info="You can create more roles in your Discord server settings"*/}
      {/*    disabled={isFetching}*/}
      {/*    onExpanded={refetchRoles}*/}
      {/*  />*/}

      {/*  <div className="grid justify-end">*/}
      {/*    <button className="block font-rubik text-12 text-938cfa leading-8" onClick={props.copy}>*/}
      {/*      {props.copyLabel}*/}
      {/*    </button>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  )
})
