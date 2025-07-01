import Multiselect from './Multiselect'
import { Path, useFormContext } from 'react-hook-form'
import { MultiselectOption } from '../types/multiselect-option'
import { useTranslations } from 'next-intl'
import { ConfigFormValues } from '@/schemas/config-form'

type RolesSelectorProps = {
  name: Path<Pick<ConfigFormValues, 'deviceRoles' | 'orbRoles'>>
  label: string
  copy: () => void
  copyLabel: string
  roles: Array<MultiselectOption>
  disabled?: boolean
  defaultOptions?: MultiselectOption[]
  refresh: () => Promise<void>
}

export const RolesSelector = ({
  name,
  roles,
  label,
  copy,
  copyLabel,
  disabled,
  defaultOptions,
  refresh,
}: RolesSelectorProps) => {
  const { control } = useFormContext<ConfigFormValues>()
  const t = useTranslations()

  return (
    <div className="grid gap-y-2.5">
      <Multiselect
        control={control}
        name={name}
        defaultOptions={defaultOptions ?? []}
        label={label}
        disabled={disabled}
        options={roles}
        refresh={refresh}
        refreshLabel={t('Discord_Integration_Refresh_Roles')}
      />

      <div className="grid justify-end">
        <button
          className="block font-rubik text-[12px] text-[#938cfa] leading-4 cursor-pointer hover:text-[#6c64ee] transition-colors"
          type="button"
          onClick={copy}
        >
          {copyLabel}
        </button>
      </div>
    </div>
  )
}
