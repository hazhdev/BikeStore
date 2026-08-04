import type { ReactNode } from "react";
import "./button.scss";

type ButtonProps = {
  children: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
};

export const Button = ({
  children,
  // без явного type браузер считает кнопку submit — внутри формы
  // это отправляет её при любом клике
  type = "button",
  disabled = false,
  className,
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={className}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
