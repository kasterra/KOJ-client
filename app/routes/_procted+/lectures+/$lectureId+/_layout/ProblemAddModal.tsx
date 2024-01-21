import Modal from "~/components/Modal";
import styles from "./modal.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ProblemAddModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal
      title="문제 추가 - 문제 해결"
      subtitle="기초프로그래밍 실습3에 문제를 추가합니다"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className={styles["modal-body"]}></div>
    </Modal>
  );
};

export default ProblemAddModal;
