import Modal from "~/components/Modal";
import styles from "./modal.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ProblemAddModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal
      title="문제 수정 - 문제 해결"
      subtitle="문제를 수정합니다"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className={styles["modal-body"]}></div>
    </Modal>
  );
};

export default ProblemAddModal;
