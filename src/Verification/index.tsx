import { CredentialType, ISuccessResult } from '@worldcoin/idkit'
import { Option } from 'Admin/types/option'
import { Header } from 'common/Header'
import { InfoLine } from 'common/InfoLine'
import { Layout } from 'common/Layout'
import { Modal } from 'common/Modal'
import { VerificationCompletePayload, VerificationCompleteResponsePayload } from 'common/types/verification-complete'
import { APIGuild, APIRole } from 'discord-api-types/v10'
import Image from 'next/image'
import { memo, useCallback, useState } from 'react'
import { ErrorScene } from './ErrorScene'
import { InitialScene } from './InitialScene'
import { SuccessScene } from './SuccessScene'
import { Scene, VerificationError } from './types'

export const Verification = memo(function Verification(props: {
  guild: APIGuild
  rolesToAssign: { device: Array<Option>; orb: Array<Option> }
  guildId: string
  userId: string
  token: string
  appId: string
  credentials: Array<CredentialType>
}) {
  const { guildId, userId, appId, token } = props
  const [scene, setScene] = useState<Scene>(Scene.Initial)
  const [loading, setLoading] = useState(false)
  const [assignedRoles, setAssignedRoles] = useState<Array<APIRole>>([])
  const [verificationError, setVerificationError] = useState<VerificationError>(VerificationError.Unknown)

  const complete = useCallback(
    async (result: ISuccessResult) => {
      try {
        setLoading(true)

        const payload: VerificationCompletePayload = {
          guildId,
          userId,
          token,
          result,
        }

        const res = await fetch('/api/verification/complete', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const completeResult = await res.json()

          if (completeResult.code === 'already_verified') {
            setVerificationError(VerificationError.AlreadyVerified)
            return setScene(Scene.Error)
          }
        }

        const resPayload = (await res.json()) as VerificationCompleteResponsePayload
        setAssignedRoles(resPayload.assignedRoles)
        setScene(Scene.Success)
      } catch (error) {
        setScene(Scene.Error)
      } finally {
        setLoading(false)
      }
    },
    [guildId, userId, token],
  )

  return (
    <Layout title="Verification" className="flex justify-center items-center relative py-28">
      <Image src="/images/background.svg" fill alt="background" className="object-cover" />
      <Header hideLinks onTop />

      <Modal loading={loading} className="p-12 grid gap-y-6 max-w-[500px]">
        {scene === Scene.Initial && (
          <InitialScene
            action={guildId}
            app_id={appId}
            signal={userId}
            complete={complete}
            setScene={setScene}
            setLoading={setLoading}
            guild={props.guild}
            roles={props.rolesToAssign}
            credentials={props.credentials}
          />
        )}
        {scene === Scene.Success && <SuccessScene guild={props.guild} assignedRoles={assignedRoles} />}

        {scene === Scene.Error && (
          <ErrorScene
            guild={props.guild}
            action={guildId}
            app_id={appId}
            signal={userId}
            complete={complete}
            credentials={props.credentials}
            error={verificationError}
          />
        )}
      </Modal>

      <InfoLine
        className="fixed bottom-0 inset-x-0 z-50"
        text="The Discord Bouncer helps prevent spam and increase the quality of the community by making sure everyone who joins is a human. "
      />
    </Layout>
  )
})
