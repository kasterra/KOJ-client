import { Link } from "@remix-run/react";
import styles from "./element.module.css";

interface Props {
  title: string;
  link: string;
  level?: number;
  showIcons?: boolean;
  iconSrcList?: string[];
  onIconClickList?: (() => void)[];
}

export const LinkElement = ({
  title,
  link,
  showIcons = true,
  iconSrcList = [],
  onIconClickList = [],
  level,
}: Props) => {
  return (
    <div className={styles["element-block"]}>
      <div style={{ marginLeft: level ? level * 12 : undefined }} />
      <div className={styles["element-title-block"]}>
        <Link to={link}>
          <h3 className={styles["element-title-span"]}>{title}</h3>
        </Link>
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
