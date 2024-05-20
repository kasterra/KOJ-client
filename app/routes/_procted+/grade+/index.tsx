import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  getCurrentSemesterLectures,
  getFutureSemesterLectures,
  getPreviousSemesterLectures,
} from "~/API/lecture";
import { useAuth } from "~/contexts/AuthContext";
import { useLectureDataDispatch } from "~/contexts/LectureDataContext";
import { LectureEntity } from "~/types/APIResponse";

const GradeRedirect = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const dispatch = useLectureDataDispatch();

  useEffect(() => {
    async function getLectures() {
      try {
        const response = await getCurrentSemesterLectures(
          auth.userId,
          auth.token
        );
        if (response.data.length > 0) {
          dispatch({
            type: "UPDATE_DATA",
            payload: {
              semester: "present",
              lectureName: response.data[0].title,
            },
          });
          navigate(`/grade/${response.data[0].id}`);
        } else {
          const previousResponse = await getPreviousSemesterLectures(
            auth.userId,
            auth.token
          );
          if (previousResponse.data.length !== 0) {
            dispatch({
              type: "UPDATE_DATA",
              payload: {
                semester: "past",
                lectureName: previousResponse.data[0].title,
              },
            });
            navigate(`/grade/${previousResponse.data[0].id}?semester=past`);
          } else {
            const futureResponse = await getFutureSemesterLectures(
              auth.userId,
              auth.token
            );
            if (futureResponse.data.length !== 0) {
              dispatch({
                type: "UPDATE_DATA",
                payload: {
                  semester: "future",
                  lectureName: futureResponse.data[0].title,
                },
              });
              navigate(`/grade/${futureResponse.data[0].id}?semester=future`);
            }
          }
        }
      } catch (error: any) {
        toast.error(`Error: ${error.message} - ${error.responseMessage}`);
      }
    }
    getLectures();
  }, []);

  return null;
};

export default GradeRedirect;
