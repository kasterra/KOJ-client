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
import toast from "react-hot-toast";
import plusW from "~/assets/plus-w.svg";
import minusW from "~/assets/minus-w.svg";

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
  const [argvList, setArgvList] = useState<string[]>([]);

  useEffect(() => {
    async function getTestCaseFromServer() {
      const response = await getTestcaseById(testCaseId, auth.token);
      if (isSuccessResponse(response)) {
        setTestCaseData((response as SuccessTestcaseResponse).data);
        setArgvList((response as SuccessTestcaseResponse).data.argv || []);
        setIsLoading(false);
      } else {
        onClose();
      }
    }

    getTestCaseFromServer();
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

            argvList.forEach((argv) => formData.append("argv", argv));

            const response = await updateTestcase(
              testCaseId,
              formData,
              auth.token
            );

            if (response.status === 200) {
              toast.success("성공적으로 TC를 수정하였습니다");
              onClose();
            }
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
          <div className={styles["input-row"]}>
            <TextInput
              title="실행 인자 1"
              name=""
              placeholder="1번째 매개변수"
              value={argvList[0]}
              onChange={(e) =>
                setArgvList((prev) => [e.target.value, ...prev.slice(1)])
              }
            />
            <div
              className={styles["circular-button"]}
              onClick={() =>
                setArgvList((prev) => [prev[0], "", ...prev.slice(1)])
              }
            >
              <img src={plusW} alt="plus icon" />
            </div>
          </div>
          {argvList.slice(1).map((arg, idx) => (
            <div className={styles["input-row"]}>
              <TextInput
                title={`실행 인자 ${idx + 2}`}
                name=""
                placeholder={`${idx + 2}번째 매개변수`}
                value={arg}
                onChange={(e) => {
                  setArgvList((prev) => {
                    let ret = [...prev];
                    ret[idx + 1] = e.target.value;
                    return ret;
                  });
                }}
              />
              <div
                className={styles["circular-button"]}
                onClick={() =>
                  setArgvList((prev) => [
                    ...prev.slice(0, idx + 2),
                    "",
                    ...prev.slice(idx + 2),
                  ])
                }
              >
                <img src={plusW} alt="plus icon" />
              </div>
              <div
                className={styles["circular-button"]}
                onClick={() =>
                  setArgvList((prev) => {
                    return [...prev.slice(0, idx + 1), ...prev.slice(idx + 2)];
                  })
                }
              >
                <img src={minusW} alt="minus icon" />
              </div>
            </div>
          ))}
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
