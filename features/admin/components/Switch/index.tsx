'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'
import { SwitchBase } from './SwitchBase'
import { Messages, useTranslations } from 'next-intl'
import { Control, FieldValues, Path } from 'react-hook-form'
import { FormField, FormItem, FormControl } from '../Form'
import { Label } from '@/components/Label'
import clsx from 'clsx'

type SwitchProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  disabled?: boolean
}

export const Switch = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  disabled,
}: SwitchProps<TFieldValues>) => {
  const t = useTranslations()

  const state: Record<
    string,
    Messages['Discord_Integration_Disabled'] | Messages['Discord_Integration_Enabled']
  > = {
    false: t('Discord_Integration_Disabled'),
    true: t('Discord_Integration_Enabled'),
  }

  const id = useId()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={clsx('flex items-center gap-x-2', { grayscale: disabled })}>
          <Label
            htmlFor={id}
            className={cn('font-rubik font-medium text-sm', {
              'text-gray-400': !field.value,
              'text-[#938cfa]': field.value,
            })}
          >
            {state[String(field.value)]}
          </Label>

          <FormControl>
            <SwitchBase
              id={id}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
