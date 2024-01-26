import Modal from "~/components/Modal";
import styles from "./modal.module.css";
import formStyles from "~/components/common/form.module.css";
import DateInput from "~/components/Input/DateInput";
import TextInput from "~/components/Input/TextInput";
import toast from "react-hot-toast";
import { updatePractice } from "~/API/practice";
import { useAuth } from "~/contexts/AuthContext";
import { useEffect, useState } from "react";
import { getPracticeWithPracticeId } from "~/API/practice";
import {
  SimplePracticeDetail,
  SuccessPracticeDetailResponse,
  isSuccessResponse,
} from "~/types/APIResponse";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  practiceId: number;
}

const PracticeEditModal = ({ isOpen, onClose, practiceId }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [practiceData, setPracticeData] = useState<SimplePracticeDetail>();
  const auth = useAuth();

  useEffect(() => {
    async function getPracticeFromServer() {
      const response = await getPracticeWithPracticeId(practiceId, auth.token);
      if (isSuccessResponse(response))
        setPracticeData((response as SuccessPracticeDetailResponse).data);
      else {
        onClose();
      }
      setIsLoading(false);
    }
    getPracticeFromServer();
  }, []);

  return (
    <Modal
      title="실습 수정"
      subtitle="수업에 배정되어 있는 실습을 수정합니다"
      isOpen={isOpen}
      onClose={onClose}
    >
      {isLoading ? (
        <h3>정보 로딩중...</h3>
      ) : (
        <form
          className={styles["modal-body"]}
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const title = formData.get("title") as string;
            const startTime = formData.get("startTime") as string;
            const endTime = formData.get("endTime") as string;

            const start = new Date(startTime);
            const end = new Date(endTime);

            if (start > end) {
              toast.error("종료 시간은 시작 시간보다 이후여야 합니다");
              return;
            }

            const start_time = start.toISOString();
            const end_time = end.toISOString();

            const response = await updatePractice(
              practiceId,
              start_time,
              end_time,
              title,
              auth.token
            );

            if (response.status === 204) {
              toast.success("성공적으로 수정하였습니다");
              onClose();
            }
          }}
        >
          <TextInput
            name="title"
            title="실습명"
            placeholder="예 : 실습 1"
            defaultValue={practiceData!.title}
            required
          />
          <DateInput
            name="startTime"
            title="시작 시간"
            required
            defaultValue={practiceData!.start_time.slice(0, 16)}
          />
          <DateInput
            name="endTime"
            title="종료 시간"
            required
            defaultValue={practiceData!.end_time.slice(0, 16)}
          />
          <button className={formStyles["primary-button"]} type="submit">
            실습 생성
          </button>
        </form>
      )}
    </Modal>
  );
};

export default PracticeEditModal;
