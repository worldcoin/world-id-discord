import cn from 'classnames'
import { GradientText } from 'common/GradientText'
import { memo } from 'react'

const items = [
  {
    title: 'Only humans',
    content: ['Protect certain actions so only', 'humans can perform them.'],
  },
  {
    title: 'Complete flexibility',
    content: [
      'The Discord Bouncer will assign a role to verified humans.',
      'You can choose what users can do with that role.',
    ],
  },
  {
    title: 'Anonymous and private',
    content: ['No personal information needed or shared.', 'Just verify humans.'],
  },
  {
    title: 'Better community controls',
    content: ['Now when you ban a bad actor', 'they won’t return with another account.'],
  },
]

export const Benefits = memo(function Benefits() {
  return (
    <div className="grid grid-cols-container mt-12 md:mt-72 px-4 md:px-8">
      <div className="grid gap-y-14 md:gap-y-20 col-start-2">
        <div className="text-center justify-self-center">
          <span className="uppercase font-bold text-caption text-white">World ID benefits</span>

          <GradientText as="h2" className="max-w-[560px] mx-auto uppercase text-heading md:text-heading-md mt-3">
            Why choose Discord Bouncer?
          </GradientText>

          <p className="max-w-[688px] mt-8 leading-7 font-rubik text-18 text-bcc5f9">
            Discord Bouncer removes bot spam and protects against sybil attacks on your Discord server. Additionally,
            it’s trustless and completely privacy-preserving.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 pb-28 lg:w-max lg:justify-self-center">
          {items.map((item, index) => (
            <div
              className={cn(
                'relative lg:even:top-28 lg:max-w-[532px] pt-12 px-12 pb-16 border border-f9f9f9/20 bg-111318 rounded-3xl',
              )}
              key={index}
            >
              <GradientText as="div" className="text-18 font-semibold">
                {(index + 1).toString().padStart(2, '0')}
              </GradientText>
              <GradientText as="h3" className="mt-12 mb-3 text-32 font-semibold tracking-tight">
                {item.title}
              </GradientText>
              {item.content.map((line, i) => (
                <p key={i} className="font-rubik text-16 text-bcc5f9 leading-6">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})
