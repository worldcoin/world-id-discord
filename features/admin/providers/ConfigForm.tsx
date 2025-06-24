'use client'

import { ReactNode, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { ConfigFormValues, craftConfigFormSchema } from '@/schemas/config-form'
import useSWRMutation from 'swr/mutation'
import { routes } from '@/utils/routes'
import { fetcher } from '@/utils/swr-fetcher'
import { ApiResponse } from '@/types/discord-integration-api/api-response'
import { CreateActionResponse } from '../types/create-action'

type ConfigFormProps = { children: ReactNode; initialValues?: ConfigFormValues }

const configFormFetcher = (url: string, { arg }: { arg: ConfigFormValues }) =>
  fetcher<ApiResponse>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  })

const createActionFetcher = (url: string) =>
  fetcher<CreateActionResponse>(url, { method: 'POST' })

export const ConfigForm = ({ children, initialValues }: ConfigFormProps) => {
  const t = useTranslations()
  const schema = useMemo(() => craftConfigFormSchema(t), [t])

  const { trigger: saveConfig } = useSWRMutation<
    ApiResponse,
    unknown,
    string,
    ConfigFormValues
  >(routes.api.admin.botConfig(), configFormFetcher)

  const { trigger: createAction } = useSWRMutation<
    CreateActionResponse,
    unknown,
    string,
    undefined
  >(routes.api.admin.createAction(), createActionFetcher)

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: initialValues,
  })

  const submit = async (data: ConfigFormValues) => {
    const createActionResponse = await createAction()
    const saveConfigResponse = await saveConfig(data)

    if (saveConfigResponse.success && createActionResponse.success) {
      form.reset(form.getValues(), { keepSubmitCount: true })
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(submit)}>{children}</form>
    </FormProvider>
  )
}
