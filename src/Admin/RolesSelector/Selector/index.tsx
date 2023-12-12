import * as ScrollArea from '@radix-ui/react-scroll-area'
import type { Option } from 'Admin/types/option'
import { Icon } from 'common/Icon'
import { Dispatch, memo, SetStateAction, useCallback, MouseEvent, useEffect, useRef } from 'react'
import { Listbox } from '@headlessui/react'
import { useFloating, autoUpdate, size, SizeOptions } from '@floating-ui/react'

export const Selector = memo(function Selector(props: {
  className?: string
  options: Array<Option>
  setOptions?: Dispatch<SetStateAction<Array<Option>>>
  inputPlaceholder?: string
  placeholder?: string
  info?: string
  setSelected: Dispatch<SetStateAction<Array<Option>>>
  disabled?: boolean
  selected: Array<Option>
  isEnabled: boolean
  setIsEnabled: Dispatch<SetStateAction<boolean>>
  onExpanded: () => void
}) {
  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      size({
        apply({ rects, elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight}px`,
            width: `${rects.reference.width}px`,
          })
        },
      } as SizeOptions),
    ],
  })

  const { setSelected } = props

  const removeSelected = useCallback(
    (option: Option) => (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      setSelected((selected) => {
        return selected.filter((o) => o.value !== option.value)
      })
    },
    [setSelected],
  )

  return (
    <Listbox value={props.selected} by="value" onChange={props.setSelected} multiple>
      {({ open }) => (
        <>
          <Listbox.Button
            ref={refs.setReference}
            as="div"
            className="p-1.5 font-rubik text-start border border-grey-700 rounded-lg"
          >
            {props.selected.length === 0 ? (
              <div className="flex items-center px-2.5 leading-8 text-grey-500">
                <div className="grow">Choose a role</div>

                <Icon className="w-3 h-3 text-grey-500" name="chevron" />
              </div>
            ) : (
              <div className="flex items-center pr-2.5">
                <div className="grow flex flex-wrap gap-1">
                  {props.selected.map((option, i) => (
                    <div
                      key={i}
                      className="inline-flex items-center gap-x-0.5 pl-3 pr-1 py-1 leading-5 bg-grey-700 rounded-full cursor-default"
                    >
                      {option.label}

                      <button className="grid hover:opacity-70 transition-opacity" onClick={removeSelected(option)}>
                        <Icon className="w-6 h-6 text-white/20" name="cross" />
                      </button>
                    </div>
                  ))}
                </div>

                <Icon className="w-3 h-3 text-grey-500" name="chevron" />
              </div>
            )}
          </Listbox.Button>

          {open && (
            <Listbox.Options
              ref={refs.setFloating}
              className="z-[1000] flex flex-col my-1 bg-grey-900 border border-grey-700 rounded-xl outline-none"
              style={floatingStyles}
            >
              <Mountable onMount={props.onExpanded} />

              <ScrollArea.Root className="grow min-h-0 flex flex-col" type="always">
                <ScrollArea.Viewport className="w-full p-1.5">
                  {props.options.map((option, i) => (
                    <Listbox.Option
                      key={i}
                      className="p-2.5 text-sm leading-4 rounded-lg aria-selected:bg-white/10"
                      value={option}
                    >
                      {option.label}
                    </Listbox.Option>
                  ))}
                </ScrollArea.Viewport>

                <ScrollArea.Scrollbar
                  className="flex px-2 py-2.5 w-5 before:block before:absolute before:w-[2px] before:inset-x-[9px] before:inset-y-[10px] before:bg-938cfa/10"
                  orientation="vertical"
                >
                  <ScrollArea.Thumb className="flex-1 rounded-sm bg-938cfa" />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>
            </Listbox.Options>
          )}
        </>
      )}
    </Listbox>
  )
})

const Mountable = ({ onMount }: { onMount: () => void }) => {
  const onMountRef = useRef<typeof onMount>(onMount)

  // call onMount once
  useEffect(() => {
    onMountRef.current?.()
  }, [])

  return null
}
