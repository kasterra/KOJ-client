import { useEffect, useState } from "react";
import Modal from "~/components/Modal";
import styles from "./index.module.css";
import formStyles from "~/components/common/form.module.css";
import inputStyle from "~/components/Input/input.module.css";
import RadioGroup from "~/components/Radio/RadioGroup";
import CodeBlock from "~/components/CodeBlock";
import MultipleFileInput from "~/components/Input/MultipleFileInput";
import { language } from "~/types";
import { submit } from "~/API/submission";
import { useAuth } from "~/contexts/AuthContext";
import { useNavigate, useParams } from "@remix-run/react";
import CodeBlank from "~/components/CodeBlank";
import { getProblemWithProblemId } from "~/API/lecture";
import { generateFullCode } from "~/util/codeHole";
import toast from "react-hot-toast";
import { SimpleProblemDetail } from "~/types/APIResponse";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SubmitModal = ({ isOpen, onClose }: Props) => {
  const auth = useAuth();
  const { labId, lectureId, practiceId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [fileList, setFileList] = useState<FileList | null>(null);
  const [language, setLanguage] = useState<language>("c");
  const [entryPoint, setEntryPoint] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [problemDetail, setProblemDetail] = useState<SimpleProblemDetail>();

  useEffect(() => {
    async function getData() {
      try {
        const response = await getProblemWithProblemId(labId!, auth.token);
        setProblemDetail(response.data);
        setIsLoading(false);
      } catch (error: any) {
        toast.error(`Error: ${error.message} - ${error.responseMessage}`);
      }
    }

    getData();
  }, [lectureId, practiceId, labId]);

  return isLoading ? null : (
    <Modal
      title="정답 제출"
      subtitle={
        problemDetail!.type === "blank"
          ? "빈칸 채우기"
          : "파일 업로드, 코드 직접 제출 모두 가능합니다"
      }
      isOpen={isOpen}
      onClose={onClose}
    >
      {problemDetail!.type === "blank" ? (
        <form
          className={styles["modal-body"]}
          style={{ minWidth: "500px" }}
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            formData.append(
              "language",
              problemDetail!.parsed_code_elements.language
            );
            formData.append(
              "code",
              generateFullCode(
                problemDetail!.parsed_code_elements.data,
                formData.getAll("blank[]") as string[]
              )
            );
            await submit(auth.token, labId!, formData);
            navigate(
              `/students/${lectureId}/${practiceId}/history?problemId=${labId!}`
            );
          }}
        >
          <CodeBlank
            parsedCode={problemDetail!.parsed_code_elements.data}
            language={problemDetail!.parsed_code_elements.language}
          />
          <button className={formStyles["primary-button"]} type="submit">
            제출
          </button>
        </form>
      ) : (
        <form
          className={styles["modal-section"]}
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            formData.append("language", language);
            if (fileList) {
              [...fileList].forEach((file) => formData.append("codes", file));
            }
            formData.append("code", code);
            await submit(auth.token, labId!, formData);
            navigate(
              `/students/${lectureId}/${practiceId}/history?problemId=${
                problemDetail!.id
              }`
            );
          }}
        >
          <div className={styles["modal-body"]}>
            <RadioGroup
              title="프로그래밍 언어"
              name="language"
              valueList={["c", "cpp", "java", "python", "plaintext"]}
              textList={["C", "c++", "Java", "Python", "Text"]}
              onChange={setLanguage as (value: string) => void}
              defaultValue={problemDetail?.prepared_main?.language || undefined}
            />

            <div className={styles.flex}>
              {fileList && fileList.length > 1 ? (
                <RadioGroup
                  title="엔트리 포인트 설정"
                  name="entrypoint"
                  valueList={[...fileList].map((file) => file.name)}
                  textList={[...fileList].map((file) => file.name)}
                  onChange={setEntryPoint as (value: string) => void}
                />
              ) : null}
              <MultipleFileInput
                title="파일로 제출"
                name="files"
                onFileUpload={async (files) => {
                  setFileList(files);
                }}
              />
              {!fileList || fileList.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className={inputStyle.title}>코드로 작성하여 제출</span>
                  <CodeBlock
                    height={500}
                    language={language}
                    value={code}
                    onChange={setCode}
                  />
                  {language === "c" ? (
                    <span style={{ color: "red" }}>
                      void main()은 비표준 입니다. <br />
                      정상적인 채점 결과를 위해 int main을 사용해 주세요
                    </span>
                  ) : null}
                  {language === "java" ? (
                    <span style={{ color: "red" }}>
                      Java에서 코드 작성 제출의 경우 엔트리 포인트 클래스 이름이
                      <br />
                      <strong>Main</strong>이어야 합니다
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>

            <button
              className={formStyles["primary-button"]}
              type="submit"
              disabled={!fileList && code.length === 0}
            >
              제출
            </button>
          </div>
          {problemDetail!.type === "class_implementation" ? (
            <div className={styles["modal-body"]} style={{ minWidth: "500px" }}>
              <h4>
                주어진 Main 코드 : {problemDetail!.prepared_main.code.name}
              </h4>
              <CodeBlock
                height={500}
                language={problemDetail!.prepared_main.language}
                value={problemDetail!.prepared_main.code.content}
                onChange={() => null}
                readOnly
              />
            </div>
          ) : null}
        </form>
      )}
    </Modal>
  );
};

export default SubmitModal;
