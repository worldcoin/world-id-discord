import { DetailedHTMLProps, InputHTMLAttributes, memo } from "react";

type Props = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const Input = memo(function Input(props: Props) {
  return <input {...props} />;
});
