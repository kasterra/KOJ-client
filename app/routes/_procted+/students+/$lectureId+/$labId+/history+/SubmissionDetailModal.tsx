import { useEffect, useState } from "react";
import { getSubmissionWithSubmissionId } from "~/API/submission";
import Modal from "~/components/Modal";
import styles from "./index.module.css";
import judgeStyles from "~/css/judge.module.css";
import { useAuth } from "~/contexts/AuthContext";
import CodeBlock from "~/components/CodeBlock";
import TextInput from "~/components/Input/TextInput";
import TextArea from "~/components/Input/TextArea";
import { bytesToSize } from "~/util";
import toast from "react-hot-toast";
import download from "~/assets/download.svg";
import pkg from "file-saver";
const { saveAs } = pkg;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  submissionId: number;
}

const SubmissionDetailModal = ({ isOpen, onClose, submissionId }: Props) => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [submissionResponse, setSubmissionResponse] = useState<any>();

  useEffect(() => {
    async function getSubmissionFromServer() {
      try {
        const response = await getSubmissionWithSubmissionId(
          submissionId,
          auth.token
        );
        setSubmissionResponse(response);
        setIsLoading(false);
      } catch (error: any) {
        onClose();
        toast.error(`Error: ${error.message} - ${error.responseMessage}`);
      }
    }

    getSubmissionFromServer();
  }, []);

  return (
    <Modal
      title="채점 결과"
      subtitle="채점 결과의 조회화면입니다"
      isOpen={isOpen}
      onClose={onClose}
    >
      {isLoading ? (
        <h3>Loading...</h3>
      ) : (
        <div className={styles["modal-body"]}>
          <div className={styles["modal-section"]}>
            <h4>코드 제출물</h4>
            {submissionResponse.data.codes.map((code: any) => {
              return (
                <div className={styles["blank-section"]}>
                  <h5>{code.name}</h5>
                  <CodeBlock
                    height="300px"
                    readOnly
                    language={submissionResponse.data.language}
                    value={code.content}
                    onChange={() => null}
                  />
                </div>
              );
            })}
          </div>
          <div className={styles["modal-section"]}>
            <h4>채점</h4>
            {submissionResponse.data.testcase_results.map(
              (result: any, idx: number) => {
                return (
                  <div className={styles["modal-section"]}>
                    <div className={styles.line}>
                      <h5>{`${idx + 1}번째 케이스 : ${result.score} 점`}</h5>
                      {(function () {
                        switch (result.status) {
                          case "accepted":
                            return (
                              <span className={styles.correct}>맞았습니다</span>
                            );
                          case "time_limit":
                            return (
                              <span className={styles.wrong}>시간 초과</span>
                            );
                          case "memory_limit":
                            return (
                              <span className={styles.wrong}>메모리 초과</span>
                            );
                          case "wrong_answer":
                            return (
                              <span className={styles.wrong}>틀렸습니다</span>
                            );
                          case "runtime_error":
                            return (
                              <span className={styles.error}>런타임 에러</span>
                            );
                          case "compile_error":
                            return (
                              <span className={styles.error}>컴파일 에러</span>
                            );
                          case "pending":
                            return (
                              <span className={styles.waiting}>
                                기다리는 중
                              </span>
                            );
                          case "internal_error":
                            return (
                              <span className={styles.error}>
                                서버 내부 에러
                              </span>
                            );
                          default:
                            return (
                              <span className={styles.error}>
                                {result.status}
                              </span>
                            );
                        }
                      })()}
                    </div>
                    <TextInput
                      title="소요 시간"
                      disabled
                      name=""
                      defaultValue={result.used_time}
                    />
                    <TextInput
                      title="사용 메모리"
                      disabled
                      name=""
                      defaultValue={bytesToSize(result.used_memory)}
                    />
                    {result.stdin ? (
                      <TextArea
                        title="주어진 표준입력"
                        disabled
                        name=""
                        defaultValue={result.stdin}
                        height={300}
                      />
                    ) : (
                      <span className={styles.error}>
                        입력이 제공되지 않았거나, 비공개 TC 입니다
                      </span>
                    )}
                    <TextArea
                      title="주어진 출력"
                      disabled
                      name=""
                      defaultValue={result.stdout}
                      height={300}
                    />
                    {result.judge_answer ? (
                      <TextArea
                        title="예상된 출력"
                        disabled
                        name=""
                        defaultValue={result.judge_answer}
                        height={300}
                      />
                    ) : (
                      <span className={styles.error}>
                        출력이 제공되지 않았거나, 비공개 TC 입니다
                      </span>
                    )}
                    <TextInput
                      title="exit code"
                      disabled
                      name=""
                      defaultValue={result.exit_code}
                    />
                    {result.file_inputs && (
                      <div className={styles.area}>
                        <h3 className={styles.title}>파일 입력</h3>
                        <div className={judgeStyles["file-rows"]}>
                          {result.file_inputs!.map(
                            (file: { name: string; content: string }) => (
                              <div
                                className={judgeStyles["file-row"]}
                                onClick={() => {
                                  saveAs(
                                    new File([file.content], file.name),
                                    file.name
                                  );
                                }}
                              >
                                <span className={judgeStyles["file-name"]}>
                                  {file.name}
                                </span>
                                <div className={judgeStyles["icon-area"]}>
                                  <div className={judgeStyles["icon"]}>
                                    <img src={download} alt="download icon" />
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                    {result.file_outputs && (
                      <div className={styles.area}>
                        <h3 className={styles.title}>내 파일 출력</h3>
                        <div className={judgeStyles["file-rows"]}>
                          {result.file_outputs!.map(
                            (file: { name: string; content: string }) => (
                              <div
                                className={judgeStyles["file-row"]}
                                onClick={() => {
                                  saveAs(
                                    new File([file.content], file.name),
                                    file.name
                                  );
                                }}
                              >
                                <span className={judgeStyles["file-name"]}>
                                  {file.name}
                                </span>
                                <div className={judgeStyles["icon-area"]}>
                                  <div className={judgeStyles["icon"]}>
                                    <img src={download} alt="download icon" />
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                    {result.judge_file_outputs && (
                      <div className={styles.area}>
                        <h3 className={styles.title}>저지 파일 출력</h3>
                        <div className={judgeStyles["file-rows"]}>
                          {result.judge_file_outputs!.map(
                            (file: { name: string; content: string }) => (
                              <div
                                className={judgeStyles["file-row"]}
                                onClick={() => {
                                  saveAs(
                                    new File([file.content], file.name),
                                    file.name
                                  );
                                }}
                              >
                                <span className={judgeStyles["file-name"]}>
                                  {file.name}
                                </span>
                                <div className={judgeStyles["icon-area"]}>
                                  <div className={judgeStyles["icon"]}>
                                    <img src={download} alt="download icon" />
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                    {result.message && (
                      <TextArea
                        title="컴파일러 메세지"
                        disabled
                        name=""
                        defaultValue={result.message}
                        height={300}
                      />
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default SubmissionDetailModal;
