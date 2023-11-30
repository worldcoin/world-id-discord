import cn from 'classnames'
import { CSSProperties, memo } from 'react'

const iconNames = [
  'app-store',
  'chart',
  'check',
  'chevron',
  'cross',
  'discord',
  'external',
  'github',
  'info',
  'logo',
  'logo-full',
  'mobile-device',
  'mobile-device-huge',
  'orb',
  'orb-huge',
  'play-market',
  'reload',
  'world-id',
] as const

export type IconType = typeof iconNames[number]

export const Icon = memo(function Icon(
  props: {
    className?: string
    noMask?: boolean
    testId?: string
  } & (
    | {
        name: IconType
        path?: never
      }
    | {
        name?: never
        path: string
      }
  ),
) {
  return (
    <span
      className={cn(
        '[contain:strict]',
        'inline-block pointer-events-none',

        {
          '[mask-image:var(--image)] [mask-size:contain] [mask-position:center] [mask-repeat:no-repeat] bg-current':
            !props.noMask,

          '[background-image:var(--image)] [background-size:contain] [background-position:center] [background-repeat:no-repeat]':
            props.noMask,
        },

        props.className,
      )}
      {...(props.testId && { 'data-testid': props.testId })}
      style={
        {
          '--image': `url("${props.path ?? `/icons/${props.name}.svg`}")`,
        } as CSSProperties
      }
    />
  )
})
