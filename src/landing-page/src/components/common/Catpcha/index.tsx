import cn from "classnames";
import { Icon } from "components/common/Icon";
import { memo, useMemo, useState } from "react";

// FIXME: Implement real captcha
export const Captcha = memo(function Captcha(props: {
  className?: string;
  variant?: "primary" | "flat";
}) {
  const [checked, setChecked] = useState<boolean>(false);
  const variant = useMemo(() => props.variant || "primary", [props.variant]);

  return (
    <div
      className={cn(
        "relative rounded-xl text-14",
        "before:absolute before:pointer-events-none before:inset-0 before:p-0.5 before:rounded-[inherit]",
        {
          "bg-191c20 before:border-gradient before:bg-gradient-to-r before:from-ff6848 before:to-4940e0":
            variant === "primary",
        },
        props.className,
      )}
    >
      <label
        className={cn(
          "grid items-center grid-flow-col auto-cols-max gap-x-3 px-4 py-2 cursor-pointer select-none",
          { "text-183c4a": variant === "flat" },
        )}
      >
        <input
          type="checkbox"
          className="hidden"
          onChange={(e) => setChecked(e.target.checked)}
        />

        <span
          className={cn(
            "relative w-5 h-5 grid items-center justify-center outline-none border rounded-full",
            {
              "border-ffffff": variant === "primary",
              "border-183c4a": variant === "flat",
            },
          )}
        >
          {checked && (
            <Icon
              className="w-3 h-3"
              name="check"
            />
          )}
        </span>

        <span>I’m a unique person</span>

        <Icon
          className="w-10 h-10"
          noMask
          name="world-id"
        />
      </label>
    </div>
  );
});
