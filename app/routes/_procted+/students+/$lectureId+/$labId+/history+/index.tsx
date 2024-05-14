import { useState, useRef, useEffect, ReactNode } from "react";
import styles from "./index.module.css";
import dropdownStyles from "~/components/common/dropdown.module.css";
import chevUpSVG from "~/assets/chevronUp.svg";
import chevDownSVG from "~/assets/chevronDown.svg";
import {
  MetaFunction,
  useNavigate,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { useAuth } from "~/contexts/AuthContext";
import {
  getLectureWithLectureId,
  getProblemWithProblemId,
} from "~/API/lecture";
import TableBase from "~/components/Table/TableBase";
import { getSubmissionStatus } from "~/API/submission";
import SubmissionDetailModal from "./SubmissionDetailModal";
import { getPracticeWithPracticeId } from "~/API/practice";

const TableHeader = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const problemId = searchParams.get("problemId");
  const [practiceListLoading, setPracticeListLoading] = useState(true);
  const [problemListLoading, setProblemListLoading] = useState(true);
  const [practiceList, setPracticeList] = useState<
    {
      id: number;
      title: string;
    }[]
  >([]);
  const [problemList, setProblemList] = useState<
    { id: number; title: string }[]
  >([{ id: -1, title: "---" }]);
  const [practiceName, setPracticeName] = useState("");
  const [currentProblem, setCurrentProblem] = useState<{
    id: number;
    title: string;
  }>({ id: -1, title: "---" });
  const [isPracticeListOpen, setIsPracticeListOpen] = useState(false);
  const [isProblemListOpen, setIsProblemListOpen] = useState(false);
  const tableHeaderContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getPracticeList = async () => {
      try {
        const response = await getLectureWithLectureId(
          params.lectureId!,
          auth.token
        );
        if (response.status === 200) {
          setPracticeList((response.data as any).practices);
          setPracticeName(
            (response.data as any).practices.find(
              (practice: { id: number; title: string }) =>
                practice.id === Number(params.labId)
            )?.title
          );
          setPracticeListLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getPracticeList();
  }, [params.lectureId, params.labId]);

  useEffect(() => {
    const getProblemList = async () => {
      const response = await getPracticeWithPracticeId(
        params.labId!,
        auth.token
      );
      if (response.status === 200) {
        setProblemList(((response as any).data as any).problems);
        setCurrentProblem(
          ((response as any).data as any).problems.find(
            (problem: { id: number; title: string }) =>
              problem.id === parseInt(problemId!)
          )
        );
        setProblemListLoading(false);
      }
    };
    if (problemId) getProblemList();
    else setProblemListLoading(false);
  }, [problemId]);

  const handleClickOutsideList = (event: MouseEvent) => {
    if (
      tableHeaderContainerRef.current &&
      !tableHeaderContainerRef.current.contains(event.target as Node)
    ) {
      setIsPracticeListOpen(false);
      setIsProblemListOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideList);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideList);
    };
  }, [tableHeaderContainerRef]);

  return practiceListLoading || problemListLoading ? (
    <span>loading...</span>
  ) : (
    <div className={styles["header-container"]} ref={tableHeaderContainerRef}>
      <button
        className={styles.dropdown}
        onClick={() => setIsPracticeListOpen((prev) => !prev)}
      >
        {practiceName}
        <img
          className={styles.icon}
          src={isPracticeListOpen ? chevUpSVG : chevDownSVG}
          alt={isPracticeListOpen ? "열림" : "닫힘"}
        />
      </button>

      <button
        className={styles.dropdown}
        onClick={() => setIsProblemListOpen((prev) => !prev)}
      >
        {currentProblem.title}
        <img
          className={styles.icon}
          src={isProblemListOpen ? chevUpSVG : chevDownSVG}
          alt={isProblemListOpen ? "열림" : "닫힘"}
        />
      </button>

      {isPracticeListOpen ? (
        <div className={dropdownStyles["dropdown-item-container"]}>
          {practiceList.map((practice) => (
            <div
              className={dropdownStyles["dropdown-item"]}
              key={practice.id}
              onClick={() => {
                navigate(
                  `/students/${params.lectureId}/${practice.id}/history`
                );
              }}
            >
              {practice.title}
            </div>
          ))}
        </div>
      ) : null}
      {isProblemListOpen ? (
        <div
          className={dropdownStyles["dropdown-item-container"]}
          style={{ left: 180 }}
        >
          {problemList.map((problem) => (
            <div
              className={dropdownStyles["dropdown-item"]}
              key={problem.id}
              onClick={() => {
                if (problem.id !== -1)
                  setSearchParams({ problemId: problem.id.toString() });
              }}
            >
              {problem.title}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

let prevData: any[] = [];

let intervalId: NodeJS.Timeout | undefined = undefined;

const Table = () => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const lectureId = params.lectureId!;
  const [searchParams] = useSearchParams();
  const problemId = searchParams.get("problemId");
  const [data, setData] = useState([]);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [detailId, setDetailId] = useState(0);

  useEffect(() => {
    async function getData() {
      const response = await getSubmissionStatus(auth.token, {
        user_id: auth.userId,
        lecture_id: lectureId,
        practice_id: Number(params.labId),
        problem_id: problemId ? Number(problemId) : undefined,
      });
      if (JSON.stringify(response.data) !== JSON.stringify(prevData)) {
        setIsLoading(true);
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
    if (intervalId !== undefined) {
      clearInterval(intervalId);
      setIsLoading(true);
      getData();
      intervalId = setInterval(() => {
        if (data.length === 0 || !isLoading) getData();
      }, 1000);
    } else {
      intervalId = setInterval(() => {
        if (data.length === 0 || !isLoading) getData();
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [params.lectureId, params.labId, problemId]);

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

export const meta: MetaFunction = () => {
  return [
    {
      title: "제출이력 조회 | KOJ",
    },
    {
      property: "description",
      content: "제출이력 조회 화면입니다",
    },
    {
      property: "og:site_name",
      content: "KOJ - 제출 이력",
    },
  ];
};
