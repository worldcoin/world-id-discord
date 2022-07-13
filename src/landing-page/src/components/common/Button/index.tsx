import cn from "classnames";
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  memo,
  ReactNode,
} from "react";

type ButtonBaseProps = {
  children?: ReactNode;
  className?: string;
  variant?: "primary" | "flat";
};

type LinkProps = ButtonBaseProps &
  DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
type ButtonProps = ButtonBaseProps &
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const getClassNames = (props: ButtonBaseProps) => {
  const variant = props.variant || "primary";

  return cn(
    "text-center leading-[1.2] font-sans rounded-2xl p-6 min-w-[250px] font-semibold drop-shadow-button",
    "hover:opacity-75 transition-opacity",
    { "bg-gradient-81.5 from-4940e0 to-a39dff": variant === "primary" },
    props.className,
  );
};

export const Link = memo(function Link(props: LinkProps) {
  return (
    <a
      {...props}
      className={getClassNames(props)}
    >
      {props.children}
    </a>
  );
});

export const Button = memo(function Button(props: ButtonProps) {
  const { variant, className, ...restProps } = props;

  return (
    <button
      {...restProps}
      className={getClassNames({ variant, className })}
    >
      {props.children}
    </button>
  );
});
