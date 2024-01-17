import { useEffect, useState } from "react";
import { getUserInfo } from "~/API/user";
import styles from "./header.module.css";
import { Link, useNavigate, useLocation } from "@remix-run/react";
import { useAuth } from "~/contexts/AuthContext";
import LogoSVG from "~/assets/logo.svg";
import NavMenu from "./NavMenu";
import UserInfo from "./UserInfo";

export async function loader() {}

const Header = () => {
  const {
    userId,
    token,
    isRoleFetching: isLoading,
    isAdmin,
    role: userClass,
    userName,
  } = useAuth();

  return isLoading || userId === "" || token === "" ? null : (
    <header className={styles.container}>
      <div className={styles["navmenu-container"]}>
        <Link to="/lectures">
          <img src={LogoSVG} alt="KOJ logo" className={styles.logo} />
        </Link>
        <NavMenu userClass={userClass!} />
      </div>
      <div className={styles["userinfo-container"]}>
        <UserInfo
          userId={userId}
          token={token}
          userName={userName}
          userClass={userClass!}
          isAdmin={isAdmin}
        />
      </div>
    </header>
  );
};

export default Header;
