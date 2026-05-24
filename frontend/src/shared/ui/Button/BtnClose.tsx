import type { ReactNode } from "react";

type BtnCloseProps = {
  onClose: () => void;
  className?: string;
  children?: ReactNode;
};

export function BtnClose({ className, onClose, children }: BtnCloseProps) {
  return (
    <button
      className={className}
      onClick={onClose}
      type="button"
      aria-label="Закрыть"
    >
      {children}
    </button>
  );
}
