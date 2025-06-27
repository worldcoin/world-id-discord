import { ComponentProps } from 'react'

export const XIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g opacity="0.2">
        <path
          d="M9.50037 2.5L2.50037 9.5M2.50037 2.5L9.50037 9.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}
