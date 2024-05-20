import {
  MetaFunction,
  useNavigate,
  useParams,
  useSearchParams,
} from "@remix-run/react";
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
import toast from "react-hot-toast";

const TableHeader = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const lectureData = useLectureData();
  const dispatchLectureData = useLectureDataDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [lectureListLoading, setLectureListLoading] = useState(true);
  const [lectureList, setLectureList] = useState<Lecture[]>([]);
  const [pastLectureList, setPastLectureList] = useState<Lecture[]>([]);
  const [currentLectureList, setCurrentLectureList] = useState<Lecture[]>([]);
  const [futureLectureList, setFutureLectureList] = useState<Lecture[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const semester = searchParams.get("semester");

  useEffect(() => {
    const getLectureList = async () => {
      try {
        if (!semester || semester === "present") {
          const response = await getCurrentSemesterLectures(
            auth.userId,
            auth.token
          );
          setLectureList(response.data);
        } else if (semester === "past") {
          const response = await getPreviousSemesterLectures(
            auth.userId,
            auth.token
          );
          setLectureList(response.data);
        } else if (semester === "future") {
          const response = await getFutureSemesterLectures(
            auth.userId,
            auth.token
          );
          setLectureList(response.data);
        }
        const pastResponse = await getPreviousSemesterLectures(
          auth.userId,
          auth.token
        );
        const currentResponse = await getCurrentSemesterLectures(
          auth.userId,
          auth.token
        );
        const futureResponse = await getFutureSemesterLectures(
          auth.userId,
          auth.token
        );
        setPastLectureList(pastResponse.data);
        setCurrentLectureList(currentResponse.data);
        setFutureLectureList(futureResponse.data);
        setLectureListLoading(false);
      } catch (e: any) {
        toast.error(`Error: ${e.message} - ${e.responseMessage}`);
      }
    };
    getLectureList();
  }, [searchParams.get("semester")]);

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
      {semester && semester !== "present" ? (
        <h3
          className={styles["blue-link"]}
          onClick={() => {
            navigate(`/grade/${currentLectureList[0].id}?semester=present`);
            dispatchLectureData({
              type: "UPDATE_DATA",
              payload: {
                lectureName: currentLectureList[0].title,
                semester: "present",
              },
            });
          }}
        >
          현재 강의 관리하러 가기
        </h3>
      ) : null}
      {semester !== "past" && pastLectureList.length > 0 ? (
        <h3
          className={styles["blue-link"]}
          onClick={() => {
            navigate(`/grade/${pastLectureList[0].id}?semester=past`);
            dispatchLectureData({
              type: "UPDATE_DATA",
              payload: {
                lectureName: pastLectureList[0].title,
                semester: "past",
              },
            });
          }}
        >
          과거 강의 관리하러 가기
        </h3>
      ) : null}

      {semester !== "future" && futureLectureList.length > 0 ? (
        <h3
          className={styles["blue-link"]}
          onClick={() => {
            navigate(`/grade/${futureLectureList[0].id}?semester=future`);
            dispatchLectureData({
              type: "UPDATE_DATA",
              payload: {
                lectureName: futureLectureList[0].title,
                semester: "future",
              },
            });
          }}
        >
          미래 강의 관리하러 가기
        </h3>
      ) : null}

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
                    navigate(
                      `/grade/${lecture.id}${
                        semester ? `?semester=${semester}` : ""
                      }`
                    );
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
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    async function getData() {
      setDataHeaders(["사용자 이름", "학번", "총점"]);
      try {
        const response = await getLectureScoreBoard(
          auth.token,
          params.lectureId!
        );

        response.data.metadata.map((data) => {
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
                  await toast.promise(
                    reJudge(auth.token, {
                      practice_id: data.id as number,
                    }),
                    {
                      loading: "재채점 요청 중...",
                      success: "재채점 완료!",
                      error: (err) =>
                        `Error: ${err.message} - ${err.responseMessage}`,
                    }
                  );
                  setIsLoading(true);
                }
              }}
            >{`${data.title} (${data.score})`}</button>,
          ]);
        });
        setData(
          response.data.users.map((user) => {
            const map = new Map<string, ReactNode>();
            map.set("userName", user.name);
            map.set("userId", user.id);
            map.set("totalScore", user.total_score);
            user.scores.map((score, idx: number) => {
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
      } catch (e: any) {
        toast.error(`Error: ${e.message} - ${e.responseMessage}`);
      }
    }
    getData();
  }, [params.lectureId, isLoading, searchParams.get("semester")]);

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

export const meta: MetaFunction = () => {
  return [
    {
      title: "강의별 성적 보기 | KOJ",
    },
    {
      property: "description",
      content: "강의별 성적을 확인하는 화면입니다",
    },
    {
      property: "og:site_name",
      content: "KOJ - 성적 확인",
    },
  ];
};
