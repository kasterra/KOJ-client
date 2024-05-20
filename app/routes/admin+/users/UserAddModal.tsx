import Modal from "~/components/Modal";
import styles from "./users.module.css";
import formStyles from "~/components/common/form.module.css";
import TextInput from "~/components/Input/TextInput";
import RadioGroup from "~/components/Radio/RadioGroup";
import { addUser } from "~/API/user";
import { useAuth } from "~/contexts/AuthContext";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
const UserAddModal = ({ isOpen, onClose }: Props) => {
  const auth = useAuth();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="사용자 추가"
      subtitle="KOJ에 추가할 사용자의 정보를 입력해 주세요"
    >
      <form
        className={styles["modal-body"]}
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const name = formData.get("name") as string;
          const id = formData.get("id") as string;
          const role = formData.get("role") as string;

          await toast.promise(addUser(id, false, name, role, auth.token), {
            loading: "추가 요청중...",
            success: "성공적으로 추가하였습니다",
            error: (e) => `Error: ${e.message} - ${e.responseMessage}`,
          });
          onClose();
        }}
      >
        <TextInput title="이름" name="name" placeholder="홍길동" required />
        <TextInput
          title="학번/교번"
          name="id"
          placeholder="ex) 2024123456"
          required
        />
        <RadioGroup
          title="사용자 권한"
          name="role"
          valueList={["student", "professor"]}
          textList={["학생(튜터 포함)", "교수"]}
        />
        <button type="submit" className={formStyles["primary-button"]}>
          사용자 추가
        </button>
      </form>
    </Modal>
  );
};

export default UserAddModal;
