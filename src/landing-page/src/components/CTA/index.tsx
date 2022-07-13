import cn from "classnames";
import { memo, ReactNode } from "react";

export const CTA = memo(function CTA(props: {
  className?: string;
  wrapperClassName?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative z-10 grid py-6 grid-cols-container-wide leading-[1.2] px-8",
        "bg-gradient-to-r from-4940e0 to-a39dff",
        props.wrapperClassName,
      )}
    >
      <div
        className={cn(
          "col-start-2 items-center grid grid-flow-col auto-cols-max justify-between",
          props.className,
        )}
      >
        {props.children}
      </div>
    </div>
  );
});
