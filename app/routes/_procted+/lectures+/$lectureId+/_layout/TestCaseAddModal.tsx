import Modal from "~/components/Modal";
import styles from "./modal.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TestCaseAddModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal
      title="테스트 케이스 추가"
      subtitle="문제에 테스트 케이스를 추가합니다"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className={styles["modal-body"]}></div>
    </Modal>
  );
};

export default TestCaseAddModal;
