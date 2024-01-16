import { useEffect, useState } from "react";
import { getUserInfo } from "~/API/user";
import styles from "./header.module.css";
import { Link, useNavigate, useLocation } from "@remix-run/react";
import { useAuth } from "~/contexts/AuthContext";
import LogoSVG from "~/assets/logo.svg";
import NavMenu from "./NavMenu";
import UserInfo from "./UserInfo";
import toast from "react-hot-toast";

export async function loader() {}

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userClass, setUserClass] = useState("");
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const isContextLoading = userId === "" || token === "";

  useEffect(() => {
    const getUserInfoFromServer = async () => {
      const { status, message, ...data } = await getUserInfo(userId, token);

      const { name, role, is_admin } = data.data;

      if (status === 200) {
        setUserClass(role);
        if (is_admin) {
          setIsAdmin(true);
          if (location.pathname.includes("admin")) {
            setUserClass("admin");
          }
        }
        setUserName(name);
      } else if (status === 401) {
        toast.error(
          "권한이 없거나 토큰이 만료되었습니다. 다시 로그인 해주세요"
        );
        navigate("/");
      } else if (status === 404) {
        toast.error("사용자 ID가 변조되었습니다. 다시 로그인 해주세요");
        navigate("/");
      }
      setIsLoading(false);
    };

    getUserInfoFromServer();
  }, [userId, token]);
  return isLoading || userId === "" || token === "" ? null : (
    <header className={styles.container}>
      <div className={styles["navmenu-container"]}>
        <Link to="/lectures">
          <img src={LogoSVG} alt="KOJ logo" className={styles.logo} />
        </Link>
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
