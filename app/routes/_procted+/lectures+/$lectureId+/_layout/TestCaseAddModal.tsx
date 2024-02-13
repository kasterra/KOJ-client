import Modal from "~/components/Modal";
import styles from "./modal.module.css";
import formStyles from "~/components/common/form.module.css";
import TextArea from "~/components/Input/TextArea";
import RadioGroup from "~/components/Radio/RadioGroup";
import MultipleFileInput from "~/components/Input/MultipleFileInput";
import TextInput from "~/components/Input/TextInput";
import { postNewTestcase } from "~/API/testCase";
import { useAuth } from "~/contexts/AuthContext";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  problemId: number;
}

const TestCaseAddModal = ({ isOpen, onClose, problemId }: Props) => {
  const auth = useAuth();
  return (
    <Modal
      title="테스트 케이스 추가"
      subtitle="문제에 테스트 케이스를 추가합니다"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        className={styles["modal-body"]}
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);

          const resposnse = await postNewTestcase(
            problemId,
            formData,
            auth.token
          );

          if (resposnse.status === 201) {
            toast.success("성공적으로 TC를 추가하였습니다");
            onClose();
          }
        }}
      >
        <TextInput
          title="테스트케이스명"
          name="title"
          placeholder="TC 이름 입력"
        />
        <RadioGroup
          title="공개 여부"
          name="is_visible"
          valueList={["true", "false"]}
          textList={["공개", "비공개"]}
        />
        <TextInput title="점수" name="score" placeholder="0 ~ 100" />
        <TextInput
          title="실행 인자"
          name="argv"
          placeholder="args에 들어갈 값들"
        />
        <TextArea
          title="표준 입력"
          name="stdin"
          placeholder="키보드 stdin 입력"
          height={200}
        />
        <TextArea
          title="표준 출력"
          name="stdout"
          placeholder="콘솔 stdout 출력"
          height={200}
        />
        <MultipleFileInput
          title="파일 입력"
          name="file_inputs"
          placeholder="텍스트, 이진 파일 업로드"
        />
        <MultipleFileInput
          title="파일 출력"
          name="file_outputs"
          placeholder="텍스트, 이진 파일 업로드"
        />
        <button type="submit" className={formStyles["primary-button"]}>
          TC 저장
        </button>
      </form>
    </Modal>
  );
};

export default TestCaseAddModal;
