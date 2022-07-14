import cn from "classnames";
import { Icon } from "components/common/Icon";
import {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Option } from "screens/Configuration/types/option";

/** Multiple selector with dropdown menu */
export const Selector = memo(function Selector(props: {
  className?: string;
  options: Array<Option>;
  selected: Array<Option>;
  onChange?: Dispatch<SetStateAction<Array<Option>>>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = useCallback(() => {
    setExpanded((p) => !p);
  }, []);

  const toggleSelectOption = useCallback(
    (value: Option) => {
      if (!props.onChange) {
        return;
      }

      props.onChange((prevValues) => {
        if (prevValues.includes(value))
          return prevValues.filter((prevValue) => prevValue !== value);
        return [...prevValues, value];
      });
    },
    [props],
  );

  // Click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const selector = ref.current;
      const target = e.target as HTMLElement;
      if (
        selector &&
        target &&
        target !== selector &&
        !selector.contains(target)
      ) {
        setExpanded(false);
      }
    };

    document.documentElement.addEventListener("click", handleClick);

    return () => {
      document.documentElement.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      className={cn("relative", props.className)}
      ref={ref}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-x-4 px-6 py-3.5 pr-7.5 rounded-xl bg-0c0e10 border-2 border-f9f9f9/20",
          "text-14 font-semibold cursor-pointer select-none hover:border-6673b9/50 transition-colors",
          { "!border-6673b9": expanded },
        )}
        onClick={toggleExpand}
      >
        <div className="grid grid-flow-col auto-cols-max gap-x-3 overflow-x-auto scrollbar-hide max-w-full">
          <span
            className={cn("text-ffffff/20 py-2.5", {
              hidden: props.selected.length > 0,
            })}
          >
            Choose a role
          </span>

          {props.selected?.length > 0 &&
            props.selected.map((option, index) => (
              <span
                className={cn(
                  "grid grid-flow-col auto-cols-max items-center gap-x-3.5 rounded-lg p-2.5 bg-ffffff/20",
                  "text-14 font-semibold",
                )}
                key={`${option.value}-${index}`}
              >
                {option.label}
                <button
                  className="grid hover:opacity-70 transition-opacity"
                  onClick={() => toggleSelectOption(option)}
                >
                  <Icon
                    className="w-3 h-3"
                    name="cross"
                  />
                </button>
              </span>
            ))}
        </div>

        <Icon
          className={cn(
            "w-6 h-3 md:w-3 md:h-1.5 transition-transform origin-center",
            {
              "rotate-180": expanded,
            },
          )}
          name="chevron"
        />
      </div>

      <div
        className={cn(
          "absolute z-10 top-full left-0 w-full rounded-xl overflow-hidden transition-[max-height] bg-0c0e10 border-f9f9f9/20",
          { "max-h-0 border-0": !expanded },
          { "max-h-50 border-2": expanded },
        )}
      >
        <div className="py-3.5">
          <div className="max-h-[120px] overflow-y-auto">
            {props.options.map((option, index) => (
              <div
                className={cn(
                  "grid grid-flow-col auto-cols-max justify-between items-center px-6 py-2.5 cursor-pointer hover:text-6673b9 transition-colors",
                )}
                key={`${option.value}-${index}`}
                onClick={() => toggleSelectOption(option)}
              >
                {option.label}
                {props.selected.includes(option) && (
                  <Icon
                    className="w-3 h-3"
                    name="cross"
                  />
                )}
              </div>
            ))}
          </div>

          <span className="grid grid-flow-col gap-x-2 opacity-40 mt-2.5 px-6">
            <Icon
              className="w-3 h-3"
              name="info"
            />
            You can create more roles in your Discord server settings
          </span>
        </div>
      </div>
    </div>
  );
});
