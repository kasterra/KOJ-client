import Modal from "~/components/Modal";
import styles from "./modal.module.css";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingProblemId: number;
}

const ProblemEditModal = ({ isOpen, onClose, editingProblemId }: Props) => {
  const [loading, setLoading] = useState(true);
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

export default ProblemEditModal;
