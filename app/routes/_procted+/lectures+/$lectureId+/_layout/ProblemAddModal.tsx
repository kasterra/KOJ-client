import { useState } from "react";
import Modal from "~/components/Modal";
import styles from "./modal.module.css";
import formStyles from "~/components/common/form.module.css";
import RadioGroup from "~/components/Radio/RadioGroup";
import TextInput from "~/components/Input/TextInput";
import SingleFileInput from "~/components/Input/SingleFileInput";
import CodeBlock from "~/components/CodeBlock";
import { codeHole, parsedCodeElement } from "~/util/codeHole";
import toast from "react-hot-toast";
import { postBlankProblem, postSolveProblem } from "~/API/problem";
import { useAuth } from "~/contexts/AuthContext";
import BlankPreviewModal from "./BlankPreviewModal";
import { lanugage } from "~/types";

interface Props {
  lectureName: string;
  practiceName: string;
  practiceId: number;
  isOpen: boolean;
  onClose: () => void;
}

const ProblemAddModal = ({
  lectureName,
  practiceName,
  practiceId,
  isOpen,
  onClose,
}: Props) => {
  const [problemType, setProblemType] = useState<"blank" | "solving">(
    "solving"
  );
  const [language, setLanguage] = useState<lanugage>("c");
  const [codeString, setCodeString] = useState("");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const auth = useAuth();
  const [dragFile, setDragFile] = useState<File | null>(null);
  return (
    <Modal
      title={`문제 추가 - ${
        problemType === "blank" ? "빈칸 채우기" : "문제 해결"
      }`}
      subtitle={`${lectureName} ${practiceName}에 문제를 추가합니다`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const name = formData.get("name") as string;
          const time = parseInt(formData.get("time") as string, 10);
          const memory = parseInt(formData.get("memory") as string, 10);
          const file = dragFile ? dragFile : (formData.get("pdf") as File);

          switch (problemType) {
            case "blank":
              let holes: parsedCodeElement[][] = [];
              try {
                holes = codeHole(codeString, language);
              } catch {
                toast.error("블록 주석에 오류가 있습니다!");
                return;
              }
              await toast.promise(
                postBlankProblem(
                  file,
                  memory,
                  holes,
                  language,
                  practiceId,
                  time,
                  name,
                  auth.token
                ),
                {
                  loading: "문제를 추가하는중...",
                  success: () => {
                    onClose();
                    return "문제를 성공적으로 추가했습니다!";
                  },
                  error: (err) =>
                    `Error: ${err.message} - ${err.responseMessage}`,
                }
              );
              break;
            case "solving":
              await toast.promise(
                postSolveProblem(
                  file,
                  memory,
                  practiceId,
                  time,
                  name,
                  auth.token
                ),
                {
                  loading: "문제를 추가하는중...",
                  success: () => {
                    onClose();
                    return "문제를 성공적으로 추가했습니다!";
                  },
                  error: (err) =>
                    `Error: ${err.message} - ${err.responseMessage}`,
                }
              );
              break;
          }
        }}
      >
        <div className={styles["modal-section"]}>
          <div className={styles["modal-body"]}>
            <TextInput
              title="문제 이름"
              name="name"
              placeholder="문제 이름 입력"
              required
            />
            <RadioGroup
              title="문제 유형"
              name="problemType"
              valueList={["solving", "blank"]}
              textList={["문제 해결", "빈칸 채우기"]}
              onChange={setProblemType as (value: string) => void}
            />
            <TextInput
              title="메모리 제한(MB)"
              name="memory"
              placeholder="0~4096 사이의 값"
              required
            />
            <TextInput
              title="실행 시간(ms)"
              name="time"
              placeholder="0~10,000 사이의 값"
              required
            />
            <SingleFileInput
              title="문제 pdf 파일"
              name="pdf"
              fileValidator={(file) => {
                return file.name.endsWith(".pdf");
              }}
              onFileUpload={(file) => {
                setDragFile(file);
              }}
              accept="application/pdf"
            />
            <button type="submit" className={formStyles["primary-button"]}>
              문제 저장
            </button>
          </div>
          <div className={styles["modal-body"]}>
            {problemType === "blank" ? (
              <div className={styles["blank-section"]}>
                <label htmlFor="language">빈칸 언어</label>
                <select
                  name="language"
                  id="language"
                  onChange={(e) => setLanguage(e.target.value as lanugage)}
                >
                  <option value="c">C</option>
                  <option value="java">Java</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="plaintext">Text</option>
                </select>
                <CodeBlock
                  height={500}
                  language={language}
                  value={codeString}
                  onChange={setCodeString}
                />
                <div
                  className={formStyles["secondary-button"]}
                  onClick={() => setIsPreviewModalOpen(true)}
                >
                  빈칸 미리보기
                </div>
                {isPreviewModalOpen && (
                  <BlankPreviewModal
                    isOpen={isPreviewModalOpen}
                    onClose={() => setIsPreviewModalOpen(false)}
                    codeString={codeString}
                    language={language}
                  />
                )}
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProblemAddModal;
