import Modal from "~/components/Modal";
import styles from "./modal.module.css";
import formStyles from "~/components/common/form.module.css";
import { useEffect, useState } from "react";
import { getTestcaseById, updateTestcase } from "~/API/testCase";
import { useAuth } from "~/contexts/AuthContext";
import {
  SuccessTestcaseResponse,
  TestcaseType,
  isSuccessResponse,
} from "~/types/APIResponse";
import MultipleFileInput from "~/components/Input/MultipleFileInput";
import TextInput from "~/components/Input/TextInput";
import RadioGroup from "~/components/Radio/RadioGroup";
import TextArea from "~/components/Input/TextArea";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  testCaseId: number;
}

const TestCaseEditModal = ({ isOpen, onClose, testCaseId }: Props) => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [testCaseData, setTestCaseData] = useState<TestcaseType>(
    {} as TestcaseType
  );

  useEffect(() => {
    async function getTestCaseFromServer() {
      const response = await getTestcaseById(testCaseId, auth.token);
      if (isSuccessResponse(response)) {
        setTestCaseData((response as SuccessTestcaseResponse).data);
        setIsLoading(false);
      } else {
        onClose();
      }
    }

    getTestCaseFromServer();
    setIsLoading(false);
  }, []);
  return (
    <Modal
      title="테스트 케이스 수정"
      subtitle="문제에 등록된 테스트 케이스를 수정합니다"
      isOpen={isOpen}
      onClose={onClose}
    >
      {isLoading ? (
        <h3>Loading...</h3>
      ) : (
        <form
          className={styles["modal-body"]}
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const response = await updateTestcase(
              testCaseId,
              formData,
              auth.token
            );
          }}
        >
          <TextInput
            title="테스트케이스명"
            name="title"
            placeholder="TC 이름 입력"
            defaultValue={testCaseData.title}
          />
          <RadioGroup
            title="공개 여부"
            name="is_visible"
            valueList={["true", "false"]}
            textList={["공개", "비공개"]}
            defaultValue={JSON.stringify(testCaseData.is_visible)}
          />
          <TextInput
            title="점수"
            name="score"
            placeholder="0 ~ 100"
            defaultValue={testCaseData.score + ""}
          />
          <TextInput
            title="실행 인자"
            name="argv"
            placeholder="args에 들어갈 값들"
            defaultValue={testCaseData.argv}
          />
          <TextArea
            title="표준 입력"
            name="stdin"
            placeholder="키보드 stdin 입력"
            height={200}
            defaultValue={testCaseData.stdin}
          />
          <TextArea
            title="표준 출력"
            name="stdout"
            placeholder="콘솔 stdout 출력"
            height={200}
            defaultValue={testCaseData.stdout}
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
      )}
    </Modal>
  );
};

export default TestCaseEditModal;
