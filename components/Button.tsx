import { tv, type VariantProps } from 'tailwind-variants'

const button = tv({
  base: 'w-full py-2.5 leading-5 font-sora rounded-lg disabled:opacity-20 disabled:cursor-not-allowed',
  variants: {
    variant: { contained: '', outlined: '' },
    color: { primary: '', neutral: '' },
  },
  compoundVariants: [
    {
      variant: 'contained',
      color: 'primary',
      class:
        'text-white font-medium [background-color:var(--color-primary)] bg-gradient-to-b from-white/20 to-white/0 cursor-pointer disabled:cursor-not-allowed hover:bg-gradient-to-b hover:opacity-80 transition-opacity',
    },
    {
      variant: 'outlined',
      color: 'neutral',
      class:
        'text-white border border-grey-700 cursor-pointer disabled:cursor-not-allowed hover:opacity-80 transition-opacity',
    },
  ],
})

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>

export const Button = (props: ButtonProps) => {
  const { className, variant, color, ...otherProps } = props

  return <button className={button({ className, variant, color })} {...otherProps} />
}
