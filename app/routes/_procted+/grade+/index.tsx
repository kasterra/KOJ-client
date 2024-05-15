import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import {
  getCurrentSemesterLectures,
  getFutureSemesterLectures,
  getPreviousSemesterLectures,
} from "~/API/lecture";
import { useAuth } from "~/contexts/AuthContext";
import {
  SuccessLecturesResponse,
  isSuccessResponse,
} from "~/types/APIResponse";

const GradeRedirect = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    async function getLectures() {
      const response = await getCurrentSemesterLectures(
        auth.userId,
        auth.token
      );
      if (isSuccessResponse(response)) {
        navigate(`/grade/${(response as SuccessLecturesResponse).data[0].id}`);
      } else {
        const previousResponse = await getPreviousSemesterLectures(
          auth.userId,
          auth.token
        );
        if (previousResponse.status === 200) {
          if ((previousResponse as SuccessLecturesResponse).data.length !== 0) {
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
