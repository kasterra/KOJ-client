import Modal from "~/components/Modal";
import styles from "./modal.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  testCaseId: number;
}

const TestCaseEditModal = ({ isOpen, onClose, testCaseId }: Props) => {
  return (
    <Modal
      title="테스트 케이스 수정"
      subtitle="문제에 등록된 테스트 케이스를 수정합니다"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className={styles["modal-body"]}></div>
    </Modal>
  );
};

export default TestCaseEditModal;
