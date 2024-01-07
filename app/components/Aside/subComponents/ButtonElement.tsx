import { useState } from "react";
import styles from "./element.module.css";
import {
  AsideElementType,
  isButtonElement,
  isLinkElement,
} from "../AsideListTypes";
import { SubLevelLinkElement } from "./LinkElement";
import pencilSVG from "./icons/pencil.svg";
import trashSVG from "./icons/trash.svg";
import chevronDownSVG from "./icons/chevronDown.svg";
import chevronUpSVG from "./icons/chevronUp.svg";

interface ButtonProps {
  title: string;
  onButtonClick: () => void;
  icon?: string;
  onIconClick?: () => void;
}

export const ButtonElement = ({
  title,
  onButtonClick,
  icon,
  onIconClick,
}: ButtonProps) => {
  return (
    <div className={styles["element-block"]}>
      <div className={styles["element-title-block"]}>
        <div onClick={onButtonClick}>
          <h3 className={styles["element-title-span"]}>{title}</h3>
          {icon && (
            <img
              className={styles["element-icon"]}
              src={icon}
              alt=""
              onClick={onIconClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface FoldableProps {
  title: string;
  isEditable: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
  subelements: AsideElementType[];
  onIconClick?: () => void;
}

export const FoldableSuperButtonElement = ({
  title,
  isEditable,
  onEditClick,
  onDeleteClick,
  subelements,
}: FoldableProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <div className={styles["element-block"]}>
      <div className={styles["element-title-block"]} onClick={toggleOpen}>
        <div className={styles["element-title-section"]}>
          <h3 className={styles["element-title-span"]}>{title}</h3>
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
      {isOpen &&
        subelements.map((subelement) => {
          if (isButtonElement(subelement)) {
            return (
              <SubLevelButtonElement
                key={subelement.title}
                title={subelement.title}
                onButtonClick={subelement.onButtonClick}
                icon={subelement.icon}
                onIconClick={subelement.onIconClick}
              />
            );
          } else if (isLinkElement(subelement)) {
            return (
              <SubLevelLinkElement
                key={subelement.title}
                title={subelement.title}
                link={subelement.link}
              />
            );
          }
        })}
    </div>
  );
};

export const SubLevelButtonElement = ({
  title,
  onButtonClick,
  icon,
  onIconClick,
}: ButtonProps) => {
  onIconClick && onIconClick();
  return (
    <div onClick={onButtonClick} className={styles["subelement-block"]}>
      <h4 className={styles["subelement-title-span"]}>{title}</h4>
      {icon && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onIconClick && onIconClick();
          }}
        >
          <img className={styles["subelement-icon"]} src={icon} alt="" />
        </div>
      )}
    </div>
  );
};
