import { useEffect, useState } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { getSubmissionStatus, reJudge } from "~/API/submission";
import Modal from "~/components/Modal";
import judgeCSS from "~/css/judge.module.css";
import styles from "./index.module.css";
import { useParams } from "@remix-run/react";
import toast from "react-hot-toast";
import SubmissionDetailModal from "~/routes/_procted+/students+/$lectureId+/$labId+/history+/SubmissionDetailModal";

interface Props {
  studentId: string;
  studentName: string;
  problemId: number;
  isOpen: boolean;
  onClose: () => void;
}

const SubmissionRecordModal = ({
  studentId,
  studentName,
  problemId,
  isOpen,
  onClose,
}: Props) => {
  const auth = useAuth();
  const params = useParams();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionID, setSubmissionID] = useState(0);
  const [isSubmmsionDetailModalOpen, setIsSubmmsionDetailModalOpen] =
    useState(false);
  useEffect(() => {
    async function getHistory() {
      const response = await getSubmissionStatus(auth.token, {
        user_id: studentId,
        lecture_id: params.lectureId!,
        practice_id: params.practiceId!,
        problem_id: problemId,
      });
      if (response.status === 200) {
        setHistory((response as any).data);
        setIsLoading(false);
      } else {
        toast.error(
          "올바르게 데이터를 가져오지 못했습니다. 다시 시도해 주세요"
        );
      }
    }
    getHistory();
  }, []);
  return (
    <Modal
      title="제출 이력 조회"
      subtitle={`${studentName} 학생의 제출이력`}
      isOpen={isOpen}
      onClose={onClose}
    >
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <div className={styles["modal-body"]}>
          {history.length ? (
            <button
              className={styles["white-button"]}
              onClick={async () => {
                toast.promise(
                  reJudge(auth.token, {
                    user_id: studentId,
                    practice_id: parseInt(params.practiceId!),
                    problem_id: problemId,
                  }),
                  {
                    loading: "재채점이 진행 중입니다",
                    success: "성공적으로 재채점 되었습니다!!",
                    error: (e) => e,
                  }
                );
              }}
            >
              재채점
            </button>
          ) : (
            <span>채점 이력이 없습니다</span>
          )}
          {history.map((data: any) => (
            <div className={styles["data-row"]}>
              <span>{data.id}</span>
              {(function () {
                switch (data.status) {
                  case "accepted":
                    return <span className={judgeCSS.correct}>맞았습니다</span>;
                  case "time_limit":
                    return <span className={judgeCSS.wrong}>시간 초과</span>;
                  case "memory_limit":
                    return <span className={judgeCSS.wrong}>메모리 초과</span>;
                  case "wrong_answer":
                    return <span className={judgeCSS.wrong}>틀렸습니다</span>;
                  case "runtime_error":
                    return <span className={judgeCSS.error}>런타임 에러</span>;
                  case "compile_error":
                    return <span className={judgeCSS.error}>컴파일 에러</span>;
                  case "pending":
                    return (
                      <span className={judgeCSS.waiting}>기다리는 중</span>
                    );
                  case "running":
                    return (
                      <span
                        className={judgeCSS.inprogress}
                      >{`실행중 ${data.progress}%`}</span>
                    );
                  case "internal_error":
                    return (
                      <span className={judgeCSS.error}>서버 내부 에러</span>
                    );
                  default:
                    return (
                      <span className={judgeCSS.error}>{data.status}</span>
                    );
                }
              })()}
              <span>{new Date(data.created_at).toLocaleString()}</span>
              <div className={styles["buttons-container"]}>
                <button
                  className={styles["white-button"]}
                  onClick={() => {
                    setSubmissionID(data.id);
                    setIsSubmmsionDetailModalOpen(true);
                  }}
                >
                  제출 결과 보기
                </button>
              </div>
            </div>
          ))}
          {isSubmmsionDetailModalOpen ? (
            <SubmissionDetailModal
              isOpen={isSubmmsionDetailModalOpen}
              onClose={() => setIsSubmmsionDetailModalOpen(false)}
              submissionId={submissionID}
            />
          ) : null}
        </div>
      )}
    </Modal>
  );
};

export default SubmissionRecordModal;
