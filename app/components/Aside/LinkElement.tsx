import { Link } from "@remix-run/react";
import styles from "./element.module.css";

interface Props {
  title: string;
  link: string;
  level?: number;
}

export const LinkElement = ({ title, link, level }: Props) => {
  return (
    <div className={styles["element-block"]}>
      <div style={{ marginLeft: level ? level * 12 : undefined }} />
      <div className={styles["element-title-block"]}>
        <Link to={link}>
          <h3 className={styles["element-title-span"]}>{title}</h3>
        </Link>
      </div>
    </div>
  );
};

export const SubLevelLinkElement = ({ title, link, level }: Props) => {
  return (
    <div className={styles["subelement-block"]}>
      <div style={{ marginLeft: level ? level * 12 : undefined }} />
      <Link to={link}>
        <h4 className={styles["subelement-title-span"]}>{title}</h4>
      </Link>
    </div>
  );
};
