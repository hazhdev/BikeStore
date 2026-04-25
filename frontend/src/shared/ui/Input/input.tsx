import type { InputHTMLAttributes } from "react";
import "./input.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = ({ className, ...props }: InputProps) => {
  return <input className={className} {...props} />;
};
