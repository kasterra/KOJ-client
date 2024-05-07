import { useAuth } from "~/contexts/AuthContext";
import Table from "./Table";
import styles from "./index.module.css";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "@remix-run/react";

const Wrapper = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.role !== "professor") {
      toast.error("교수 전용 페이지입니다. 교수 계정으로 로그인 하세요");
      navigate("/");
    }
  }, []);
  return (
    <div className={styles.container}>
      <Table />
    </div>
  );
};

export default Wrapper;
