import { ComponentProps } from 'react'

export const InformationCircleIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_23518_71324)">
        <path
          d="M14.6667 8.00008C14.6667 4.31818 11.6819 1.33341 8.00001 1.33341C4.31811 1.33341 1.33334 4.31818 1.33334 8.00008C1.33334 11.682 4.31811 14.6667 8.00001 14.6667C11.6819 14.6667 14.6667 11.682 14.6667 8.00008Z"
          stroke="currentColor"
        />
        <path
          d="M8.16145 11.3333V7.99992C8.16145 7.68565 8.16145 7.52851 8.06382 7.43088C7.96619 7.33325 7.80905 7.33325 7.49478 7.33325"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.99465 5.33325H8.00064"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_23518_71324">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
