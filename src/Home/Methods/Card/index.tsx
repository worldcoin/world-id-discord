import cn from 'classnames'
import { Icon } from 'common/Icon'
import Image from 'next/image'
import { memo } from 'react'

export const Card = memo(function Card(props: {
  heading: string
  pros: Array<string>
  decorationLayout: 'phone' | 'orb'
}) {
  return (
    <div className="grid gap-y-12 p-16 bg-111318 rounded-3xl border border-ffffff/20 relative overflow-clip">
      <Image
        className={cn(
          'absolute',
          { 'top-5 -left-[290px] opacity-50': props.decorationLayout === 'phone' },
          { 'top-[25%] -left-[330px] rotate-12 opacity-40': props.decorationLayout === 'orb' },
        )}
        width={432}
        height={396}
        src="/images/home/honeycombs-triangle.svg"
        alt="decoration"
      />

      <Image
        className={cn(
          'absolute',
          { 'right-5 -bottom-[340px]': props.decorationLayout === 'phone' },
          { '-rotate-[105deg] top-4 -right-[300px] opacity-60': props.decorationLayout === 'orb' },
        )}
        width={432}
        height={396}
        src="/images/home/honeycombs-triangle.svg"
        alt="decoration"
      />

      <h4 className="text-40 text-center">{props.heading}</h4>

      <ul className="grid gap-y-4">
        {props.pros.map((p, i) => (
          <li
            className="grid grid-flow-col justify-center justify-items-center items-center gap-x-2"
            key={`pros-${props.heading}-${i}`}
          >
            <div className="w-5 h-5 bg-gradient-to-r from-4940e0 to-a39dff rounded-full flex justify-center items-center">
              <Icon name="check" className="w-3 h-3 text-111318" />
            </div>
            <span className="text-20 font-rubik text-ffffff/70 leading-loose">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  )
})
