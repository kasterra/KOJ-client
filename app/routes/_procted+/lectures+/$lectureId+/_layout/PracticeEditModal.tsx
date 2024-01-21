import Modal from "~/components/Modal";
import styles from "./modal.module.css";
import formStyles from "~/components/common/form.module.css";
import DateInput from "~/components/Input/DateInput";
import TextInput from "~/components/Input/TextInput";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  practiceId: number;
}

const PracticeEditModal = ({ isOpen, onClose, practiceId }: Props) => {
  return (
    <Modal
      title="실습 수정"
      subtitle="수업에 배정되어 있는 실습을 수정합니다"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form className={styles["modal-body"]}>
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

export default PracticeEditModal;
