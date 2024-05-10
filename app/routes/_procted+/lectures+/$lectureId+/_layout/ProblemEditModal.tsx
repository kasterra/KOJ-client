import Modal from "~/components/Modal";
import styles from "./modal.module.css";
import formStyles from "~/components/common/form.module.css";
import { useEffect, useState } from "react";
import { getProblemWithProblemId } from "~/API/lecture";
import { useAuth } from "~/contexts/AuthContext";
import {
  SimpleProblemDetail,
  SuccessProblemDetailResponse,
  SuccessUploadFileResponse,
  isSuccessResponse,
} from "~/types/APIResponse";
import toast from "react-hot-toast";
import { updateProblem } from "~/API/problem";
import {
  codeHole,
  parsedCodeElement,
  parsedCodesToString,
} from "~/util/codeHole";
import TextInput from "~/components/Input/TextInput";
import RadioGroup from "~/components/Radio/RadioGroup";
import CodeBlock from "~/components/CodeBlock";
import BlankPreviewModal from "./BlankPreviewModal";
import SingleFileInput from "~/components/Input/SingleFileInput";
import { uploadFile } from "~/API/media";
import { lanugage } from "~/types";
import { STATIC_SERVER_URL } from "~/util/constant";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingProblemId: number;
}

const ProblemEditModal = ({ isOpen, onClose, editingProblemId }: Props) => {
  const [loading, setLoading] = useState(true);
  const [problemType, setProblemType] = useState<"blank" | "solving">(
    "solving"
  );
  const [prevProblemInfo, setPrevProblemInfo] = useState<SimpleProblemDetail>();
  const [language, setLanguage] = useState<lanugage>("c");
  const [codeString, setCodeString] = useState("");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [dragFile, setDragFile] = useState<File | null>(null);
  const auth = useAuth();
  useEffect(() => {
    async function getData() {
      const response = await getProblemWithProblemId(
        editingProblemId,
        auth.token
      );
      if (isSuccessResponse(response)) {
        const problemInfo = (response as SuccessProblemDetailResponse).data;
        setPrevProblemInfo(problemInfo);
        setProblemType(problemInfo.type);
        if (problemInfo.parsed_code_elements) {
          setLanguage(problemInfo.parsed_code_elements.language);
          setCodeString(
            parsedCodesToString(problemInfo.parsed_code_elements.data)
          );
        }
        setLoading(false);
      } else {
        toast.error("잘못된 접근입니다");
        onClose();
      }
    }
    getData();
  }, []);
  return (
    <Modal
      title="문제 수정"
      subtitle="문제를 수정합니다"
      isOpen={isOpen}
      onClose={onClose}
    >
      {loading ? (
        <h3>기존 문제 정보 불러오는중...</h3>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const name = formData.get("name") as string;
            const time = parseInt(formData.get("time") as string, 10);
            const memory = parseInt(formData.get("memory") as string, 10);
            const file = dragFile ? dragFile : (formData.get("pdf") as File);

            let newFilePath = "";

            if (file.size !== 0) {
              const fileUploadResponse = await uploadFile(file, auth.token);
              if (isSuccessResponse(fileUploadResponse)) {
                newFilePath = (fileUploadResponse as SuccessUploadFileResponse)
                  .data.path;
              } else onClose();
            }

            switch (problemType) {
              case "blank":
                let holes: parsedCodeElement[][] = [];
                try {
                  holes = codeHole(codeString, language);
                } catch {
                  toast.error("블록 주석에 오류가 있습니다!");
                  return;
                }
                const blankResponse = await updateProblem(
                  problemType,
                  editingProblemId,
                  memory,
                  time,
                  name,
                  auth.token,
                  newFilePath.length ? newFilePath : prevProblemInfo!.file_path,
                  holes
                );
                if (blankResponse.status === 204) {
                  toast.success("문제를 성공적으로 수정했습니다!");
                  onClose();
                }
                break;
              case "solving":
                const solvingResponse = await updateProblem(
                  problemType,
                  editingProblemId,
                  memory,
                  time,
                  name,
                  auth.token,
                  newFilePath.length ? newFilePath : prevProblemInfo!.file_path
                );
                if (solvingResponse.status === 204) {
                  toast.success("문제를 성공적으로 수정했습니다!");
                  onClose();
                }
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
                defaultValue={prevProblemInfo!.title}
                required
              />
              <RadioGroup
                title="문제 유형"
                name="problemType"
                valueList={["solving", "blank"]}
                textList={["문제 해결", "빈칸 채우기"]}
                onChange={setProblemType as (value: string) => void}
                defaultValue={prevProblemInfo!.type}
              />
              <TextInput
                title="메모리 제한(MB)"
                name="memory"
                placeholder="0~4096 사이의 값"
                defaultValue={prevProblemInfo!.memory_limit + ""}
                required
              />
              <TextInput
                title="실행 시간(ms)"
                name="time"
                placeholder="0~10,000 사이의 값"
                defaultValue={prevProblemInfo!.time_limit + ""}
                required
              />
              <a href={`${STATIC_SERVER_URL}/${prevProblemInfo!.file_path}`}>
                <h4>기존 파일 열기</h4>
              </a>
              <SingleFileInput
                title="문제 pdf 파일"
                name="pdf"
                placeholder="주의! 파일을 업로드 하면, 기존 파일은 삭제됩니다!"
                fileValidator={(file) => {
                  return file && file.name.endsWith(".pdf");
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
                    defaultValue={language}
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
      )}
    </Modal>
  );
};

export default ProblemEditModal;
