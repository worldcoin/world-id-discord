import { Layout } from 'common/Layout'
import { Modal } from 'common/Modal'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { memo, useEffect } from 'react'

export const Home = memo(function Home() {
  // Redirects user to Discord OAuth page
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE_ENABLED === 'true') {
      return
    }

    signIn('discord', { callbackUrl: '/admin' })
  }, [])

  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE_ENABLED === 'true') {
    return (
      <Layout title="Maintenance" className="flex justify-center items-center relative py-28">
        <Modal loading={false} className="p-7 flex flex-col max-w-[500px] min-h-[555px]">
          <div className="grow">
            <div className="relative w-12 h-12 mt-14">
              <Image src="/images/verification/alert.svg" fill alt={''} />
            </div>

            <h1 className="mt-6 leading-8 font-semibold text-24">🚧 System Under Maintenance</h1>

            <p className="mt-3 leading-6 font-rubik text-grey-400">
              We're currently performing scheduled maintenance to improve your experience. Please check back shortly.
            </p>
          </div>
        </Modal>
      </Layout>
    )
  }

  return null
})
