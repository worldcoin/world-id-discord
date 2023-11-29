import { Option } from 'Admin/types/option'
import { Icon, IconType } from 'common/Icon'
import { memo } from 'react'

export const CredentialsItem = memo(function CredentialsItem(props: {
  icon: IconType
  heading: string
  description: string
  roles: Array<Option>
}) {
  return (
    <div className="grid grid-cols-auto/fr gap-x-4">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-81.5 from-4940e0 to-a39dff">
        <Icon name={props.icon} className="h-4 w-4" />
      </div>

      <div className="pt-1.5">
        <div className="font-semibold text-16 !leading-4">{props.heading}</div>

        <div className="mt-1 text-bcc5f9/60 text-12 !leading-3">{props.description}</div>

        <div className="flex flex-wrap gap-1 mt-2 text-12">
          {props.roles.map((item, index) => (
            <div key={`role-preview-${item}-${index}`} className="grid grid-cols-fr/auto gap-x-1 items-center">
              <span className="text-928bf9 rounded-lg font-semibold">{item.label}</span>

              {index !== props.roles.length - 1 && <span className="text-928bf9">·</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})
