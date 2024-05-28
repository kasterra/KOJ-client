import { useAuth } from "~/contexts/AuthContext";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Outlet, useNavigate, useSearchParams } from "@remix-run/react";

const Wrapper = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (!auth.isRoleFetching && auth.role !== "professor") {
      toast.error("교수 전용 페이지입니다. 교수 계정으로 로그인 하세요");
      navigate("/");
    }
  }, []);
  useEffect(() => {
    if (!searchParams.get("lecture_id") || !searchParams.get("practice_id")) {
      toast.error(
        "강의 ID와 실습 ID 정보가 없습니다.\n\n잘못된 접근인것 같습니다"
      );
      navigate("/lectures");
    }
  }, []);
  return <Outlet />;
};

export default Wrapper;
