import cn from 'classnames'
import {Button} from 'common/Button'
import {Icon} from 'common/Icon'
import {ModalPageLayout} from 'common/ModalPageLayout'
import {memo, useCallback, useState} from 'react'
import {RadioButton} from './RadioButton'
import {Selector} from './Selector'
import type {Option} from './types/option'

enum Credentials {
  PhoneNumber,
  Orb,
}

export const Admin = memo(function Admin() {
  const [active, setActive] = useState(false)
  const toggleActive = useCallback(() => setActive((p) => !p), [])

  //FIXME: update the initial value when real data will be available
  const [roles, setRoles] = useState<Array<Option>>([{label: 'test', value: 'test'}])
  const [selectedRoles, setSelectedRoles] = useState<Array<Option>>([])
  const [savingInProgress] = useState(false)
  const [savedSuccessfully] = useState<boolean | null>(null)
  const [formDataLoading] = useState(false)
  const [credentials, setCredentials] = useState<Credentials | null>(null)

  const toggleRoles = useCallback((value: Option) => {
    setSelectedRoles((prevValues) => {
      if (prevValues.includes(value)) {
        return prevValues.filter((prevValue) => prevValue !== value)
      }

      return [...prevValues, value]
    })
  }, [])

  const saveChanges = useCallback(() => {
    console.log('saveChanges')
  }, [])

  const formValid = true

  return (
    <ModalPageLayout loading={formDataLoading}>
      <div className="grid grid-flow-col justify-between auto-cols-max items-center p-8 border-b border-[color:inherit]">
        <span className="text-20 font-semibold">Discord Bouncer Admin</span>

        <a className="hover:opacity-70 transition-opacity p-2" href="/">
          <Icon className="w-5 h-5 md:w-2.5 md:h-2.5" name="cross" />
        </a>
      </div>

      <div className="grid grid-cols-[100%] gap-y-8.5 px-8 pt-12 pb-4">
        <div className="grid grid-flow-col justify-between">
          <span>Bot Status</span>
          <span
            className={cn(
              'relative rounded-full p-0.5 w-10 h-6 cursor-pointer select-none',
              'before:absolute before:h-[20px] before:aspect-square before:top-2px before:bg-ffffff',
              'before:rounded-full before:transition-all before:ease-in-out',
              {
                'bg-gradient-81.5 from-4940e0 to-a39dff before:left-[calc(100%-2px)] before:-translate-x-full': active,
              },
              {'bg-3e4152 before:left-0.5': !active},
            )}
            onClick={toggleActive}
          />
        </div>

        <div className="mt-8">
          <span>Choose a credential</span>

          <div className="grid grid-cols-2 gap-x-4 pt-4">
            <RadioButton
              icon="mobile-device"
              title="Phone number"
              description="For actions that are triggered with an API or used in person. "
              selected={credentials === Credentials.PhoneNumber}
              onClick={() => setCredentials(Credentials.PhoneNumber)}
            />

            <RadioButton
              icon="orb"
              title="Orb"
              description="For actions that are triggered with an API or used in person. "
              selected={credentials === Credentials.Orb}
              onClick={() => setCredentials(Credentials.Orb)}
            />
          </div>
        </div>

        <div className="mt-6">
          <span>Roles to assign</span>

          <Selector
            className="mt-4"
            options={roles}
            setOptions={setRoles}
            selected={selectedRoles}
            onChange={toggleRoles}
            placeholder="Choose a role"
            info="You can create more roles in your Discord server settings"
          />

          <span className="block mt-3 font-rubik text-6673b9">
            These are the roles that a verified person will get assigned
          </span>
        </div>

        <div className="grid justify-items-center gap-y-4 mt-12">
          <Button
            className="w-full font-sora disabled:opacity-20"
            disabled={!formValid || savingInProgress}
            onClick={saveChanges}
          >
            {savingInProgress ? 'Saving...' : 'Save changes'}
          </Button>

          <span
            className={cn(
              'transition-visibility/opacity col-start-1 row-start-2',
              {'visible opacity-100': savedSuccessfully === true},
              {'invisible opacity-0': savedSuccessfully !== true},
            )}
          >
            Your changes have been successfully saved!
          </span>

          <span
            className={cn(
              'transition-visibility/opacity col-start-1 row-start-2 text-red-500',
              {'visible opacity-100': savedSuccessfully === false},
              {'invisible opacity-0': savedSuccessfully !== false},
            )}
          >
            Something went wrong. Try again, please.
          </span>
        </div>
      </div>
    </ModalPageLayout>
  )
})
