import cn from 'classnames'
import {Button} from 'common/Button'
import {Header} from 'common/Header'
import {Layout} from 'common/Layout'
import {Modal} from 'common/Modal'
import Image from 'next/image'
import {memo, useCallback, useState} from 'react'
import {RolesSelector} from './RolesSelector'
import {StyledCheckbox} from './StyledCheckbox'
import type {Option} from './types/option'

export const Admin = memo(function Admin() {
  //FIXME: update the initial value when real data will be available
  const [roles, setRoles] = useState<Array<Option>>([
    {label: 'Role #1', value: 'role1'},
    {label: 'Role #2', value: 'role2'},
  ])

  const [selectedPhoneRoles, setSelectedPhoneRoles] = useState<Array<Option>>([])
  const [selectedOrbRoles, setSelectedOrbRoles] = useState<Array<Option>>([])
  const [savingInProgress] = useState(false)
  const [savedSuccessfully] = useState<boolean | null>(null)
  const [formDataLoading] = useState(false)

  const saveChanges = useCallback(() => {
    console.log('saveChanges')
  }, [])

  const formValid = true

  const guildData = {
    image: '/images/orb.png',
    name: 'Official Fortnite',
  }

  return (
    <Layout className="bg-0d1020 flex justify-center items-center relative min-h-screen">
      <Image src="/images/admin/background.svg" alt="Background" fill className="object-cover" />

      <Header hideLinks onTop />

      <Modal loading={formDataLoading}>
        <div className="relative grid justify-center auto-cols-max items-center p-6 border-b border-[color:inherit]">
          <div className="grid gap-y-3 justify-items-center w-full">
            <span className="text-20 font-semibold">Discord Bouncer Admin</span>

            <div className="grid items-center grid-cols-fr/auto py-2 px-3 bg-ffffff/10 rounded-lg gap-x-2">
              {/* FIXME: pass real data  */}
              <Image src={guildData.image} alt="Discord guild logo" width={24} height={24} className="rounded-full" />
              <span>{guildData.name}</span>
            </div>
          </div>

          <StyledCheckbox className="absolute top-6 right-6" />
        </div>

        <div className="grid grid-cols-[100%] gap-y-8.5 px-8 pt-12 pb-4">
          <div className="grid gap-y-2">
            <span>Credentials</span>

            <p className="font-rubik text-14 text-ffffff/40">
              The server configuration allows you to manage the various components of your Discord Bouncer.
            </p>
          </div>

          <div className="grid gap-y-8">
            <RolesSelector
              icon="mobile-device"
              name="Phone Number"
              description="A single-use code will be delivered via SMS."
              className="mt-4"
              roles={roles}
              setRoles={setRoles}
              selectedRoles={selectedPhoneRoles}
              setSelectedRoles={setSelectedPhoneRoles}
            />

            <RolesSelector
              icon="orb"
              name="Orb"
              description="Completely private iris imaging with a device called an orb."
              className="mt-4"
              roles={roles}
              setRoles={setRoles}
              selectedRoles={selectedOrbRoles}
              setSelectedRoles={setSelectedOrbRoles}
            />
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
      </Modal>
    </Layout>
  )
})
