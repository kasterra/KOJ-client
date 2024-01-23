import React from "react";
import { useAuthDispatch } from "~/contexts/AuthContext";
import { useNavigate } from "@remix-run/react";
import styles from "~/css/routes/login.module.css";
import formStyles from "~/components/common/form.module.css";
import LogoSVG from "~/assets/logo.svg";
import TextInput from "~/components/Input/TextInput";
import PWInput from "~/components/Input/PWInput";
import { login } from "~/API/user";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const authDispatch = useAuthDispatch();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = formData.get("id") as string;
    const password = formData.get("password") as string;
    if (!id || !password) {
      toast.error("ID와 비밀번호를 입력하십시오!");
      return;
    }
    const response = await login(id, password);

    if (response.status === 201) {
      authDispatch({
        type: "UPDATE_DATA",
        payload: { token: response.data.token, userId: id },
      });
      toast.success("성공적으로 로그인 하였습니다!");
      navigate("/lectures");
    } else toast(response.message, { icon: "⚠️" });
  }

  return (
    <div className={styles.bg}>
      <div className={styles.container}>
        <img src={LogoSVG} alt="KOJ logo" className={styles.logo}></img>
        <form className={styles.form} method="POST" onSubmit={handleSubmit}>
          <div className={formStyles["title-area"]}>
            <h2 className={formStyles.title}>로그인</h2>
            <h3 className={formStyles.subtitle}>
              KOJ 사용을 위해서 로그인이 필요합니까?
            </h3>
          </div>

          <div>
            <TextInput title="ID(학번)" name="id" placeholder="ex:2023123456" />
            <PWInput
              title="비밀번호"
              name="password"
              placeholder="초기 비밀번호 : password"
            />
          </div>

          <button type="submit" className={formStyles["primary-button"]}>
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
