import { ComponentProps } from 'react'

export const OrbIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="9.99971" cy="10.0001" r="7.70833" stroke="currentColor" strokeWidth="1.25" />

      <circle cx="9.99894" cy="8.61076" r="3.54167" stroke="currentColor" strokeWidth="1.25" />

      <circle cx="9.99984" cy="8.05575" r="0.833333" fill="currentColor" />
    </svg>
  )
}
