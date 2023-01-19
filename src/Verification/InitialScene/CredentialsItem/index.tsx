import {Option} from 'Admin/types/option'
import {Icon, IconType} from 'common/Icon'
import Image from 'next/image'
import {memo} from 'react'

export const CredentialsItem = memo(function CredentialsItem(props: {
  icon: IconType
  heading: string
  description: string
  roles: Array<Option>
}) {
  return (
    <div className="bg-242628/20 mix-blend-overlay rounded-2xl pl-6 pr-8 pt-6 pb-12 grid gap-y-2.5 content-start relative overflow-clip">
      <span className="font-rubik font-semibold text-14">{props.heading}</span>

      <p className="font-rubik text-ffffff/40 text-14">{props.description}</p>

      <div className="flex flex-wrap gap-1">
        {props.roles.map((item, index) => (
          <div key={`role-preview-${item}-${index}`} className="grid grid-cols-fr/auto gap-x-1 items-center">
            <span className="text-6673b9 rounded-lg text-11 font-semibold leading-none">{item.label}</span>
            {index !== props.roles.length - 1 && <span className="text-6673b9 leading-none font-rubik">·</span>}
          </div>
        ))}
      </div>

      <div className="absolute w-[102px] h-[108px] -bottom-3.5 -right-1">
        <Image src="/images/verification/honeycombs-small.svg" fill alt="" />
      </div>

      <Icon name={props.icon} className="h-8 w-8 absolute bottom-4 right-4" />
    </div>
  )
})
