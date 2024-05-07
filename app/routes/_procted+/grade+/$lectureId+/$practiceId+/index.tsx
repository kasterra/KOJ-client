import { useParams } from "@remix-run/react";
import { ReactNode, useEffect, useState } from "react";
import { getPracticeWithPracticeId } from "~/API/practice";
import { getPracticeScoreBoard } from "~/API/submission";
import { useAuth } from "~/contexts/AuthContext";
import styles from "../index.module.css";
import TableBase from "~/components/Table/TableBase";

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
              onClick={() => alert("재채점 API호출 예정")}
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
                onClick={() => alert("문제 재채점 API호출 예정")}
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
