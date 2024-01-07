import { Link } from "@remix-run/react";
import styles from "./dropdown.module.css";

interface Props {
  submenuTitles: string[];
  submenuLinks: string[];
}

const LinkDropdown = ({ submenuTitles, submenuLinks }: Props) => {
  return (
    <div className={styles["dropdown-container"]}>
      {submenuLinks.map((submenuLink, index) => (
        <Link to={submenuLink} key={submenuLink}>
          <div className={styles["dropdown-item"]}>{submenuTitles[index]}</div>
        </Link>
      ))}
    </div>
  );
};

export default LinkDropdown;
