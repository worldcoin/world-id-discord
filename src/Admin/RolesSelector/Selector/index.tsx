import type {Option} from 'Admin/types/option'
import cn from 'classnames'
import {Icon} from 'common/Icon'
import {Dispatch, FormEvent, memo, SetStateAction, useCallback, useEffect, useRef, useState} from 'react'

/** Multiple selector with dropdown menu */

export const Selector = memo(function Selector(props: {
  className?: string
  options: Array<Option>
  setOptions?: Dispatch<SetStateAction<Array<Option>>>
  withInput?: boolean
  inputPlaceholder?: string
  placeholder?: string
  info?: string
  setSelected: Dispatch<SetStateAction<Array<Option>>>
  disabled?: boolean
  selected: Array<Option>
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)

  const toggleExpand = useCallback(() => {
    setExpanded((p) => !p)
  }, [])

  // Click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const selector = ref.current
      const target = e.target as HTMLElement

      if (selector && target && target !== selector && !selector.contains(target)) {
        setExpanded(false)
      }
    }

    document.documentElement.addEventListener('click', handleClick)

    return () => {
      document.documentElement.removeEventListener('click', handleClick)
    }
  }, [])

  const addNewRole = useCallback(
    (
      event: FormEvent<HTMLFormElement> & {
        target: FormEvent<HTMLFormElement> & {firstChild: HTMLInputElement}
      },
    ) => {
      event.preventDefault()

      if (!props.setOptions) {
        return console.error('pass setOption into selector')
      }

      const roleName = event.target.firstChild.value

      props.setOptions([{label: roleName, value: roleName}, ...props.options])

      event.target.firstChild.value = ''
    },
    [props],
  )

  const toggleRoles = useCallback(
    (value: Option) => {
      props.setSelected((prevValues) => {
        if (prevValues.includes(value)) {
          return prevValues.filter((prevValue) => prevValue !== value)
        }

        return [...prevValues, value]
      })
    },
    [props],
  )

  return (
    <div className={cn('relative', props.className)} ref={ref}>
      <div
        onClick={toggleExpand}
        className={cn(
          'grid grid-cols-fr/auto items-center justify-between gap-x-4 px-6 py-3.5 pr-7.5',
          'text-14 font-semibold cursor-pointer select-none',
          {'!border-6673b9': expanded},
          {'bg-0c0e10/50 pointer-events-none select-none': props.disabled},
          'bg-0c0e10 border border-ffffff/20 hover:border-6673b9/50 transition-colors group rounded-xl',
        )}
      >
        <div className="grid grid-flow-col auto-cols-max gap-x-3 overflow-x-auto scrollbar-hide max-w-full">
          <span
            className={cn('text-ffffff/20 py-2.5', {
              hidden: Array.isArray(props.selected) && props.selected.length > 0,
            })}
          >
            {props.placeholder ?? ''}
          </span>

          {Array.isArray(props.selected) &&
            props.selected?.length > 0 &&
            props.selected.map((option, index) => (
              <span
                className={cn(
                  'grid grid-flow-col auto-cols-max items-center gap-x-3.5 rounded-lg p-2.5 bg-ffffff/20',
                  'text-14 font-semibold',
                )}
                key={`${option.value}-${index}`}
              >
                {option.label}
                <button className="grid hover:opacity-70 transition-opacity" onClick={() => toggleRoles(option)}>
                  <Icon className="w-3 h-3" name="cross" />
                </button>
              </span>
            ))}
        </div>
        <Icon
          className={cn('w-4 h-2.5 md:w-3 md:h-1.5 transition-transform origin-center', {
            'rotate-180': expanded,
          })}
          name="chevron"
        />
      </div>

      <div
        className={cn(
          'absolute z-10 top-[calc(100%+4px)] left-0 w-full rounded-xl overflow-hidden transition-[max-height] bg-0c0e10 border-f9f9f9/20',
          {'max-h-0 border-0': !expanded},
          {'max-h-50 border-2': expanded},
        )}
      >
        <div className="py-3.5">
          <div className="max-h-[120px] overflow-y-auto">
            {props.withInput && (
              <form onSubmit={addNewRole} className="px-6 py-0.5">
                <input
                  placeholder={props.inputPlaceholder || ''}
                  className="w-full bg-transparent border-b-2 border-ffffff/50 outline-none py-2"
                />
              </form>
            )}
            {props.options.map((option, index) => (
              <div
                className={cn(
                  'grid grid-flow-col auto-cols-max justify-between items-center px-6 py-2.5 cursor-pointer hover:text-6673b9 transition-colors',
                )}
                key={`${option.value}-${index}`}
                onClick={() => toggleRoles(option)}
              >
                {option.label}

                {props.selected.includes(option) && <Icon className="w-3 h-3" name="cross" />}
              </div>
            ))}
          </div>

          {props.info && (
            <span className="grid grid-cols-auto/fr items-center gap-x-2 opacity-40 mt-2.5 px-6">
              <Icon className="w-3 h-3" name="info" />
              {props.info}
            </span>
          )}
        </div>
      </div>
    </div>
  )
})
