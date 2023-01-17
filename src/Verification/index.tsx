import {Option} from 'Admin/types/option'
import {Header} from 'common/Header'
import {InfoLine} from 'common/InfoLine'
import {Layout} from 'common/Layout'
import {Modal} from 'common/Modal'
import Image from 'next/image'
import {memo, useState} from 'react'
import {ErrorScene} from './ErrorScene'
import {InitialScene} from './InitialScene'
import {SuccessScene} from './SuccessScene'
import {Scene} from './types'

const assignedRoles: Array<Option> = [
  {label: 'Moderator', value: 'Moderator'},
  {label: 'Server Admin', value: 'Server Admin'},
  {label: 'Community MVP', value: 'Community MVP'},
]

export const Verification = memo(function Verification() {
  const [scene, setScene] = useState<Scene>(Scene.Initial)
  const [loading, setLoading] = useState(false)

  return (
    <Layout className="flex justify-center items-center relative">
      <Image src="/images/background.svg" fill alt="background" className="object-cover" />
      <Header hideLinks onTop />

      <Modal loading={loading} className="pt-6 px-12 pb-12 grid gap-y-6 max-w-[680px]">
        {scene === Scene.Initial && <InitialScene setScene={setScene} setLoading={setLoading} />}
        {scene === Scene.Success && <SuccessScene assignedRoles={assignedRoles} />}
        {scene === Scene.Error && <ErrorScene />}
      </Modal>

      <InfoLine
        className="fixed bottom-0 inset-x-0"
        text="The Discord Bouncer helps prevent spam and increase the quality of the community by making sure everyone who joins is a human. "
      />
    </Layout>
  )
})
