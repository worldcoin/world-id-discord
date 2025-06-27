'use client'

import { LogoIcon } from '@/components/icons/Logo'
import { ConfigFormValues } from '@/schemas/config-form'
import { VerificationCompleteInput } from '@/schemas/verification-complete'
import { ExternalFetchError } from '@/utils/external-fetch-error'
import { routes } from '@/utils/routes'
import { fetcher } from '@/utils/swr-fetcher'
import { ISuccessResult } from '@worldcoin/idkit'
import { APIGuild } from 'discord-api-types/v10'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { Scene } from '../types/scene'
import {
  VerificationCompleteErrorResponsePayload,
  VerificationCompleteSuccessResponsePayload,
} from '../types/verification-complete-response-payload'
import { VerificationError } from '../types/verification-error'
import { ErrorScene } from './ErrorScene'
import { InitialScene } from './InitialScene'
import { SuccessScene } from './SuccessScene'

type VerificationScreenProps = {
  configFormValues: ConfigFormValues
  guild: APIGuild
}

const verificationCompleteFetcher = async (
  url: string,
  { arg }: { arg: VerificationCompleteInput }
) =>
  fetcher<VerificationCompleteSuccessResponsePayload, VerificationCompleteErrorResponsePayload>(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(arg),
    }
  )

export const VerificationScreen = ({ configFormValues, guild }: VerificationScreenProps) => {
  const [scene, setScene] = useState<Scene>(Scene.Initial)
  const [verificationError, setVerificationError] = useState<VerificationError>(
    VerificationError.Unknown
  )

  const {
    data,
    isMutating: loading,
    trigger: completeVerification,
    error,
  } = useSWRMutation<
    VerificationCompleteSuccessResponsePayload,
    ExternalFetchError<VerificationCompleteErrorResponsePayload>,
    string,
    VerificationCompleteInput
  >(routes.api.verification.complete(), verificationCompleteFetcher)

  const searchParams = useSearchParams()
  const guildId = searchParams.get('guild_id')
  const userId = searchParams.get('user_id')
  const token = searchParams.get('token')
  const interactionsToken = searchParams.get('interactions_token')

  const complete = async (result: ISuccessResult) => {
    if (!guildId || !userId || !token || !interactionsToken) {
      setVerificationError(VerificationError.Unknown)
      return setScene(Scene.Error)
    }

    const input: VerificationCompleteInput = {
      appId: process.env.NEXT_PUBLIC_APP_ID! as `app_${string}`,
      guildId,
      userId,
      token,
      result,
      interactionsToken,
    }

    await completeVerification(input)
  }

  useEffect(() => {
    if (error) {
      setVerificationError(error.cause.data?.errorCode ?? VerificationError.Unknown)
      setScene(Scene.Error)
    }

    if (data?.assignedRoles) {
      setScene(Scene.Success)
    }
  }, [error, data?.assignedRoles])

  return (
    <div className="p-7 h-full sm:min-h-[555px] max-w-[480px] grid">
      {loading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <LogoIcon className="w-16 h-16 animate animate-ping" />
        </div>
      )}

      {scene === Scene.Initial && (
        <InitialScene configFormValues={configFormValues} complete={complete} guild={guild} />
      )}

      {scene === Scene.Success && data?.assignedRoles && (
        <SuccessScene assignedRoles={data.assignedRoles} />
      )}

      {scene === Scene.Error && (
        <ErrorScene
          guild={guild}
          complete={complete}
          error={verificationError}
          configFormValues={configFormValues}
        />
      )}
    </div>
  )
}
