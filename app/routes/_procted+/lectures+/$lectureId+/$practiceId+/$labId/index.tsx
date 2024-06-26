import { Link, useNavigate, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProblemWithProblemId } from "~/API/lecture";
import { useAuth } from "~/contexts/AuthContext";
import { SimpleProblemDetail } from "~/types/APIResponse";
import { STATIC_SERVER_URL } from "~/util/constant";
import styles from "./index.module.css";
import SubmitModal from "./SubmitModal";
import { getPracticeWithPracticeId } from "~/API/practice";
import { remainingTimeToString } from "~/util";

const LabDetail = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { labId, practiceId, lectureId } = useParams();

  const [problemDetail, setProblemDetail] = useState<SimpleProblemDetail>();
  const [practiceDetail, setPracticeDetail] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        const response = await getProblemWithProblemId(
          parseInt(labId!),
          auth.token
        );
        const response2 = await getPracticeWithPracticeId(
          practiceId!,
          auth.token
        );
        setProblemDetail(response.data);
        setPracticeDetail(response2.data);
        setLoading(false);
      } catch (error: any) {
        toast.error(`Error: ${error.message} - ${error.responseMessage}`);
        navigate("/");
      }
    }
    getData();
  }, [practiceId, labId]);

  return loading ? null : (
    <div className={styles.wrapper}>
      <div className={styles["problem-meta"]}>
        <div className={styles["table-row"]}>
          <div className={styles["table-title"]}>마감 시간</div>
          <div>{new Date(practiceDetail!.end_time).toLocaleString()}</div>
          <div className={styles["table-title"]}>남은 시간</div>
          <div>
            {remainingTimeToString(
              new Date(practiceDetail!.end_time).getTime() / 1000 -
                new Date().getTime() / 1000
            )}
          </div>
        </div>
        <div className={styles["top-right"]}>
          <div className={styles["table-col"]}>
            <div className={styles["table-title"]}>문제 점수</div>
            <div>
              {problemDetail!.gain_score}/{problemDetail!.total_score}
            </div>
          </div>
          <div className={styles["submit-buttons"]}>
            <Link
              to={`/students/${lectureId}/${practiceId}/history?problemId=${
                problemDetail!.id
              }`}
              style={{ textDecoration: "none" }}
            >
              <button
                style={{ textDecoration: "none" }}
                className={styles["submit-button"]}
              >
                채점 기록
              </button>
            </Link>
            {auth.role === "professor" ||
            new Date(practiceDetail!.end_time) > new Date() ? (
              <button
                className={styles["submit-button"]}
                onClick={() => setIsSubmitModalOpen(true)}
              >
                정답 제출
              </button>
            ) : (
              <div className={styles["submit-button"]}>제출 기한 경과!</div>
            )}
          </div>
        </div>
      </div>
      <div className={styles["pdf-top"]}>
        <h1 className={styles["problem-title"]}>{problemDetail!.title}</h1>
      </div>
      <object
        data={`${STATIC_SERVER_URL}/${problemDetail!.file_path}`}
        className={styles.pdf}
      ></object>
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
};

export default LabDetail;
