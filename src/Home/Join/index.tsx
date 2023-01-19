import cn from 'classnames'
import {Button} from 'common/Button'
import {Icon} from 'common/Icon'
import {memo} from 'react'

export const Join = memo(function Join(props: {onInstall: () => Promise<void>}) {
  return (
    <div
      className={cn(
        'relative grid grid-cols-container-wide px-4 md:px-8 mt-32 md:mt-64 overflow-x-clip',
        'before:absolute before:inset-y-4 before:inset-x-[480px] before:rounded-[100%] before:blur-[140px]',
        'before:bg-gradient-81.5 before:from-4940e0 before:to-a39dff',
      )}
    >
      <div className="relative col-start-2 text-center grid gap-y-6 justify-items-center">
        <h3 className="font-medium text-32 md:text-48">Ready to join our community?</h3>
        <Button onClick={props.onInstall} className="max-w-sm flex justify-center items-center gap-x-4">
          <Icon className="h-full w-4" name="discord" />
          <span className="leading-none">Add to Discord</span>
        </Button>
      </div>
    </div>
  )
})
