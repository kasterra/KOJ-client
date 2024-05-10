import { NavLink } from "@remix-run/react";
import styles from "./header.module.css";

interface Props {
  userClass: string;
}

const menuElements = {
  student: [{ name: "내 수업", to: "/lectures" }],
  professor: [
    { name: "수강생 관리", to: "/students" },
    { name: "실습 관리", to: "/lectures" },
    { name: "성적 관리", to: "/grade" },
  ],
  admin: [
    { name: "사용자 관리", to: "/admin/users" },
    { name: "학기 관리", to: "/admin/semester-manage" },
    { name: "연구 기능", to: "/admin/research" },
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
