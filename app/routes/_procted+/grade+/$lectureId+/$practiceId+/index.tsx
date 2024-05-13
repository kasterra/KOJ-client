import { useParams } from "@remix-run/react";
import { ReactNode, useEffect, useState } from "react";
import { getPracticeWithPracticeId } from "~/API/practice";
import { getPracticeScoreBoard, reJudge } from "~/API/submission";
import { useAuth } from "~/contexts/AuthContext";
import styles from "../index.module.css";
import TableBase from "~/components/Table/TableBase";
import toast from "react-hot-toast";

const PracticeScoreBoard = () => {
  const params = useParams();
  const auth = useAuth();
  const [practiceName, setPracticeName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const [dataHeaders, setDataHeaders] = useState<ReactNode[]>(["이름", "총점"]);

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
  }, []);

  useEffect(() => {
    async function getPracticeScore() {
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
        response.data.users.map((user: any) => {
          const map = new Map<string, ReactNode>();
          map.set("userName", user.name);
          map.set("totalScore", user.total_score);
          user.scores.map((score: any, idx: number) => {
            map.set(
              `problemNo${idx}`,
              <button
                className={styles["white-button"]}
                onClick={async () => {
                  if (
                    confirm(
                      `해당 실습에 대해서 ${user.name} 학생을 재채점 하시겠습니까?`
                    )
                  ) {
                    const response = await reJudge(auth.token, {
                      practice_id: parseInt(params.practiceId!),
                      problem_id: score.id as number,
                      user_id: user.id,
                    });
                    if (response.status === 200) {
                      toast.success("재채점 완료!");
                      setIsLoading(true);
                    }
                  }
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
  }, []);

  return isLoading ? (
    <h2>Loading...</h2>
  ) : (
    <TableBase
      gridTemplateColumns={`150px 150px ${"200px ".repeat(
        dataHeaders.length
      )} `}
      dataHeaders={dataHeaders as ReactNode[]}
      dataRows={data}
    />
  );
};

export default PracticeScoreBoard;
