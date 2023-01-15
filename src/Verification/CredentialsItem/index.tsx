import {Option} from 'Admin/types/option'
import {Icon, IconType} from 'common/Icon'
import {memo} from 'react'

export const CredentialsItem = memo(function CredentialsItem(props: {
  icon: IconType
  heading: string
  description: string
  roles: Array<Option>
}) {
  return (
    <div className="grid gap-y-2 justify-items-center content-start">
      <div className="grid grid-cols-auto/fr items-center gap-x-2">
        <Icon name={props.icon} className="h-4 w-4 text-ffffff" />
        <span className="font-rubik font-semibold text-14">{props.heading}</span>
      </div>

      <p className="font-rubik text-ffffff/40 text-center">{props.description}</p>

      <div className="flex flex-wrap justify-center gap-1">
        {props.roles.map((item, index) => (
          <span
            key={`role-preview-${item}-${index}`}
            className="bg-ffffff/10 rounded-lg text-11 py-1.5 px-2.5 font-semibold"
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
})
