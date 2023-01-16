import {Layout} from 'common/Layout'
import {useRouter} from 'next/router'
import {useMemo} from 'react'

// FIXME: replace with real verification page
export default function Verification() {
  const router = useRouter()
  const actionId = useMemo(() => router.query.action_id as string, [router])

  return (
    <Layout>
      <div className="grid gap-2 min-h-screen text-center">
        <div>
          <h1>Verify</h1>
          <p>
            Action Id: <b>{actionId}</b>
          </p>
        </div>
      </div>
    </Layout>
  )
}
