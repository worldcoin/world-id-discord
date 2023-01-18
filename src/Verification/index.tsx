import {ISuccessResult} from '@worldcoin/idkit'
import {Option} from 'Admin/types/option'
import {Header} from 'common/Header'
import {InfoLine} from 'common/InfoLine'
import {Layout} from 'common/Layout'
import {Modal} from 'common/Modal'
import {APIGuild} from 'discord-api-types/v10'
import Image from 'next/image'
import {memo, useCallback, useState} from 'react'
import {ErrorScene} from './ErrorScene'
import {InitialScene} from './InitialScene'
import {SuccessScene} from './SuccessScene'
import {Scene} from './types'
import {VerificationCompletePayload} from 'common/types/verification-complete'

const actionId = 'get_this_from_the_dev_portal' // FIXME

const assignedRoles: Array<Option> = [
  {label: 'Moderator', value: 'Moderator'},
  {label: 'Server Admin', value: 'Server Admin'},
  {label: 'Community MVP', value: 'Community MVP'},
]

export const Verification = memo(function Verification(props: {
  guild: APIGuild
  rolesToAssign: {phone: Array<Option>; orb: Array<Option>}
  guildId: string
  userId: string
}) {
  const [scene, setScene] = useState<Scene>(Scene.Initial)
  const [loading, setLoading] = useState(false)

  const { guildId, userId } = props
  const complete = useCallback(async (result: ISuccessResult) => {
    try {
      setLoading(true)
      // FIXME: set discord roles here
      console.log(result)
      const payload: VerificationCompletePayload = {
        guildId,
        userId,
        result,
      }
      const res = await fetch('/api/verification/complete', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        throw await res.json()
      }
      setScene(Scene.Success)
    } catch (error) {
      setScene(Scene.Error)
    } finally {
      setLoading(false)
    }
  }, [guildId, userId])

  return (
    <Layout className="flex justify-center items-center relative">
      <Image src="/images/background.svg" fill alt="background" className="object-cover" />
      <Header hideLinks onTop />

      <Modal loading={loading} className="pt-6 px-12 pb-12 grid gap-y-6 max-w-[680px]">
        {scene === Scene.Initial && (
          <InitialScene
            actionId={actionId}
            signal={props.userId}
            complete={complete}
            setScene={setScene}
            setLoading={setLoading}
            guild={props.guild}
            roles={props.rolesToAssign}
          />
        )}
        {scene === Scene.Success && <SuccessScene assignedRoles={assignedRoles} />}
        {scene === Scene.Error && <ErrorScene actionId={actionId} signal={props.userId} complete={complete} />}
      </Modal>

      <InfoLine
        className="fixed bottom-0 inset-x-0"
        text="The Discord Bouncer helps prevent spam and increase the quality of the community by making sure everyone who joins is a human. "
      />
    </Layout>
  )
})
