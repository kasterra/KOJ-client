import { useEffect, useState } from "react";
import { getUserInfo } from "~/API/user";
import styles from "./header.module.css";
import { useNavigate } from "@remix-run/react";
import { useAuth } from "~/contexts/AuthContext";
import LogoSVG from "~/assets/logo.svg";
import NavMenu from "./NavMenu";
import UserInfo from "./UserInfo";

export async function loader() {}

const Header = () => {
  const navigate = useNavigate();
  const { userId, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userClass, setUserClass] = useState("");
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const isContextLoading = userId === "" || token === "";

  useEffect(() => {
    const getUserInfoFromServer = async () => {
      if (isContextLoading) {
        return;
      }
      const {
        status,
        message,
        data: { name, role, is_admin },
      } = await getUserInfo(userId, token);

      console.log(status, name, message, role);
      if (status === 200) {
        if (is_admin) {
          setIsAdmin(true);
        }
        setUserClass(role);
        setUserName(name);
      } else if (status === 401) {
        alert("권한이 없거나 토큰이 만료되었습니다. 다시 로그인 해주세요");
        navigate("/");
      } else if (status === 404) {
        alert("사용자 ID가 변조되었습니다. 다시 로그인 해주세요");
        navigate("/");
      }
      setIsLoading(false);
    };

    getUserInfoFromServer();
  }, [userId, token]);
  return isLoading || userId === "" || token === "" ? null : (
    <header className={styles.container}>
      <div className={styles["navmenu-container"]}>
        <img src={LogoSVG} alt="KOJ logo" className={styles.logo} />
        <NavMenu userClass={userClass} />
      </div>
      <div className={styles["userinfo-container"]}>
        <UserInfo
          userId={userId}
          token={token}
          userName={userName}
          userClass={userClass}
          isAdmin={isAdmin}
        />
      </div>
    </header>
  );
};

export default Header;
