import {ModalPageLayout} from 'common/ModalPageLayout'
import {memo, useState} from 'react'
import {ErrorScene} from './ErrorScene'
import {InitialScene} from './InitialScene'
import {SuccessScene} from './SuccessScene'
import {Scene} from './types'

export const Verification = memo(function Verification() {
  const [scene, setScene] = useState<Scene>(Scene.Initial)
  const [loading, setLoading] = useState(false)
  return (
    <ModalPageLayout loading={loading} className="p-6 grid gap-y-6">
      {scene === Scene.Initial && <InitialScene setScene={setScene} setLoading={setLoading} />}
      {scene === Scene.Success && <SuccessScene />}
      {scene === Scene.Error && <ErrorScene />}
    </ModalPageLayout>
  )
})
