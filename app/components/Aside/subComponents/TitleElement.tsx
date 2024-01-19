import { useState, useEffect, useRef } from "react";
import LinkDropdown from "~/components/common/LinkDropdown";
import styles from "./element.module.css";
import chevronDownSVG from "~/assets/chevronDown.svg";
import chevronUpSVG from "~/assets/chevronUp.svg";

interface Props {
  title: string;
}

interface PropsWithSubmenus extends Props {
  submenuTitles: string[];
  submenuLinks: string[];
}

export const PlainTitle = ({ title }: Props) => {
  return (
    <div className={styles["title-block"]}>
      <h2 className={styles["title-span"]}>{title}</h2>
    </div>
  );
};

export const TitleWithSubmenus = ({
  title,
  submenuTitles,
  submenuLinks,
}: PropsWithSubmenus) => {
  const containerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const buttonOnClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  return (
    <button
      className={styles["title-block"]}
      onClick={buttonOnClick}
      ref={containerRef}
    >
      <h2 className={styles["title-span"]}>{title}</h2>
      <img
        src={isOpen ? chevronUpSVG : chevronDownSVG}
        alt={isOpen ? "submenu close icon" : "submenu open icon"}
      />
      {isOpen && (
        <LinkDropdown
          submenuLinks={submenuLinks}
          submenuTitles={submenuTitles}
        />
      )}
    </button>
  );
};
