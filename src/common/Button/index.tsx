import { tv, type VariantProps } from 'tailwind-variants'
import { memo } from 'react'

const button = tv({
  base: 'w-full py-2.5 leading-5 font-sora rounded-lg disabled:opacity-20 disabled:cursor-not-allowed',
  variants: {
    variant: {
      contained: '',
      outlined: '',
    },
    color: {
      primary: '',
      neutral: '',
    },
  },
  compoundVariants: [
    {
      variant: 'contained',
      color: 'primary',
      class: 'text-white bg-primary bg-gradient-to-b from-white/20 to-white/0',
    },
    {
      variant: 'outlined',
      color: 'neutral',
      class: 'text-white border border-grey-700',
    },
  ],
})

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>

export const Button = memo(function Button(props: ButtonProps) {
  const { className, variant, color, ...otherProps } = props

  return <button className={button({ className, variant, color })} {...otherProps} />
})
