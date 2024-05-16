import { MetaFunction, useParams } from "@remix-run/react";
import { ReactNode, useEffect, useState } from "react";
import { getPracticeWithPracticeId } from "~/API/practice";
import { getPracticeScoreBoard, reJudge } from "~/API/submission";
import { useAuth } from "~/contexts/AuthContext";
import styles from "../index.module.css";
import TableBase from "~/components/Table/TableBase";
import toast from "react-hot-toast";
import SubmissionRecordModal from "./SubmissionRecordModal";

const PracticeScoreBoard = () => {
  const params = useParams();
  const auth = useAuth();
  const [practiceName, setPracticeName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const [dataHeaders, setDataHeaders] = useState<ReactNode[]>(["이름", "총점"]);
  const [isSubmissionRecordModalOpen, setIsSubmissionRecordModalOpen] =
    useState(false);
  const [problemID, setProblemID] = useState(0);
  const [studentID, setStudentID] = useState("");
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    async function getPracticeName() {
      const response = await getPracticeWithPracticeId(
        params.practiceId!,
        auth.token
      );
      if (response.status === 200) {
        setPracticeName((response as any).data.name);
      }
    }
    getPracticeName();
  }, [params.practiceId]);

  useEffect(() => {
    async function getPracticeScore() {
      setDataHeaders(["이름", "총점"]);
      const response = await getPracticeScoreBoard(
        auth.token,
        params.practiceId!
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
                    `모든 학생에 대해 ${data.title} 문제를 재채점 하시겠습니까?`
                  )
                ) {
                  const response = await reJudge(auth.token, {
                    practice_id: parseInt(params.practiceId!),
                    problem_id: data.id as number,
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
      }
      setData(
        response.data.users.map((user: any, userIdx: number) => {
          const map = new Map<string, ReactNode>();
          map.set("userName", user.name);
          map.set("totalScore", user.total_score);
          user.scores.map((score: any, idx: number) => {
            map.set(
              `problemNo${idx}`,
              <button
                className={styles["white-button"]}
                onClick={() => {
                  setProblemID(response.data.metadata[idx].id);
                  setStudentID(user.id);
                  setStudentName(user.name);
                  setIsSubmissionRecordModalOpen(true);
                }}
              >
                {score}
              </button>
            );
          });
          return map;
        })
      );
      setIsLoading(false);
    }
    getPracticeScore();
  }, [params.practiceId]);

  return isLoading ? (
    <h2>Loading...</h2>
  ) : (
    <>
      <TableBase
        gridTemplateColumns={`150px 150px ${"200px ".repeat(
          dataHeaders.length
        )} `}
        dataHeaders={dataHeaders as ReactNode[]}
        dataRows={data}
      />
      {isSubmissionRecordModalOpen ? (
        <SubmissionRecordModal
          isOpen={isSubmissionRecordModalOpen}
          onClose={() => setIsSubmissionRecordModalOpen(false)}
          problemId={problemID}
          studentId={studentID}
          studentName={studentName}
        />
      ) : null}
    </>
  );
};

export default PracticeScoreBoard;

export const meta: MetaFunction = () => {
  return [
    {
      title: "실습별 성적보기 | KOJ",
    },
    {
      property: "description",
      content: "실습별 성적을 확인하는 화면입니다",
    },
    {
      property: "og:site_name",
      content: "KOJ - 실습별 성적보기",
    },
  ];
};
