import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { getCurrentSemesterLectures } from "~/API/lecture";
import { useAuth } from "~/contexts/AuthContext";
import {
  SuccessLecturesResponse,
  isSuccessResponse,
} from "~/types/APIResponse";

const GradeRedirect = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth.role !== "professor") {
      toast.error("교수 전용 페이지입니다. 교수 계정으로 로그인 하세요");
      navigate("/");
    }
  });
  useEffect(() => {
    async function getLectures() {
      const response = await getCurrentSemesterLectures(
        auth.userId,
        auth.token
      );
      if (isSuccessResponse(response)) {
        navigate(`/grade/${(response as SuccessLecturesResponse).data[0].id}`);
      }
    }
    getLectures();
  }, []);

  return (
    <h1>
      내 강의로 리다이렉트중....
      <br />이 화면이 계속 나온다면, 이번 학기에 강의중인 강의가 있는지 확인해
      보세요
    </h1>
  );
};

export default GradeRedirect;
