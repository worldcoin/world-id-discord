'use client'

import { Button } from '@/components/Button'
import { resolveWorldIdEnvironment } from '@/lib/world-id/resolve-environment'
import { ConfigFormValues } from '@/schemas/config-form'
import { routes } from '@/utils/routes'
import { IDKitRequestWidget, IDKitResult, RpContext } from '@worldcoin/idkit'
import { APIGuild } from 'discord-api-types/v10'
import { useSearchParams } from 'next/navigation'
import { ReactNode, useState } from 'react'
import { calculateVerificationPreset } from '../utils/calculate-verification-preset'

type WorldIdVerifyButtonProps = {
  configFormValues: ConfigFormValues
  guild: APIGuild
  label: ReactNode
  onSuccess: (result: IDKitResult) => Promise<void>
  onContextError: () => void
}

type RpContextResponse = {
  rp_id: string
  nonce: string
  created_at: number
  expires_at: number
  signature: string
}

/**
 * The /verify button and its IDKit 4 widget.
 *
 * IDKit 4 requires an RP context signed by the server before a proof can be
 * requested, so the context is fetched (fresh, per attempt) when the button
 * is clicked and the widget is opened once it arrives. The widget is
 * controlled in 4.x; there is no render prop API anymore.
 */
export const WorldIdVerifyButton = ({
  configFormValues,
  guild,
  label,
  onSuccess,
  onContextError,
}: WorldIdVerifyButtonProps) => {
  const searchParams = useSearchParams()
  const userId = searchParams.get('user_id')
  const token = searchParams.get('token')
  const interactionsToken = searchParams.get('interactions_token')

  const [open, setOpen] = useState(false)
  const [rpContext, setRpContext] = useState<RpContext | null>(null)

  const appId = process.env.NEXT_PUBLIC_APP_ID

  if (!appId || !userId) {
    return null
  }

  const openWidget = async () => {
    try {
      const response = await fetch(routes.api.verification.rpContext(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guildId: guild.id, userId, token, interactionsToken }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch RP context')
      }

      const context = (await response.json()) as RpContextResponse

      setRpContext({
        rp_id: context.rp_id,
        nonce: context.nonce,
        created_at: context.created_at,
        expires_at: context.expires_at,
        signature: context.signature,
      })
      setOpen(true)
    } catch {
      onContextError()
    }
  }

  return (
    <>
      <Button type="button" variant="contained" color="primary" onClick={openWidget}>
        {label}
      </Button>

      {rpContext && (
        <IDKitRequestWidget
          open={open}
          onOpenChange={setOpen}
          app_id={appId}
          action={guild.id}
          action_description={`verify in ${guild.name} server.`}
          rp_context={rpContext}
          environment={resolveWorldIdEnvironment()}
          allow_legacy_proofs
          preset={calculateVerificationPreset(configFormValues, userId)}
          onSuccess={onSuccess}
        />
      )}
    </>
  )
}
