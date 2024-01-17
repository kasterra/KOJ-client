import { useEffect, useRef, useState } from "react";
import styles from "~/components/common/dropdown.module.css";
import inputStyles from "./input.module.css";

interface Props {
  name: string;
  submenus: string[];
  defaultVal?: string;
}

const DropDown = ({ submenus, name, defaultVal = "" }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(defaultVal);

  return (
    <div
      className={inputStyles["dropdown-container"]}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
      }}
    >
      <span>{value}</span>
      {isOpen ? (
        <div className={inputStyles["dropdown-item-container"]}>
          {submenus.map((submenu, idx) => (
            <div key={idx}>
              <div
                className={styles["dropdown-item"]}
                onClick={() => {
                  setValue(submenu);
                }}
              >
                {submenu}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <input name={name} style={{ display: "none" }} value={value} readOnly />
    </div>
  );
};

export default DropDown;
