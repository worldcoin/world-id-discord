import cn from 'classnames'
import {GradientText} from 'common/GradientText'
import {memo} from 'react'

const items = [
  {
    title: 'Only humans',
    content: 'Protect certain actions so only humans can perform them.',
  },
  {
    title: 'Complete flexibility',
    content:
      'The Discord Bouncer will assign a role to verified humans. You can choose what users can do with that role.',
  },
  {
    title: 'Anonymous and private',
    content: 'No personal information needed or shared. Just verify humans.',
  },
  {
    title: 'Better community controls',
    content: 'Now when you ban a user you can be sure they won’t return with another account.',
  },
]

export const Benefits = memo(function Benefits() {
  return (
    <div className="grid grid-cols-container mt-12 md:mt-72 px-4 md:px-8">
      <div className="grid gap-y-14 md:gap-y-20 col-start-2">
        <div className="text-center md:w-min justify-self-center">
          <span className="font-bold uppercase text-14 text-96a0db">DISCORD BOUNCER BENEFITS</span>

          <GradientText as="h2" className="text-36 md:text-64 font-semibold mt-4 md:whitespace-nowrap">
            Why choose Discord Bouncer?
          </GradientText>

          <p className="mt-8 md:px-16 md:text-18 text-bcc5f9">
            Discord Bouncer removes bot spam and protects against sybil attacks on your Discord server. Additionally,
            it’s trustless and completely privacy-preserving.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <div
              className={cn(
                'grid place-items-start place-content-start border border-f9f9f9/20 bg-111318 p-8 rounded-lg',
              )}
              key={index}
            >
              <span className="font-medium text-42 md:text-72">{(index + 1).toString().padStart(2, '0')}</span>
              <span className="text-20 md:text-24 font-semibold mt-4 md:mt-8">{item.title}</span>
              <p className="font-rubik text-ffffff/70 mt-4">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})
