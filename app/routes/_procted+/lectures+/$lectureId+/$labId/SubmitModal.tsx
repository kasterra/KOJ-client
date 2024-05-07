import { useState } from "react";
import Modal from "~/components/Modal";
import styles from "./index.module.css";
import formStyles from "~/components/common/form.module.css";
import inputStyle from "~/components/Input/input.module.css";
import RadioGroup from "~/components/Radio/RadioGroup";
import CodeBlock from "~/components/CodeBlock";
import MultipleFileInput from "~/components/Input/MultipleFileInput";
import { lanugage } from "~/types";
import { submit } from "~/API/submission";
import { useAuth } from "~/contexts/AuthContext";
import { useNavigate, useParams } from "@remix-run/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SubmitModal = ({ isOpen, onClose }: Props) => {
  const auth = useAuth();
  const { labId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [fileList, setFileList] = useState<FileList | null>(null);
  const [language, setLanguage] = useState<lanugage>("c");
  return (
    <Modal
      title="정답 제출"
      subtitle="파일 업로드, 코드 직접 제출 모두 가능합니다"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        className={styles["modal-body"]}
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          formData.append("language", language);
          if (fileList) {
            [...fileList].forEach((file) => formData.append("codes", file));
          }
          await submit(auth.token, labId!, formData);
          navigate(`/students/${labId}/history`);
        }}
      >
        <RadioGroup
          title="프로그래밍 언어"
          name="language"
          valueList={["c", "java", "python", "plaintext"]}
          textList={["C", "Java", "Python", "Text"]}
          onChange={setLanguage as (value: string) => void}
        />

        <div className={styles.flex}>
          <MultipleFileInput
            title="파일로 제출"
            name="files"
            onFileUpload={async (files) => {
              setFileList(files);
            }}
          />
          <div>
            <span className={inputStyle.title}>코드로 작성하여 제출</span>
            <CodeBlock
              height={500}
              language={language}
              value={code}
              onChange={setCode}
            />
          </div>
        </div>

        <button className={formStyles["primary-button"]} type="submit">
          제출
        </button>
      </form>
    </Modal>
  );
};

export default SubmitModal;
