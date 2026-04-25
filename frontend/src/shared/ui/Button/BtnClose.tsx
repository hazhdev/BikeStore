import onCloseIcon from "@/shared/assets/icons/onClose.svg";

type BtnCloseProps = {
  onClose: () => void;
  className?: string;
};

export function BtnClose({ className, onClose }: BtnCloseProps) {
  return (
    <button className={className} onClick={onClose} type="button">
      <img src={onCloseIcon} alt="Закрыть" />
    </button>
  );
}
