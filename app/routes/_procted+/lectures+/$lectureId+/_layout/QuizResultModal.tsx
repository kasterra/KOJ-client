import Modal from "~/components/Modal";
import styles from "./modal.module.css";
import formStyles from "~/components/common/form.module.css";
import TextInput from "~/components/Input/TextInput";
import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { getQuizWithUserId } from "~/API/practice";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const QuizResultModal = ({ isOpen, onClose }: Props) => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const [quizResult, setQuizResult] = useState<
    {
      gain_score: number | null;
      id: number;
      max_score: number;
      title: string;
    }[]
  >([]);
  useEffect(() => {
    async function getData() {
      const { data } = await getQuizWithUserId(
        params.lectureId!,
        auth.userId,
        auth.token
      );
      setQuizResult(data);
      setIsLoading(false);
    }
    getData();
  }, []);
  return isLoading ? null : (
    <Modal
      title="퀴즈 결과 조회"
      subtitle="사용자의 퀴즈 결과를 확인합니다"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form className={styles["modal-body"]}>
        {quizResult.map((result, idx) => (
          <TextInput
            title={`Q${idx + 1}`}
            name=""
            value={`${
              result.gain_score == null ? "점수없음" : result.gain_score
            }/${result.max_score}`}
          />
        ))}
      </form>
    </Modal>
  );
};

export default QuizResultModal;
