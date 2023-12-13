import cn from 'classnames'
import { Button } from 'common/Button'
import { GuildLabel } from 'common/GuildLabel'
import { Layout } from 'common/Layout'
import { Modal } from 'common/Modal'
import { BotConfig } from 'common/types'
import { APIGuild, APIRole } from 'discord-api-types/v10'
import { generateGuildImage } from 'helpers'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { RolesSelector } from './RolesSelector'
import { StyledCheckbox } from './StyledCheckbox'
import type { Option } from './types/option'

enum SaveConfigError {
  Unknown = 'Something went wrong. Try again, please.',
  EmptyRoles = 'Please, set at least one role at one of the credentials.',
}

export const Admin = memo(function Admin(props: {
  roles: APIRole[]
  guild: APIGuild
  initialConfig: BotConfig<'initial'>
}) {
  const [initialConfig, setInitialConfig] = useState<BotConfig<'initial'>>(props.initialConfig)

  const [roles, setRoles] = useState<Array<Option>>(() => {
    return props.roles.map((role) => ({
      label: role.name,
      value: role.id,
    }))
  })

  const [selectedDeviceRoles, setSelectedDeviceRoles] = useState<Array<Option>>(initialConfig.device?.roles ?? [])
  const [selectedOrbRoles, setSelectedOrbRoles] = useState<Array<Option>>(initialConfig.orb?.roles ?? [])
  const [savingInProgress, setSavingInProgress] = useState(false)
  const [savedSuccessfully, setSavedSuccessfully] = useState<boolean | null>(null)
  const [isBotEnabled, setIsBotEnabled] = useState(initialConfig.enabled || false)
  const [isDeviceVerificationEnabled, setIsDeviceVerificationEnabled] = useState(initialConfig.device?.enabled ?? false)
  const [isOrbVerificationEnabled] = useState(true)
  const [errorMessage, setErrorMessage] = useState<SaveConfigError>(SaveConfigError.Unknown)

  // NOTE: Removes saving status message from page after 3 seconds
  useEffect(() => {
    if (savedSuccessfully === null) {
      return
    }

    const timer = setTimeout(() => {
      setSavedSuccessfully(null)
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [savedSuccessfully])

  const botConfig = useMemo(
    () => ({
      enabled: isBotEnabled,
      guild_id: props.initialConfig.guild_id,

      device: {
        enabled: isDeviceVerificationEnabled,
        roles: selectedDeviceRoles.map((role) => role.value),
      },

      orb: {
        enabled: isOrbVerificationEnabled,
        roles: selectedOrbRoles.map((role) => role.value),
      },
    }),
    [
      isBotEnabled,
      isDeviceVerificationEnabled,
      isOrbVerificationEnabled,
      props.initialConfig.guild_id,
      selectedOrbRoles,
      selectedDeviceRoles,
    ],
  )

  const formIsClean = useMemo(() => {
    return (
      isBotEnabled === initialConfig.enabled &&
      isDeviceVerificationEnabled === initialConfig.device?.enabled &&
      selectedDeviceRoles.length === initialConfig.device?.roles.length &&
      isOrbVerificationEnabled === initialConfig.orb?.enabled &&
      selectedOrbRoles.length === initialConfig.orb?.roles.length
    )
  }, [
    isBotEnabled,
    isDeviceVerificationEnabled,
    isOrbVerificationEnabled,
    initialConfig,
    selectedDeviceRoles.length,
    selectedOrbRoles.length,
  ])

  const saveChanges = useCallback(() => {
    setSavingInProgress(true)

    if (selectedOrbRoles.length === 0) {
      setSavingInProgress(false)
      setErrorMessage(SaveConfigError.EmptyRoles)
      return setSavedSuccessfully(false)
    }

    fetch('/api/dynamodb/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(botConfig),
    })
      .then((response) => {
        if (response.ok) {
          setSavedSuccessfully(true)

          setInitialConfig({
            ...botConfig,
            device: {
              ...botConfig.device,
              roles: selectedDeviceRoles,
            },
            orb: {
              ...botConfig.orb,
              roles: selectedOrbRoles,
            },
          })
        } else {
          setErrorMessage(SaveConfigError.Unknown)
          setSavedSuccessfully(false)
        }

        setSavingInProgress(false)
      })
      .catch((error) => {
        console.error('Error:', error)
        setSavedSuccessfully(false)
        setSavingInProgress(false)
      })
  }, [botConfig, selectedDeviceRoles, selectedOrbRoles])

  const resetChanges = useCallback(() => {
    setSelectedDeviceRoles(initialConfig.device?.roles ?? [])
    setSelectedOrbRoles(initialConfig.orb?.roles ?? [])
    setIsBotEnabled(initialConfig.enabled ?? false)
    setIsDeviceVerificationEnabled(initialConfig.device?.enabled ?? false)
  }, [initialConfig])

  const guildImage = useMemo(() => {
    return generateGuildImage(props.guild.id, props.guild.icon)
  }, [props.guild.icon, props.guild.id])

  const copyRolesFromDevice = useCallback(() => {
    setSelectedOrbRoles(selectedDeviceRoles)
  }, [selectedDeviceRoles])

  const copyRolesFromOrb = useCallback(() => {
    setSelectedDeviceRoles(selectedOrbRoles)
  }, [selectedOrbRoles])

  return (
    <Layout title="Configuration" className="bg-black flex justify-center items-center relative min-h-screen">
      <Modal loading={false}>
        <div className="relative grid auto-cols-max items-center p-6 border-b border-gray-700">
          <div className="grid gap-y-3 justify-items-start w-full">
            <span className="text-20 font-semibold">Discord Admin</span>
            <GuildLabel image={guildImage} name={props.guild?.name ?? 'Your guild'} />
          </div>

          <StyledCheckbox isOn={isBotEnabled} setIsOn={setIsBotEnabled} className="absolute top-6 right-6" />
        </div>

        <div className="grid grid-cols-[100%] gap-y-6 p-6">
          <div className="grid gap-y-2">
            <span>Verification levels - Credentials</span>

            <p className="font-rubik text-14 text-grey-400">
              Select the relevant verification level and accepted credentials for your server.
            </p>
          </div>

          <div className="grid gap-y-6">
            <div className="grid gap-y-8">
              <RolesSelector
                icon="mobile-device"
                name="Device"
                description="Verifies that a user has a unique mobile device. Medium-strength bot resistance with a simple experience for users."
                roles={roles}
                setRoles={setRoles}
                selectedRoles={selectedDeviceRoles}
                setSelectedRoles={setSelectedDeviceRoles}
                isEnabled={isDeviceVerificationEnabled}
                setIsEnabled={setIsDeviceVerificationEnabled}
                copyLabel="Copy from Orb"
                copy={copyRolesFromOrb}
              />
            </div>

            <div className="grid gap-y-8">
              <RolesSelector
                icon="orb"
                name="Orb"
                description="Humanity verification. Completely privacy-preserving biometric verification with the Orb."
                highestSecurity
                roles={roles}
                setRoles={setRoles}
                selectedRoles={selectedOrbRoles}
                setSelectedRoles={setSelectedOrbRoles}
                isEnabled={isOrbVerificationEnabled}
                setIsEnabled={undefined}
                copyLabel="Copy from Device"
                copy={copyRolesFromDevice}
              />
            </div>
          </div>
        </div>

        <div className="grid justify-items-center p-6 pb-0 border-t border-grey-700">
          <div className="grid grid-cols-2 gap-x-4 w-full">
            <Button
              className=""
              variant="outlined"
              color="neutral"
              disabled={formIsClean || savingInProgress}
              onClick={resetChanges}
            >
              Cancel
            </Button>

            <Button
              className=""
              variant="contained"
              color="primary"
              disabled={formIsClean || savingInProgress}
              onClick={saveChanges}
            >
              {savingInProgress ? 'Saving...' : 'Save changes'}
            </Button>
          </div>

          <span
            className={cn(
              'transition-visibility/opacity col-start-1 row-start-2 text-sm leading-6',
              { 'visible opacity-100': savedSuccessfully === true },
              { 'invisible opacity-0': savedSuccessfully !== true },
            )}
          >
            Your changes have been successfully saved!
          </span>

          <span
            className={cn(
              'transition-visibility/opacity col-start-1 row-start-2 text-red-500 text-sm leading-6',
              { 'visible opacity-100': savedSuccessfully === false },
              { 'invisible opacity-0': savedSuccessfully !== false },
            )}
          >
            {errorMessage}
          </span>
        </div>
      </Modal>
    </Layout>
  )
})
