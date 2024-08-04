import { useAuth } from "~/contexts/AuthContext";
import Table from "./Table";
import styles from "./index.module.css";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { MetaFunction, useNavigate } from "@remix-run/react";
import { TickerProvider } from "~/contexts/TickerContext";

const Wrapper = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!auth.isRoleFetching && auth.role !== "professor") {
      toast.error("교수 전용 페이지입니다. 교수 계정으로 로그인 하세요");
      navigate("/");
    }
  }, []);
  return (
    <TickerProvider>
      <div className={styles.container}>
        <Table />
      </div>
    </TickerProvider>
  );
};

export default Wrapper;

export const meta: MetaFunction = () => {
  return [
    {
      title: "수강생 관리 | KOJ",
    },
    {
      property: "description",
      content: "수강생 관리 화면입니다",
    },
    {
      property: "og:site_name",
      content: "KOJ - 수강생 관리",
    },
  ];
};
