import { Link } from "@remix-run/react";
import styles from "./element.module.css";

interface Props {
  title: string;
  link: string;
}

export const LinkElement = ({ title, link }: Props) => {
  return (
    <div className={styles["element-block"]}>
      <div className={styles["element-title-block"]}>
        <Link to={link}>
          <h3 className={styles["element-title-span"]}>{title}</h3>
        </Link>
      </div>
    </div>
  );
};

export const SubLevelLinkElement = ({ title, link }: Props) => {
  return (
    <div className={styles["subelement-block"]}>
      <Link to={link}>
        <h4 className={styles["subelement-title-span"]}>{title}</h4>
      </Link>
    </div>
  );
};
