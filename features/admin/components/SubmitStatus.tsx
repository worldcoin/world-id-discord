'use client'

import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

type SubmitStatusProps = { className?: string }

enum SaveConfigError {
  Unknown = 'Unknown',
  EmptyRoles = 'EmptyRoles',
}

export const SubmitStatus = ({ className }: SubmitStatusProps) => {
  const t = useTranslations()
  const [status, setStatus] = useState<'success' | 'error' | null>(null)
  const [prevSubmitCount, setPrevSubmitCount] = useState(0)
  const [errorMessage, setErrorMessage] = useState<SaveConfigError | null>(null)
  const { formState, getValues } = useFormContext()
  const { submitCount, isSubmitSuccessful, isSubmitting } = formState

  const errorMessages = {
    [SaveConfigError.Unknown]: t('Discord_Integration_SaveConfigError_Unknown'),

    [SaveConfigError.EmptyRoles]: t('Discord_Integration_SaveConfigError_EmptyRoles'),
  }

  useEffect(() => {
    if (submitCount <= prevSubmitCount) {
      return
    }

    setPrevSubmitCount(submitCount)

    if (isSubmitSuccessful && !isSubmitting) {
      setStatus('success')
    } else {
      setStatus('error')

      const values = getValues()

      if (values.deviceRoles.length === 0 && values.orbRoles.length === 0) {
        setErrorMessage(SaveConfigError.EmptyRoles)
      } else {
        setErrorMessage(SaveConfigError.Unknown)
      }
    }
  }, [submitCount, prevSubmitCount, isSubmitSuccessful, isSubmitting, getValues])

  useEffect(() => {
    if (status !== null) {
      const timer = setTimeout(() => {
        setStatus(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [status])

  return (
    <div className={cn('grid grid-cols-1 grid-rows-1', className)}>
      <span
        className={cn(
          'transition-visibility/opacity col-start-1 row-start-1 text-sm leading-6 w-full text-center',
          { 'visible opacity-100': status === 'success' },
          { 'invisible opacity-0': status !== 'success' }
        )}
      >
        {t('Discord_Integration_Save_Config_Success')}
      </span>

      <span
        className={cn(
          'transition-visibility/opacity col-start-1 row-start-1 w-full text-center text-red-500 text-sm leading-6',
          { 'visible opacity-100': status === 'error' },
          { 'invisible opacity-0': status !== 'error' }
        )}
      >
        {errorMessage && errorMessages[errorMessage]}
      </span>
    </div>
  )
}
