import { useState } from "react";
import styles from "./header.module.css";
import formStyles from "~/components/common/form.module.css";
import { changePassword } from "~/API/user";
import { Link, useNavigate, useLocation } from "@remix-run/react";
import Modal from "../Modal";
import PWInput from "../Input/PWInput";
import { useAuthDispatch } from "~/contexts/AuthContext";
import toast from "react-hot-toast";

interface Props {
  userId: string;
  token: string;
  userName: string;
  userClass: string;
  isAdmin: boolean;
}

const userClassToText = (userClass: string) => {
  switch (userClass) {
    case "admin":
      return "관리자";
    case "professor":
      return "교수";
    case "student":
      return "학생";
    default:
      return "알 수 없음";
  }
};

const UserInfo = ({ userId, token, userName, userClass, isAdmin }: Props) => {
  const [isPWChangeModalOpen, setIsPWChangeModalOpen] = useState(false);
  const authDispatch = useAuthDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  async function onPWChangeModalSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const old_password = formData.get("currentPW")! as string;
    const new_password = formData.get("newPW")! as string;
    const new_password2 = formData.get("newPW2")! as string;

    if (new_password !== new_password2) {
      toast.error("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    await toast.promise(
      changePassword(userId, token, old_password, new_password),
      {
        loading: "변경중...",
        success: "성공적으로 변경되었습니다!",
        error: (err) => `Error: ${err.message} - ${err.responseMessage}`,
      }
    );
  }

  async function logout() {
    authDispatch({ type: "DELETE_DATA" });
    navigate("/");
  }

  return (
    <div className={styles.userinfo}>
      <span>
        {userClassToText(userClass) + " "}
        <span className={styles.bold}>{userName}</span> 님
      </span>
      <div className={styles["logout-button"]} onClick={logout}>
        로그아웃
      </div>
      <div
        className={styles["normal-button"]}
        onClick={() => setIsPWChangeModalOpen(true)}
      >
        비밀번호 변경
      </div>
      {isAdmin ? (
        location.pathname.includes("/admin") ? (
          <Link to="/lectures" className={styles["normal-button"]}>
            돌아가기
          </Link>
        ) : (
          <Link to="/admin/users" className={styles["normal-button"]}>
            관리자 페이지
          </Link>
        )
      ) : null}
      <Modal
        title="비밀번호 재설정"
        subtitle="비밀번호를 재설정 합니다"
        isOpen={isPWChangeModalOpen}
        onClose={() => setIsPWChangeModalOpen(false)}
      >
        <form className={styles["modal-body"]} onSubmit={onPWChangeModalSubmit}>
          <PWInput
            title="현재 비밀번호"
            name="currentPW"
            placeholder="기존 비밀번호 입력"
          />
          <PWInput
            title="새 비밀번호"
            name="newPW"
            placeholder="새 비밀번호 입력 (최소 8자 이상)"
          />
          <PWInput
            title="새 비밀번호 확인"
            name="newPW2"
            placeholder="새 비밀번호 입력 확인 (최소 8자 이상)"
          />
          <button
            type="submit"
            style={{ marginTop: 50 }}
            className={formStyles["primary-button"]}
          >
            비밀번호 변경
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default UserInfo;
