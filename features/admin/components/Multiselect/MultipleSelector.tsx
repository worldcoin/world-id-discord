'use client'

import * as React from 'react'
import { useEffect } from 'react'
import { Command as CommandPrimitive, useCommandState } from 'cmdk'
import { cn } from '@/lib/utils'
import { Command, CommandGroup, CommandItem, CommandList } from './Command'
import { MultiselectOption } from '@/features/admin/types/multiselect-option'
import { XIcon } from '@/components/icons/XIcon'
import { ReloadIcon } from '@/components/icons/Reload'

interface GroupOption {
  [key: string]: MultiselectOption[]
}

interface MultipleSelectorProps {
  value?: MultiselectOption[]
  defaultOptions?: MultiselectOption[]
  /** manually controlled options */
  options?: MultiselectOption[]
  placeholder?: string
  /** Loading component. */
  loadingIndicator?: React.ReactNode
  /** Empty component. */
  emptyIndicator?: React.ReactNode
  /** Debounce time for async search. Only work with `onSearch`. */
  delay?: number
  /**
   * Only work with `onSearch` prop. Trigger search when `onFocus`.
   * For example, when user click on the input, it will trigger the search to get initial options.
   **/
  triggerSearchOnFocus?: boolean
  /** async search */
  onSearch?: (value: string) => Promise<MultiselectOption[]>
  /**
   * sync search. This search will not showing loadingIndicator.
   * The rest props are the same as async search.
   * i.e.: creatable, groupBy, delay.
   **/
  onSearchSync?: (value: string) => MultiselectOption[]
  onChange?: (options: MultiselectOption[]) => void
  /** Limit the maximum number of selected options. */
  maxSelected?: number
  /** When the number of selected options exceeds the limit, the onMaxSelected will be called. */
  onMaxSelected?: (maxLimit: number) => void
  /** Hide the placeholder when there are options selected. */
  hidePlaceholderWhenSelected?: boolean
  disabled?: boolean
  /** Group the options base on provided key. */
  groupBy?: string
  className?: string
  badgeClassName?: string
  /**
   * First item selected is a default behavior by cmdk. That is why the default is true.
   * This is a workaround solution by add a dummy item.
   *
   * @reference: https://github.com/pacocoursey/cmdk/issues/171
   */
  selectFirstItem?: boolean
  /** Allow user to create option when there is no option matched. */
  creatable?: boolean
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>
  /** Props of `CommandInput` */
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    'value' | 'placeholder' | 'disabled'
  >
  /** hide the clear all button. */
  hideClearAllButton?: boolean
  /** id of the input */
  id?: string
  /** Text at the bottom of the options list */
  bottomListText?: string
  /** Icon at the bottom of the options list */
  bottomTextIcon?: React.ReactNode
  /** Refresh button action */
  refresh?: () => Promise<void>
  /** Refresh button label */
  refreshLabel?: string
}

export interface MultipleSelectorRef {
  selectedValue: MultiselectOption[]
  input: HTMLInputElement
  focus: () => void
  reset: () => void
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

function transToGroupOption(options: MultiselectOption[], groupBy?: string) {
  if (options.length === 0) {
    return {}
  }
  if (!groupBy) {
    return { '': options }
  }

  const groupOption: GroupOption = {}
  options.forEach(option => {
    const key = (option[groupBy] as string) || ''
    if (!groupOption[key]) {
      groupOption[key] = []
    }
    groupOption[key].push(option)
  })
  return groupOption
}

function removePickedOption(groupOption: GroupOption, picked: MultiselectOption[]) {
  const cloneOption = JSON.parse(JSON.stringify(groupOption)) as GroupOption

  for (const [key, value] of Object.entries(cloneOption)) {
    cloneOption[key] = value.filter(val => !picked.find(p => p.value === val.value))
  }
  return cloneOption
}

function isOptionsExist(groupOption: GroupOption, targetOption: MultiselectOption[]) {
  for (const [, value] of Object.entries(groupOption)) {
    if (value.some(option => targetOption.find(p => p.value === option.value))) {
      return true
    }
  }
  return false
}

const CommandEmpty = ({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) => {
  const render = useCommandState(state => state.filtered.count === 0)

  if (!render) return null

  return (
    <div
      className={cn('p-2.5 text-center text-sm leading-[1.4]', className)}
      cmdk-empty=""
      role="presentation"
      {...props}
    />
  )
}

CommandEmpty.displayName = 'CommandEmpty'

const MultipleSelector = ({
  value,
  onChange,
  placeholder,
  defaultOptions: arrayDefaultOptions = [],
  options: arrayOptions,
  delay,
  onSearch,
  onSearchSync,
  loadingIndicator,
  emptyIndicator,
  maxSelected = Number.MAX_SAFE_INTEGER,
  onMaxSelected,
  hidePlaceholderWhenSelected,
  disabled,
  groupBy,
  className,
  badgeClassName,
  selectFirstItem = true,
  creatable = false,
  triggerSearchOnFocus = false,
  commandProps,
  inputProps,
  hideClearAllButton = false,
  id,
  bottomListText,
  bottomTextIcon,
  refresh,
  refreshLabel,
}: MultipleSelectorProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null) // Added this
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const [selected, setSelected] = React.useState<MultiselectOption[]>(value || [])
  const [options, setOptions] = React.useState<GroupOption>(
    transToGroupOption(arrayDefaultOptions, groupBy)
  )
  const [inputValue, setInputValue] = React.useState('')
  const debouncedSearchTerm = useDebounce(inputValue, delay || 500)

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      setOpen(false)
      inputRef.current.blur()
    }
  }

  const handleUnselect = React.useCallback(
    (option: MultiselectOption) => {
      const newOptions = selected.filter(s => s.value !== option.value)
      setSelected(newOptions)
      onChange?.(newOptions)
    },
    [onChange, selected]
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '' && selected.length > 0) {
            const lastSelectOption = selected[selected.length - 1]
            // If last item is fixed, we should not remove it.
            if (!lastSelectOption.fixed) {
              handleUnselect(selected[selected.length - 1])
            }
          }
        }
        // This is not a default behavior of the <input /> field
        if (e.key === 'Escape') {
          input.blur()
        }
      }
    },
    [handleUnselect, selected]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchend', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchend', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchend', handleClickOutside)
    }
  }, [open])

  useEffect(() => {
    if (value) {
      setSelected(value)
    }
  }, [value])

  useEffect(() => {
    /** If `onSearch` is provided, do not trigger options updated. */
    if (!arrayOptions || onSearch) {
      return
    }
    const newOption = transToGroupOption(arrayOptions || [], groupBy)
    if (JSON.stringify(newOption) !== JSON.stringify(options)) {
      setOptions(newOption)
    }
  }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options])

  useEffect(() => {
    /** sync search */

    const doSearchSync = () => {
      const res = onSearchSync?.(debouncedSearchTerm)
      setOptions(transToGroupOption(res || [], groupBy))
    }

    const exec = async () => {
      if (!onSearchSync || !open) return

      if (triggerSearchOnFocus) {
        doSearchSync()
      }

      if (debouncedSearchTerm) {
        doSearchSync()
      }
    }

    void exec()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus])

  useEffect(() => {
    /** async search */

    const doSearch = async () => {
      setIsLoading(true)
      const res = await onSearch?.(debouncedSearchTerm)
      setOptions(transToGroupOption(res || [], groupBy))
      setIsLoading(false)
    }

    const exec = async () => {
      if (!onSearch || !open) return

      if (triggerSearchOnFocus) {
        await doSearch()
      }

      if (debouncedSearchTerm) {
        await doSearch()
      }
    }

    void exec()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus])

  const CreatableItem = () => {
    if (!creatable) return undefined
    if (
      isOptionsExist(options, [{ value: inputValue, label: inputValue }]) ||
      selected.find(s => s.value === inputValue)
    ) {
      return undefined
    }

    const Item = (
      <CommandItem
        value={inputValue}
        className="cursor-pointer"
        onMouseDown={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onSelect={(value: string) => {
          if (selected.length >= maxSelected) {
            onMaxSelected?.(selected.length)
            return
          }
          setInputValue('')
          const newOptions = [...selected, { value, label: value }]
          setSelected(newOptions)
          onChange?.(newOptions)
        }}
      >
        {`Create "${inputValue}"`}
      </CommandItem>
    )

    // For normal creatable
    if (!onSearch && inputValue.length > 0) {
      return Item
    }

    // For async search creatable. avoid showing creatable item before loading at first.
    if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
      return Item
    }

    return undefined
  }

  const EmptyItem = React.useCallback(() => {
    if (!emptyIndicator) return undefined

    // For async search that showing emptyIndicator
    if (onSearch && !creatable && Object.keys(options).length === 0) {
      return (
        <CommandItem value="-" disabled>
          {emptyIndicator}
        </CommandItem>
      )
    }

    return <CommandEmpty>{emptyIndicator}</CommandEmpty>
  }, [creatable, emptyIndicator, onSearch, options])

  const selectables = React.useMemo<GroupOption>(
    () => removePickedOption(options, selected),
    [options, selected]
  )

  const valueToLabelMap = React.useMemo(() => {
    const map = new Map<string, string>()
    Object.values(selectables)
      .flat()
      .forEach(option => {
        map.set(option.value, option.label)
      })
    return map
  }, [selectables])

  /** Avoid Creatable Selector freezing or lagging when paste a long string. */
  const commandFilter = React.useCallback(() => {
    if (commandProps?.filter) {
      return commandProps.filter
    }

    return (value: string, search: string) => {
      const label = valueToLabelMap.get(value) || value
      return label.toLowerCase().includes(search.toLowerCase()) ? 1 : -1
    }
  }, [commandProps?.filter, valueToLabelMap])

  return (
    <Command
      ref={dropdownRef}
      {...commandProps}
      onKeyDown={e => {
        handleKeyDown(e)
        commandProps?.onKeyDown?.(e)
      }}
      className={cn('h-auto overflow-visible bg-transparent', commandProps?.className)}
      shouldFilter={
        commandProps?.shouldFilter !== undefined ? commandProps.shouldFilter : !onSearch
      } // When onSearch is provided, we don&lsquo;t want to filter the options. You can still override it.
      filter={commandFilter()}
    >
      <div
        className={cn(
          'border-input min-h-[46px] focus-within:border-ring focus-within:ring-ring/50 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive relative rounded-lg border text-sm transition-[color,box-shadow] outline-none focus-within:ring-[1px] has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50',
          {
            'p-1.5': selected.length !== 0,
            'cursor-text': !disabled && selected.length !== 0,
          },
          !hideClearAllButton && 'pe-9',
          className
        )}
        onClick={() => {
          if (disabled) return
          inputRef?.current?.focus()
        }}
      >
        <div className="flex flex-wrap gap-1 h-full">
          {selected.map(option => {
            return (
              <div
                key={option.value}
                className={cn(
                  'animate-fadeIn bg-grey-700 relative inline-flex h-8 cursor-default items-center rounded-full ps-2 pe-7 pl-3.5 py-1.5 font-medium transition-all disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-fixed:pe-2',
                  badgeClassName
                )}
                data-fixed={option.fixed}
                data-disabled={disabled || undefined}
              >
                <span className="text-sm text-white leading-[1.4]">{option.label}</span>

                <button
                  className="text-white/50 hover:text-white/70 focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 -end-px flex w-7 h-8 items-center justify-center rounded-e-md p-0 outline-hidden transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleUnselect(option)
                    }
                  }}
                  onMouseDown={e => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(option)}
                  aria-label="Remove"
                >
                  <XIcon aria-hidden="true" />
                </button>
              </div>
            )
          })}

          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            {...inputProps}
            ref={inputRef}
            value={inputValue}
            disabled={disabled}
            onValueChange={value => {
              setInputValue(value)
              inputProps?.onValueChange?.(value)
            }}
            onFocus={event => {
              setOpen(true)
              if (triggerSearchOnFocus) {
                onSearch?.(debouncedSearchTerm)
              }
              inputProps?.onFocus?.(event)
            }}
            placeholder={
              hidePlaceholderWhenSelected && selected.length !== 0 ? '' : placeholder
            }
            className={cn(
              'placeholder:text-grey-500 flex-1 bg-transparent outline-hidden disabled:cursor-not-allowed text-white',
              {
                'w-full': hidePlaceholderWhenSelected,
                'px-3 py-2': selected.length === 0,
                'ml-1': selected.length !== 0,
              },
              inputProps?.className
            )}
            id={id}
          />

          <button
            type="button"
            onClick={() => {
              setSelected(selected.filter(s => s.fixed))
              onChange?.(selected.filter(s => s.fixed))
            }}
            className={cn(
              'text-white/50 hover:text-white focus-visible:border-ring focus-visible:ring-ring/50 absolute end-0 inset-y-0 w-9 cursor-pointer flex h-full items-center justify-center rounded-md border border-transparent transition-[color,box-shadow] outline-none focus-visible:ring-[3px]',
              (hideClearAllButton ||
                disabled ||
                selected.length < 1 ||
                selected.filter(s => s.fixed).length === selected.length) &&
                'hidden'
            )}
            aria-label="Clear all"
          >
            <XIcon aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          className={cn(
            'border-input absolute top-2 z-10 w-full overflow-hidden rounded-lg border',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            !open && 'hidden'
          )}
          data-state={open ? 'open' : 'closed'}
        >
          {open && (
            <CommandList
              className="bg-grey-900 text-white shadow-lg outline-hidden p-3.5"
              onMouseUp={() => {
                inputRef?.current?.focus()
              }}
            >
              {isLoading ? (
                <>{loadingIndicator}</>
              ) : (
                <>
                  {EmptyItem()}
                  {CreatableItem()}

                  {!selectFirstItem && <CommandItem value="-" className="hidden" />}

                  {Object.entries(selectables).map(([key, dropdowns]) => (
                    <CommandGroup key={key} heading={key} className="h-full overflow-auto">
                      <>
                        {dropdowns.map(option => {
                          return (
                            <CommandItem
                              key={option.value}
                              value={option.value}
                              disabled={option.disable}
                              onMouseDown={e => {
                                e.preventDefault()
                                e.stopPropagation()
                              }}
                              onSelect={() => {
                                if (selected.length >= maxSelected) {
                                  onMaxSelected?.(selected.length)
                                  return
                                }
                                setInputValue('')
                                const newOptions = [...selected, option]
                                setSelected(newOptions)
                                onChange?.(newOptions)
                              }}
                              className={cn(
                                'cursor-pointer text-sm text-white leading-[1.4]',
                                option.disable &&
                                  'pointer-events-none cursor-not-allowed opacity-50'
                              )}
                            >
                              {option.label}
                            </CommandItem>
                          )
                        })}
                      </>
                    </CommandGroup>
                  ))}
                </>
              )}
            </CommandList>
          )}

          {bottomListText && (
            <div className="bg-grey-900 px-6 py-4 grid grid-cols-[auto_1fr] text-grey-400 text-sm leading-[1.4] border-t border-grey-700 gap-x-2">
              {bottomTextIcon}
              {bottomListText}
            </div>
          )}

          {refresh && (
            <button
              type="button"
              onClick={async e => {
                e.stopPropagation()
                setIsRefreshing(true)
                await refresh?.()
                setIsRefreshing(false)
              }}
              className="group absolute flex gap-x-1 top-3.5 right-3.5 p-2.5 text-[#756DEC] hover:text-[#8983ff] text-sm leading-[1.4] transition-colors cursor-pointer"
            >
              {refreshLabel ?? 'Refresh'}

              <ReloadIcon
                className={cn('group-hover:rotate-90 transition-transform', {
                  'animate-spin': isRefreshing,
                })}
              />
            </button>
          )}
        </div>
      </div>
    </Command>
  )
}

MultipleSelector.displayName = 'MultipleSelector'
export default MultipleSelector
