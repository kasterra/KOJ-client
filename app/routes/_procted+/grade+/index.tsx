import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import {
  getCurrentSemesterLectures,
  getFutureSemesterLectures,
  getPreviousSemesterLectures,
} from "~/API/lecture";
import { useAuth } from "~/contexts/AuthContext";
import { useLectureDataDispatch } from "~/contexts/LectureDataContext";
import {
  LectureEntity,
  SuccessLecturesResponse,
  isSuccessResponse,
} from "~/types/APIResponse";

const GradeRedirect = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const dispatch = useLectureDataDispatch();

  useEffect(() => {
    async function getLectures() {
      const response = await getCurrentSemesterLectures(
        auth.userId,
        auth.token
      );
      if (isSuccessResponse(response)) {
        dispatch({
          type: "UPDATE_DATA",
          payload: {
            semester: "present",
            lectureName: (response as SuccessLecturesResponse).data[0].title,
          },
        });
        navigate(`/grade/${(response as SuccessLecturesResponse).data[0].id}`);
      } else {
        const previousResponse = await getPreviousSemesterLectures(
          auth.userId,
          auth.token
        );
        if (previousResponse.status === 200) {
          if ((previousResponse as SuccessLecturesResponse).data.length !== 0) {
            dispatch({
              type: "UPDATE_DATA",
              payload: {
                semester: "past",
                lectureName: (
                  (previousResponse as SuccessLecturesResponse)
                    .data as LectureEntity[]
                )[0].title,
              },
            });
            navigate(
              `/grade/${
                (previousResponse as SuccessLecturesResponse).data[0].id
              }?semester=past`
            );
          }
        } else {
          const futureResponse = await getFutureSemesterLectures(
            auth.userId,
            auth.token
          );
          if (futureResponse.status === 200) {
            if ((futureResponse as SuccessLecturesResponse).data.length !== 0) {
              dispatch({
                type: "UPDATE_DATA",
                payload: {
                  semester: "future",
                  lectureName: (futureResponse as SuccessLecturesResponse)
                    .data[0].title,
                },
              });
              navigate(
                `/grade/${
                  (futureResponse as SuccessLecturesResponse).data[0].id
                }?semester=future`
              );
            }
          }
        }
      }
    }
    getLectures();
  }, []);

  return null;
};

export default GradeRedirect;
