import { Link } from "@remix-run/react";
import styles from "./dropdown.module.css";

interface Props {
  submenuTitles: string[];
  submenuLinks: string[];
  onClickList?: (() => void)[];
}

const LinkDropdown = ({ submenuTitles, submenuLinks, onClickList }: Props) => {
  return (
    <div className={styles["dropdown-item-container"]}>
      {submenuLinks.map((submenuLink, index) => (
        <Link
          to={submenuLink}
          key={submenuLink}
          onClick={onClickList ? onClickList[index] : undefined}
        >
          <div className={styles["dropdown-item"]}>{submenuTitles[index]}</div>
        </Link>
      ))}
    </div>
  );
};

export default LinkDropdown;
