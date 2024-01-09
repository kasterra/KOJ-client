import { useRef, PropsWithChildren } from "react";
import modalStyles from "./modal.module.css";
import formStyles from "../common/form.module.css";
import xSVG from "./icons/x.svg";

interface Props {
  title: string;
  subtitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const Modal = ({
  title,
  subtitle,
  isOpen,
  onClose,
  children,
}: PropsWithChildren<Props>) => {
  const backDropRef = useRef<HTMLDivElement>(null);
  return (
    <div
      style={{ display: isOpen ? "flex" : "none" }}
      className={modalStyles.backdrop}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <dialog
        className={modalStyles.dialog}
        open={isOpen}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={modalStyles.wrapper}>
          <div className={formStyles["title-area"]}>
            <h1 className={formStyles.title}>{title}</h1>
            <h2 className={formStyles.subtitle}>{subtitle}</h2>
          </div>
          <button onClick={onClose} className={modalStyles["close-button"]}>
            <img src={xSVG} alt="close icon" />
          </button>
          {children}
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
