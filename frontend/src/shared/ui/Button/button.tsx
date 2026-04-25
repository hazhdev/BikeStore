type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
};

export const Button = ({
  children,
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
