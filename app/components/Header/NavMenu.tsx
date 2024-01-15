import { NavLink } from "@remix-run/react";
import styles from "./header.module.css";

interface Props {
  userClass: string;
}

const menuElements = {
  student: [
    { name: "내 수업", to: "/lectures" },
    { name: "제출 기록", to: "/submission-record" },
    { name: "내 성적", to: "/grade" },
  ],
  professor: [
    { name: "수강생 관리", to: "/students" },
    { name: "실습 관리", to: "/lectures" },
    { name: "성적 관리", to: "/grade" },
  ],
};

const NavMenu = ({ userClass }: Props) => {
  return (
    <div className={styles.navmenu}>
      {menuElements[userClass as keyof typeof menuElements].map((element) => (
        <NavLink key={element.to} to={element.to} className={styles.bold}>
          {element.name}
        </NavLink>
      ))}
    </div>
  );
};

export default NavMenu;
