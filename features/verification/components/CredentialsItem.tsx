import { ReactNode } from 'react'
import { Option } from '@/types/option'

export const CredentialsItem = (props: {
  icon: ReactNode
  heading: string
  description: string
  roles: Array<Option>
}) => {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-4">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[linear-gradient(81.5deg,#4940e0,#a39dff)]">
        {props.icon}
      </div>

      <div className="grid gap-y-0.5 self-center">
        <div className="font-semibold text-base leading-[1.5]">{props.heading}</div>
        <div className="text-[#bcc5f9]/60 text-xs leading-[1.3]">{props.description}</div>

        <div className="flex flex-wrap gap-1 text-xs leading-[1.3]">
          {props.roles.map((item, index) => (
            <div
              key={`role-preview-${item}-${index}`}
              className="grid grid-cols-fr/auto gap-x-1 items-center"
            >
              <span className="text-[#928bf9] rounded-lg font-semibold">{item.label}</span>

              {index !== props.roles.length - 1 && <span className="text-[#928bf9]">·</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
