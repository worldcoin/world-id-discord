'use client'

import { Modal } from '@/components/Modal'
import Image from 'next/image'
import { useEffect } from 'react'

export default function Error({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Modal>
      <div className="p-7 h-full  max-w-[480px] grid content-start">
        <div className="relative w-12 h-12">
          <Image src="/images/verification/alert.svg" fill alt={''} />
        </div>

        <h1 className="mt-6 leading-8 font-semibold text-24">Something went wrong!</h1>
      </div>
    </Modal>
  )
}
