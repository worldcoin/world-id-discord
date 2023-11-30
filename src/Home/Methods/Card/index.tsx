import { CredentialType } from '@worldcoin/idkit'
import cn from 'classnames'
import { Icon } from 'common/Icon'
import Image from 'next/image'
import { memo, ReactNode } from 'react'

export const Card = memo(function Card(props: {
  heading: string
  pros: Array<ReactNode>
  decorationLayout: CredentialType
}) {
  return (
    <div className="grid gap-y-12 p-16 bg-111318 rounded-3xl border border-ffffff/20 relative overflow-clip">
      <Image
        className={cn('absolute', {
          'top-[15px] left-[-295px] opacity-40': props.decorationLayout === CredentialType.Device,
          'top-[25%] left-[-330px] rotate-12 opacity-40': props.decorationLayout === CredentialType.Orb,
        })}
        width={432}
        height={396}
        src="/images/home/honeycombs-triangle.svg"
        alt="decoration"
      />

      <Image
        className={cn('absolute', {
          'bottom-[-375px] right-[65px] opacity-60': props.decorationLayout === CredentialType.Device,
          'top-4 right-[-285px] -rotate-[105deg] opacity-60': props.decorationLayout === CredentialType.Orb,
        })}
        width={432}
        height={396}
        src="/images/home/honeycombs-triangle.svg"
        alt="decoration"
      />

      <h4 className="font-medium text-32 text-center">{props.heading}</h4>

      <ul className="grid gap-y-4">
        {props.pros.map((p, i) => (
          <li
            className="grid grid-flow-col justify-center justify-items-center items-center gap-x-2"
            key={`pros-${props.heading}-${i}`}
          >
            <div className="w-5 h-5 bg-gradient-to-r from-4940e0 to-a39dff rounded-full flex justify-center items-center">
              <Icon name="check" className="w-3 h-3 text-111318" />
            </div>
            <span className="font-rubik leading-6 text-20 text-bcc5f9">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  )
})
