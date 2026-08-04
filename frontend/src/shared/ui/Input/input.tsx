import type { InputHTMLAttributes } from "react";
import "./input.scss";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className, ...props }: InputProps) => {
  return <input className={className} {...props} />;
};
