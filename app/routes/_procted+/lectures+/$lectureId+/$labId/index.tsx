import { useNavigate, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProblemWithProblemId } from "~/API/lecture";
import { useAuth } from "~/contexts/AuthContext";
import {
  SimpleProblemDetail,
  SuccessProblemDetailResponse,
  isSuccessResponse,
} from "~/types/APIResponse";
import { STATIC_SERVER_URL } from "~/util/constant";
import styles from "./index.module.css";
import SubmitModal from "./SubmitModal";

const LabDetail = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { labId } = useParams();

  const [problemDetail, setProblemDetail] = useState<SimpleProblemDetail>();
  const [loading, setLoading] = useState(true);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  useEffect(() => {
    async function getData() {
      const response = await getProblemWithProblemId(
        parseInt(labId!),
        auth.token
      );
      if (isSuccessResponse(response)) {
        setProblemDetail((response as SuccessProblemDetailResponse).data);
        setLoading(false);
      } else {
        toast.error("잘못된 접근입니다");
        navigate("/");
      }
    }
    getData();
  }, []);
  return loading ? null : (
    <div>
      <div className={styles["problem-meta"]}>
        <div className={styles["table-row"]}>
          <div className={styles["table-title"]}>마감 시간</div>
          <div>01/01 08:00</div>
          <div className={styles["table-title"]}>남은 시간</div>
          <div>1일 8시간 30분</div>
        </div>
        <div className={styles["top-right"]}>
          <div className={styles["table-col"]}>
            <div className={styles["table-title"]}>문제 점수</div>
            <div>0/0</div>
          </div>
          <div className={styles["submit-buttons"]}>
            <button
              className={styles["submit-button"]}
              onClick={() => {
                navigate(`/students/${labId}/history`);
              }}
            >
              채점 기록
            </button>
            <button
              className={styles["submit-button"]}
              onClick={() => setIsSubmitModalOpen(true)}
            >
              정답 제출
            </button>
          </div>
        </div>
      </div>
      <div className={styles["pdf-top"]}>
        <h1 className={styles["problem-title"]}>{problemDetail!.title}</h1>
        <div className={styles["problem-edit"]}>
          <button className={styles["delete-button"]}>문제 삭제하기</button>
          <button className={styles["edit-button"]}>문제 수정하기</button>
        </div>
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
