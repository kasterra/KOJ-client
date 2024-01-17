import DropDown from "~/components/Input/Dropdown";
import Modal from "~/components/Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LectureAddModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal
      title="강의 추가"
      subtitle="KOJ에 강의 정보를 등록합니다"
      isOpen={isOpen}
      onClose={onClose}
    >
      <h4>퍼블리싱 중....</h4>
      <DropDown name="aaa" submenus={["2021", "2022", "2023"]} />
    </Modal>
  );
};

export default LectureAddModal;
