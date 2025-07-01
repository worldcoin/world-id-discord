'use client'

import { Button } from '@/components/Button'
import { ConfigFormValues } from '@/schemas/config-form'
import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'

export const SubmitSection = () => {
  const t = useTranslations()

  const {
    formState: { isDirty, isSubmitting },
    reset,
  } = useFormContext<ConfigFormValues>()

  return (
    <section className="grid justify-items-center p-6 border-t border-grey-700">
      <div className="grid grid-cols-2 gap-x-4 w-full">
        <Button
          type="button"
          variant="outlined"
          color="neutral"
          disabled={!isDirty || isSubmitting}
          onClick={() => reset()}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!isDirty || isSubmitting}
        >
          {isSubmitting
            ? `${t('Discord_Integration_Saving')}...`
            : t('Discord_Integration_Save_Changes')}
        </Button>
      </div>
    </section>
  )
}
