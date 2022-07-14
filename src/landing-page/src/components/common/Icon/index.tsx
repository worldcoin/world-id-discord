import cn from "classnames";
import { CSSProperties, memo } from "react";
import "./icon.css";

const iconNames = [
  "app-store",
  "check",
  "discord",
  "github",
  "logo",
  "play-market",
  "world-id",
] as const;

export type IconType = typeof iconNames[number];

export const Icon = memo(function Icon(
  props: {
    className?: string;
    noMask?: boolean;
    testId?: string;
  } & (
    | {
        name: IconType;
        path?: never;
      }
    | {
        name?: never;
        path: string;
      }
  ),
) {
  return (
    <span
      className={cn(
        "icon inline-block pointer-events-none",

        {
          "bg-current": !props.noMask,
          "no-mask": props.noMask,
        },

        props.className,
      )}
      {...(props.testId && { "data-testid": props.testId })}
      style={
        {
          "--image": `url("${props.path ?? `/icons/${props.name}.svg`}")`,
        } as CSSProperties
      }
    />
  );
});
