import { PropsWithChildren, useState } from "react";
import styles from "./element.module.css";
import pencilSVG from "~/assets/pencil.svg";
import trashSVG from "~/assets/trash.svg";
import chevronDownSVG from "~/assets/chevronDown.svg";
import chevronUpSVG from "~/assets/chevronUp.svg";

interface ButtonProps {
  title: string;
  onButtonClick: () => void;
  onTextClick?: () => void;
  showIcons?: boolean;
  iconSrcList?: string[];
  onIconClickList?: (() => void)[];
  level?: number;
}

export const ButtonElement = ({
  title,
  onButtonClick,
  onTextClick,
  showIcons = true,
  iconSrcList = [],
  onIconClickList = [],
  level,
}: ButtonProps) => {
  return (
    <div className={styles["element-block"]}>
      <div
        style={{ paddingLeft: level ? level * 12 : undefined }}
        className={styles["element-title-block"]}
        onClick={onButtonClick}
      >
        <h3
          className={styles["element-title-span"]}
          onClick={
            onTextClick
              ? (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTextClick();
                }
              : () => {}
          }
        >
          {title}
        </h3>
        {showIcons ? (
          <div className={styles["element-edit-icons-block"]}>
            {iconSrcList?.map((iconSrc, idx) => (
              <img
                key={idx}
                className={styles["element-icon"]}
                src={iconSrc}
                onClick={
                  onIconClickList[idx]
                    ? (e) => {
                        e.stopPropagation();
                        onIconClickList[idx]();
                      }
                    : () => {}
                }
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

interface FoldableProps {
  title: string;
  isEditable: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onTextClick?: () => void;
  onIconClick?: () => void;
  level?: number;
}

export const FoldableSuperButtonElement = ({
  title,
  isEditable,
  onEditClick,
  onDeleteClick,
  onTextClick,
  level,
  children,
}: PropsWithChildren<FoldableProps>) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <div className={styles["element-block"]}>
      <div
        style={{ paddingLeft: level ? level * 12 : undefined }}
        className={styles["element-title-block"]}
        onClick={toggleOpen}
      >
        <div className={styles["element-title-section"]}>
          <h3
            className={styles["element-title-span"]}
            onClick={
              onTextClick
                ? (e) => {
                    e.stopPropagation();
                    onTextClick();
                  }
                : () => {}
            }
          >
            {title}
          </h3>
          <img
            src={isOpen ? chevronUpSVG : chevronDownSVG}
            alt={isOpen ? "submenu close icon" : "submenu open icon"}
          />
        </div>

        {isEditable && (
          <div className={styles["element-edit-icons-block"]}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onEditClick();
              }}
              className={styles["element-icon"]}
            >
              <img
                className={styles["element-icon"]}
                src={pencilSVG}
                alt="edit icon"
              />
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick();
              }}
              className={styles["element-icon"]}
            >
              <img
                className={styles["element-icon"]}
                src={trashSVG}
                alt="delete icon"
              />
            </div>
          </div>
        )}
      </div>
      {isOpen ? children : null}
    </div>
  );
};
