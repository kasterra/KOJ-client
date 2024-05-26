import Modal from "~/components/Modal";
import styles from "./modal.module.css";
import formStyles from "~/components/common/form.module.css";
import judgeStyles from "~/css/judge.module.css";
import { useEffect, useState } from "react";
import { getProblemWithProblemId } from "~/API/lecture";
import { useAuth } from "~/contexts/AuthContext";
import { SimpleProblemDetail } from "~/types/APIResponse";
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
import { language } from "~/types";
import { STATIC_SERVER_URL } from "~/util/constant";
import { getCodeFileExtension, readFileAsServerFormat } from "~/util";
import download from "~/assets/download.svg";
import pkg from "file-saver";
const { saveAs } = pkg;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingProblemId: number;
}

const ProblemEditModal = ({ isOpen, onClose, editingProblemId }: Props) => {
  const [loading, setLoading] = useState(true);
  const [problemType, setProblemType] = useState<
    "blank" | "solving" | "class_implementation"
  >("solving");
  const [prevProblemInfo, setPrevProblemInfo] = useState<SimpleProblemDetail>();
  const [language, setLanguage] = useState<language>("c");
  const [codeString, setCodeString] = useState("");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [dragFile, setDragFile] = useState<File | null>(null);
  const [mainFile, setMainFile] = useState<File | null>(null);
  const auth = useAuth();
  useEffect(() => {
    async function getData() {
      try {
        const response = await getProblemWithProblemId(
          editingProblemId,
          auth.token
        );
        const problemInfo = response.data;
        setPrevProblemInfo(problemInfo);
        setProblemType(problemInfo.type);
        if (problemInfo.parsed_code_elements) {
          setLanguage(problemInfo.parsed_code_elements.language);
          setCodeString(
            parsedCodesToString(problemInfo.parsed_code_elements.data)
          );
        }
        setLoading(false);
      } catch (e) {
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
              try {
                const fileUploadResponse = await uploadFile(file, auth.token);
                newFilePath = fileUploadResponse.data.path;
              } catch (e) {
                toast.error("파일 저장에 오류가 있습니다!");
                onClose();
              }
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
                await toast.promise(
                  updateProblem(
                    problemType,
                    editingProblemId,
                    memory,
                    time,
                    name,
                    auth.token,
                    newFilePath.length
                      ? newFilePath
                      : prevProblemInfo!.file_path,
                    holes,
                    language
                  ),
                  {
                    loading: "문제를 수정하는중...",
                    success: "문제를 성공적으로 수정했습니다!",
                    error: (e) => `Error: ${e.message} - ${e.responseMessage}`,
                  }
                );
                onClose();
                break;
              case "solving":
                await toast.promise(
                  updateProblem(
                    problemType,
                    editingProblemId,
                    memory,
                    time,
                    name,
                    auth.token,
                    newFilePath.length
                      ? newFilePath
                      : prevProblemInfo!.file_path
                  ),
                  {
                    loading: "문제를 수정하는중...",
                    success: "문제를 성공적으로 수정했습니다!",
                    error: (e) => `Error: ${e.message} - ${e.responseMessage}`,
                  }
                );
                onClose();
                break;
              case "class_implementation":
                let mainFileObj: {
                  content: string;
                  name: string;
                } = {} as { content: string; name: string };
                if (mainFile) {
                  mainFileObj = await readFileAsServerFormat(mainFile);
                }
                await toast.promise(
                  updateProblem(
                    problemType,
                    editingProblemId,
                    memory,
                    time,
                    name,
                    auth.token,
                    newFilePath.length
                      ? newFilePath
                      : prevProblemInfo!.file_path,
                    undefined,
                    undefined,
                    mainFile
                      ? { ...mainFileObj, language }
                      : prevProblemInfo!.prepared_main
                      ? {
                          ...prevProblemInfo!.prepared_main.code,
                          language: prevProblemInfo!.prepared_main.language,
                        }
                      : undefined
                  ),
                  {
                    loading: "문제를 수정하는중...",
                    success: "문제를 성공적으로 수정했습니다!",
                    error: (e) => `Error: ${e.message} - ${e.responseMessage}`,
                  }
                );
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
                valueList={["solving", "blank", "class_implementation"]}
                textList={["문제 해결", "빈칸 채우기", "클래스/함수 구현"]}
                onChange={setProblemType as (value: string) => void}
                defaultValue={prevProblemInfo!.type}
              />
              <TextInput
                title="메모리 제한(MB)"
                name="memory"
                placeholder="0~2048 사이의 값"
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
                    onChange={(e) => setLanguage(e.target.value as language)}
                    defaultValue={language}
                  >
                    <option value="c">C</option>
                    <option value="java">Java</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="plaintext">Text</option>
                  </select>
                  <span>
                    언어와 관계없이 빈칸으로 표시하고 싶은 부분을 블록
                    주석(/**/) 으로 표시해 주세요
                  </span>
                  <span>
                    해당 언어의 문법에 적합하지 않은 빈칸은 적절하지 못하게
                    표시될 수 있습니다
                  </span>
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
              {problemType === "class_implementation" ? (
                <div className={styles["blank-section"]}>
                  <label htmlFor="language">Main 파일 언어</label>
                  <select
                    name="language"
                    id="language"
                    onChange={(e) => setLanguage(e.target.value as language)}
                  >
                    <option value="c">C</option>
                    <option value="java">Java</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="plaintext">Text</option>
                  </select>
                  <span>언어에 맞는 Main 파일을 준비해 주세요.</span>
                  {prevProblemInfo!.prepared_main && (
                    <>
                      <h4>기존 main 파일</h4>
                      <div
                        className={judgeStyles["file-row"]}
                        onClick={() => {
                          saveAs(
                            new File(
                              [prevProblemInfo!.prepared_main.code.content],
                              prevProblemInfo!.prepared_main.code.name
                            ),
                            prevProblemInfo!.prepared_main.code.name
                          );
                        }}
                      >
                        <span className={judgeStyles["file-name"]}>
                          {prevProblemInfo!.prepared_main.code.name}
                        </span>
                        <div className={judgeStyles["icon-area"]}>
                          <div className={judgeStyles["icon"]}>
                            <img src={download} alt="download icon" />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <SingleFileInput
                    title="새 Main 파일"
                    name="main"
                    placeholder="주의! 파일을 업로드 하면, 기존 파일은 삭제됩니다!"
                    onFileUpload={(file) => {
                      setMainFile(file);
                    }}
                  />
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
