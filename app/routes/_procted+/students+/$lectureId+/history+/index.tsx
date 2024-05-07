import { useState, useRef, useEffect, ReactNode } from "react";
import styles from "./index.module.css";
import dropdownStyles from "~/components/common/dropdown.module.css";
import chevUpSVG from "~/assets/chevronUp.svg";
import chevDownSVG from "~/assets/chevronDown.svg";
import { useNavigate, useParams } from "@remix-run/react";
import { useAuth } from "~/contexts/AuthContext";
import {
  useLectureData,
  useLectureDataDispatch,
} from "~/contexts/LectureDataContext";
import { Lecture } from "~/types";
import {
  getCurrentSemesterLectures,
  getFutureSemesterLectures,
  getPreviousSemesterLectures,
} from "~/API/lecture";
import {
  SuccessLecturesResponse,
  isSuccessResponse,
} from "~/types/APIResponse";
import TableBase from "~/components/Table/TableBase";
import { getSubmissionStatus } from "~/API/submission";
import SubmissionDetailModal from "./SubmissionDetailModal";

const TableHeader = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const lectureData = useLectureData();
  const dispatchLectureData = useLectureDataDispatch();
  const [lectureListLoading, setLectureListLoading] = useState(true);
  const [lectureList, setLectureList] = useState<Lecture[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
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
    <div className={styles["header-container"]} ref={containerRef}>
      <button
        className={styles.dropdown}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {lectureData.lectureName}
        <img
          className={styles.icon}
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
                    navigate(`/students/${lecture.id}`);
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

let prevData: any[] = [];

const Table = () => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const lectureId = params.lectureId!;
  const [data, setData] = useState([]);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [detailId, setDetailId] = useState(0);

  useEffect(() => {
    async function getData() {
      const response = await getSubmissionStatus(auth.token, {
        user_id: auth.userId,
        lecture_id: lectureId,
      });
      if (JSON.stringify(response.data) !== JSON.stringify(prevData)) {
        setIsLoading(true);
        console.log(response);
      }
      if (response.status === 200) {
        prevData = response.data;
        setData(
          response.data.map((data: any) => {
            const map = new Map<string, ReactNode>();
            map.set("id", data.id);
            map.set(
              "result",
              (function () {
                switch (data.status) {
                  case "accepted":
                    return <span className={styles.correct}>맞았습니다</span>;
                  case "time_limit":
                    return <span className={styles.wrong}>시간 초과</span>;
                  case "memory_limit":
                    return <span className={styles.wrong}>메모리 초과</span>;
                  case "wrong_answer":
                    return <span className={styles.wrong}>틀렸습니다</span>;
                  case "runtime_error":
                    return <span className={styles.error}>런타임 에러</span>;
                  case "compile_error":
                    return <span className={styles.error}>컴파일 에러</span>;
                  case "pending":
                    return <span className={styles.waiting}>기다리는 중</span>;
                  case "running":
                    return (
                      <span
                        className={styles.inprogress}
                      >{`실행중 ${data.progress}%`}</span>
                    );
                  case "internal_error":
                    return <span className={styles.error}>서버 내부 에러</span>;
                  default:
                    return <span className={styles.error}>{data.status}</span>;
                }
              })()
            );
            map.set("time", new Date(data.created_at).toLocaleString());
            map.set(
              "buttons",
              <div className={styles["buttons-container"]}>
                <button
                  className={styles["white-button"]}
                  onClick={() => {
                    setDetailId(data.id);
                    setIsSubmissionModalOpen(true);
                  }}
                >
                  제출 결과 보기
                </button>
              </div>
            );
            return map;
          })
        );
        setIsLoading(false);
      }
    }
    const interval = setInterval(() => {
      if (data.length === 0 || !isLoading) getData();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return isLoading ? (
    <h3>loading...</h3>
  ) : (
    <>
      <TableBase
        gridTemplateColumns="195px 270px 250px 1fr"
        TableHeader={TableHeader}
        dataRows={data}
        dataHeaders={["채점 ID", "결과", "제출 시간", ""]}
      />
      {isSubmissionModalOpen && (
        <SubmissionDetailModal
          isOpen={isSubmissionModalOpen}
          onClose={() => setIsSubmissionModalOpen(false)}
          submissionId={detailId}
        />
      )}
    </>
  );
};

export default Table;
