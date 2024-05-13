import { useNavigate, useParams } from "@remix-run/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { getLectureScoreBoard, reJudge } from "~/API/submission";
import TableBase from "~/components/Table/TableBase";
import chevUpSVG from "~/assets/chevronUp.svg";
import chevDownSVG from "~/assets/chevronDown.svg";
import { useAuth } from "~/contexts/AuthContext";
import {
  useLectureData,
  useLectureDataDispatch,
} from "~/contexts/LectureDataContext";
import { Lecture } from "~/types";
import dropdownStyles from "~/components/common/dropdown.module.css";
import styles from "./index.module.css";
import headerStyles from "~/routes/_procted+/students+/$lectureId+/$labId+/history+/index.module.css";
import {
  getCurrentSemesterLectures,
  getPreviousSemesterLectures,
  getFutureSemesterLectures,
} from "~/API/lecture";
import {
  isSuccessResponse,
  SuccessLecturesResponse,
} from "~/types/APIResponse";
import toast from "react-hot-toast";

const TableHeader = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const lectureData = useLectureData();
  const dispatchLectureData = useLectureDataDispatch();
  const [lectureListLoading, setLectureListLoading] = useState(true);
  const [lectureList, setLectureList] = useState<Lecture[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getLectureList = async () => {
      try {
        if (lectureData.semester === "present") {
          const response = await getCurrentSemesterLectures(
            auth.userId,
            auth.token
          );
          if (isSuccessResponse(response))
            setLectureList((response as SuccessLecturesResponse).data);
        } else if (lectureData.semester === "past") {
          const response = await getPreviousSemesterLectures(
            auth.userId,
            auth.token
          );
          if (isSuccessResponse(response))
            setLectureList((response as SuccessLecturesResponse).data);
        } else if (lectureData.semester === "future") {
          const response = await getFutureSemesterLectures(
            auth.userId,
            auth.token
          );
          if (isSuccessResponse(response))
            setLectureList((response as SuccessLecturesResponse).data);
        }
        setLectureListLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getLectureList();
  }, [lectureData.semester]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  return (
    <div className={headerStyles["header-container"]} ref={containerRef}>
      <button
        className={headerStyles.dropdown}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {lectureData.lectureName}
        <img
          className={headerStyles.icon}
          src={isOpen ? chevUpSVG : chevDownSVG}
          alt={isOpen ? "열림" : "닫힘"}
        />
      </button>

      {isOpen ? (
        <div className={dropdownStyles["dropdown-item-container"]}>
          {lectureListLoading
            ? "강의목록 로딩중..."
            : lectureList.map((lecture) => (
                <div
                  className={dropdownStyles["dropdown-item"]}
                  key={lecture.id}
                  onClick={() => {
                    dispatchLectureData({
                      type: "UPDATE_DATA",
                      payload: {
                        lectureName: lecture.title,
                        semester: lectureData.semester,
                      },
                    });
                    navigate(`/grade/${lecture.id}`);
                  }}
                >
                  {lecture.title}
                </div>
              ))}
        </div>
      ) : null}
    </div>
  );
};

const LectureScoreBoard = () => {
  const auth = useAuth();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const [dataHeaders, setDataHeaders] = useState<ReactNode[]>([
    "사용자 이름",
    "학번",
    "총점",
  ]);

  useEffect(() => {
    async function getData() {
      setDataHeaders(["사용자 이름", "학번", "총점"]);
      const response = await getLectureScoreBoard(
        auth.token,
        params.lectureId!
      );
      if (response.status === 200) {
        response.data.metadata.map((data: any) => {
          setDataHeaders((prev) => [
            ...prev,
            <button
              className={styles["white-button"]}
              onClick={async () => {
                if (
                  confirm(
                    `모든 학생에 대해 ${data.title} 실습을 재채점 하시겠습니까?`
                  )
                ) {
                  const response = await reJudge(auth.token, {
                    practice_id: data.id as number,
                  });
                  if (response.status === 200) {
                    toast.success("재채점 완료!");
                    setIsLoading(true);
                  }
                }
              }}
            >{`${data.title} (${data.score})`}</button>,
          ]);
        });
        setData(
          response.data.users.map((user: any) => {
            const map = new Map<string, ReactNode>();
            map.set("userName", user.name);
            map.set("userId", user.id);
            map.set("totalScore", user.total_score);
            user.scores.map((score: any, idx: number) => {
              map.set(
                `problemNo${idx}`,
                `${
                  score === response.data.metadata[idx].score
                    ? "○"
                    : score > 0
                    ? "△"
                    : "✕"
                } (${score})`
              );
            });
            return map;
          })
        );
        setIsLoading(false);
      }
    }
    getData();
  }, [params.lectureId, isLoading]);

  return isLoading ? (
    <h2>Loading...</h2>
  ) : (
    <TableBase
      gridTemplateColumns={`150px 150px ${"200px ".repeat(
        dataHeaders.length - 2
      )}`}
      dataHeaders={dataHeaders}
      TableHeader={TableHeader}
      dataRows={data}
    />
  );
};

export default LectureScoreBoard;
