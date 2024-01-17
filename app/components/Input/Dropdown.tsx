import { useEffect, useRef, useState } from "react";
import styles from "~/components/common/dropdown.module.css";
import inputStyles from "./input.module.css";

interface Props {
  name: string;
  submenus: string[];
}

const DropDown = ({ submenus, name }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={inputStyles["dropdown-container"]}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
      }}
    >
      <span>{inputRef.current?.value}</span>
      {isOpen ? (
        <div className={inputStyles["dropdown-item-container"]}>
          {submenus.map((submenu, idx) => (
            <div key={idx}>
              <div
                className={styles["dropdown-item"]}
                onClick={() => {
                  inputRef.current!.value = submenu;
                }}
              >
                {submenu}
              </div>
            </div>
          ))}
          <input name={name} ref={inputRef} style={{ display: "none" }} />
        </div>
      ) : null}
    </div>
  );
};

export default DropDown;
