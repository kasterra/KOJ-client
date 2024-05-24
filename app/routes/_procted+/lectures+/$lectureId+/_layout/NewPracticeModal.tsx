import Modal from "~/components/Modal";
import styles from "./modal.module.css";
import formStyles from "~/components/common/form.module.css";
import TextInput from "~/components/Input/TextInput";
import DateInput from "~/components/Input/DateInput";
import { useParams } from "@remix-run/react";
import toast from "react-hot-toast";
import { createNewPractice } from "~/API/practice";
import { useAuth } from "~/contexts/AuthContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NewPracticeModal = ({ isOpen, onClose }: Props) => {
  const params = useParams();
  const auth = useAuth();
  return (
    <Modal
      title="신규 실습 생성"
      subtitle="강좌에 새로 등록할 실습을 생성합니다"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        className={styles["modal-body"]}
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const lecture_id = parseInt(params.lectureId!, 10);
          const startTime = formData.get("startTime") as string;
          const endTime = formData.get("endTime") as string;
          const title = formData.get("title") as string;
          const start = new Date(startTime);
          const end = new Date(endTime);

          if (start > end) {
            toast.error("종료 시간은 시작 시간보다 이후여야 합니다");
            return;
          }

          const start_time = start.toISOString();
          const end_time = end.toISOString();

          await toast.promise(
            createNewPractice(
              lecture_id,
              start_time,
              end_time,
              title,
              auth.token
            ),
            {
              loading: "실습 생성중...",
              success: "성공적으로 실습을 생성하였습니다",
              error: (error) =>
                `Error: ${error.message} - ${error.responseMessage}`,
            }
          );
          onClose();
        }}
      >
        <TextInput
          name="title"
          title="실습명"
          placeholder="예 : 실습 1"
          required
        />
        <DateInput name="startTime" title="시작 시간" required />
        <DateInput name="endTime" title="종료 시간" required />
        <button className={formStyles["primary-button"]} type="submit">
          실습 생성
        </button>
      </form>
    </Modal>
  );
};

export default NewPracticeModal;
