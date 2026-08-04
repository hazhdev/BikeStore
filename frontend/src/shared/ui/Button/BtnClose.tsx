import type { ReactNode } from "react";

type BtnCloseProps = {
  onClose: () => void;
  className?: string;
  children?: ReactNode;
  ariaLabel?: string;
};

export function BtnClose({
  className,
  onClose,
  children,
  ariaLabel = "Закрыть",
}: BtnCloseProps) {
  return (
    <button
      className={className}
      onClick={onClose}
      type="button"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
