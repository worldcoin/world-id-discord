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

const actionId = 'get_this_from_the_dev_portal' // FIXME
const signal = 'my_signal' // FIXME

const assignedRoles: Array<Option> = [
  {label: 'Moderator', value: 'Moderator'},
  {label: 'Server Admin', value: 'Server Admin'},
  {label: 'Community MVP', value: 'Community MVP'},
]

export const Verification = memo(function Verification(props: {
  guild: APIGuild
  rolesToAssign: {phone: Array<Option>; orb: Array<Option>} | null
}) {
  const [scene, setScene] = useState<Scene>(Scene.Initial)
  const [loading, setLoading] = useState(false)

  const complete = useCallback(async (result: ISuccessResult) => {
    try {
      setLoading(true)
      // FIXME: set discord roles here
      console.log(result)
      await new Promise((r) => setTimeout(r, 1500))
      setScene(Scene.Success)
    } catch (error) {
      setScene(Scene.Error)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <Layout className="flex justify-center items-center relative">
      <Image src="/images/background.svg" fill alt="background" className="object-cover" />
      <Header hideLinks onTop />

      <Modal loading={loading} className="pt-6 px-12 pb-12 grid gap-y-6 max-w-[680px]">
        {scene === Scene.Initial && (
          <InitialScene
            actionId={actionId}
            signal={signal}
            complete={complete}
            setScene={setScene}
            setLoading={setLoading}
            guild={props.guild}
            roles={props.rolesToAssign}
          />
        )}
        {scene === Scene.Success && <SuccessScene assignedRoles={assignedRoles} />}
        {scene === Scene.Error && <ErrorScene actionId={actionId} signal={signal} complete={complete} />}
      </Modal>

      <InfoLine
        className="fixed bottom-0 inset-x-0"
        text="The Discord Bouncer helps prevent spam and increase the quality of the community by making sure everyone who joins is a human. "
      />
    </Layout>
  )
})
