'use client'

import { useId } from 'react'
import MultipleSelector from '@/features/admin/components/Multiselect/MultipleSelector'
import { MultiselectOption } from '@/features/admin/types/multiselect-option'
import { Label } from '@/components/Label'
import { Control, Path } from 'react-hook-form'
import { FieldValues } from 'react-hook-form'
import { FormField, FormItem } from '../Form'
import { useTranslations } from 'next-intl'
import { InformationCircleIcon } from '@/components/icons/InformationCircle'

type MultiselectProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  defaultOptions: MultiselectOption[]
  options: MultiselectOption[]
  label: string
  disabled?: boolean
  refresh?: () => Promise<void>
  refreshLabel?: string
}

export default function Multiselect<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  defaultOptions,
  label,
  options,
  disabled,
  refresh,
  refreshLabel,
}: MultiselectProps<TFieldValues>) {
  const id = useId()
  const t = useTranslations()

  return (
    <div className="*:not-first:mt-2">
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="grid gap-y-2.5">
            <Label htmlFor={id} className="text-sm leading-[1.4] text-white">
              {label}
            </Label>

            <MultipleSelector
              value={field.value}
              onChange={field.onChange}
              defaultOptions={defaultOptions}
              options={options}
              placeholder={t('Discord_Integration_Select_Placeholder')}
              hidePlaceholderWhenSelected
              disabled={disabled}
              emptyIndicator={
                <p className="text-center text-sm">
                  {t('Discord_Integration_No_Results_Found')}
                </p>
              }
              id={id}
              bottomListText={t('Discord_Integration_Add_More_Roles_Info')}
              bottomTextIcon={<InformationCircleIcon />}
              refresh={refresh}
              refreshLabel={refreshLabel}
            />
          </FormItem>
        )}
      />
    </div>
  )
}
