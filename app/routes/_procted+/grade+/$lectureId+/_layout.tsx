import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Outlet, useParams } from "@remix-run/react";
import { getLectureWithLectureId } from "~/API/lecture";
import { useAuth } from "~/contexts/AuthContext";
import { ButtonElement } from "~/components/Aside/ButtonElement";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ScoreBoardLayout = () => {
  const params = useParams();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [practiceList, setPracticeList] = useState([]);
  useEffect(() => {
    async function getPractices() {
      try {
        const response = await getLectureWithLectureId(
          params.lectureId!,
          auth.token
        );
        setPracticeList((response as any).data.practices);
        setIsLoading(false);
      } catch (e: any) {
        toast.error(`Error: ${e.message} - ${e.responseMessage}`);
      }
    }
    getPractices();
  }, [params.lectureId]);
  return isLoading ? (
    <h1>Loading...</h1>
  ) : (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Link to={`/grade/${params.lectureId}`}>
          <ButtonElement title={"실습 전체 보기"} onButtonClick={() => {}} />
        </Link>
        {practiceList.map((practice: any, idx: number) => (
          <Link to={`/grade/${params.lectureId}/${practice.id}`}>
            <ButtonElement
              title={practice.title}
              key={practice.id}
              onButtonClick={() => {}}
            />
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
};

export default ScoreBoardLayout;
