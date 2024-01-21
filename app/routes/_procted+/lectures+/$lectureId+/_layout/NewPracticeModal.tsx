import Modal from "~/components/Modal";
import styles from "./modal.module.css";
import formStyles from "~/components/common/form.module.css";
import TextInput from "~/components/Input/TextInput";
import DateInput from "~/components/Input/DateInput";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NewPracticeModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal
      title="신규 실습 생성"
      subtitle="강좌에 새로 등록할 실습을 생성합니다"
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

export default NewPracticeModal;
