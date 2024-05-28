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
import { useState } from "react";
import plusW from "~/assets/plus-square.svg";
import minusW from "~/assets/minus-square.svg";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  problemId: number;
}

const TestCaseAddModal = ({ isOpen, onClose, problemId }: Props) => {
  const auth = useAuth();
  const [argvList, setArgvList] = useState<string[]>([]);
  const [inputFiles, setInputFiles] = useState<FileList | null>(null);
  const [outputFiles, setOutputFiles] = useState<FileList | null>(null);
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

          inputFiles &&
            [...inputFiles].forEach((file) =>
              formData.append("file_inputs", file)
            );
          outputFiles &&
            [...outputFiles].forEach((file) =>
              formData.append("file_outputs", file)
            );

          argvList.forEach((argv) => formData.append("argv", argv));

          await toast.promise(
            postNewTestcase(problemId, formData, auth.token),
            {
              loading: "TC를 추가시도...",
              success: "성공적으로 TC를 추가하였습니다",
              error: (error) =>
                `Error: ${error.message} - ${error.responseMessage}`,
            }
          );
          onClose();
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
        />
        <TextArea
          title="표준 출력"
          name="stdout"
          placeholder="콘솔 stdout 출력"
          height={200}
        />
        <MultipleFileInput
          title="파일 입력"
          name="f_i"
          placeholder="텍스트, 이진 파일 업로드"
          onFileUpload={async (files) => {
            setInputFiles(files);
          }}
        />
        <MultipleFileInput
          title="파일 출력"
          name="f_o"
          onFileUpload={async (files) => {
            setOutputFiles(files);
          }}
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
