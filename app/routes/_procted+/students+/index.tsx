import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { useAuth } from "~/contexts/AuthContext";
import { getCurrentSemesterLectures } from "~/API/lecture";
import toast from "react-hot-toast";
import { useLectureDataDispatch } from "~/contexts/LectureDataContext";
import { LectureEntity, isSuccessResponse } from "~/types/APIResponse";

const index = () => {
  const { token, userId } = useAuth();
  const navigate = useNavigate();
  const dispatch = useLectureDataDispatch();
  const [loading, setLoading] = useState(true);
  const [firstLectId, setFirstLectId] = useState("");

  useEffect(() => {
    const getFirstLecture = async () => {
      try {
        const response = await getCurrentSemesterLectures(userId, token);
        if (!isSuccessResponse(response)) {
          toast.error("강의를 불러오는데 실패하였습니다");
          return;
        }
        if ((response.data as LectureEntity[]).length === 0) {
          toast("현재 학기에 강의를 생성하신 후 이용해 주세요");
          navigate("/lectures");
        }
        setFirstLectId((response.data as LectureEntity[])[0].id + "");
        dispatch({
          type: "UPDATE_DATA",
          payload: {
            semester: "present",
            lectureName: (response.data as LectureEntity[])[0].title,
          },
        });
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    getFirstLecture();
  }, []);

  useEffect(() => {
    if (!loading) {
      navigate(firstLectId);
    }
  }, [loading]);

  return <h1>강의 목록을 불러오는 중입니다...</h1>;
};

export default index;
