import TextInput from "~/components/Input/TextInput";
import styles from "../index.module.css";
import judgeStyles from "~/css/judge.module.css";
import inputStyles from "~/components/Input/input.module.css";
import formStyles from "~/components/common/form.module.css";
import { MetaFunction, useNavigate, useSearchParams } from "@remix-run/react";
import { getUsersInLecture } from "~/API/lecture";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { QuizData, UserEntity } from "~/types/APIResponse";
import TableBase from "~/components/Table/TableBase";
import plusSquare from "~/assets/plus-square.svg";
import minusSquare from "~/assets/minus-square.svg";
import SingleFileInput from "~/components/Input/SingleFileInput";
import fileDownloadSVG from "~/assets/fileDownload.svg";
import { createQuizResultXlsx, parseQuizResultXlsx } from "~/util/xlsx";
import pkg from "file-saver";
import toast from "react-hot-toast";
import { createNewQuiz, getAllQuizes, updateQuiz } from "~/API/practice";
import { safeParseInt } from "~/util";
import { extractStudentInfo, toTableData } from "~/util/quizUtil";
const { saveAs } = pkg;

const QuizEdit = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const lecture_id = searchParams.get("lecture_id")!;
  const practice_id = searchParams.get("practice_id")!;
  const [prevQuizData, setPreviousQuizData] = useState<QuizData[]>([]);
  const [tableData, setTableData] = useState<Map<string, ReactNode>[]>([]);
  const [dataHeaders, setDataHeaders] = useState<ReactNode[]>([
    "학생 명",
    "Q1",
  ]);
  const navigate = useNavigate();
  useEffect(() => {
    async function getData() {
      const { data } = await getAllQuizes(practice_id, auth.token);
      setPreviousQuizData(data);
      setLoading(false);
      setDataHeaders([
        "학생 명",
        ...Array.from({ length: data.length }).map((_, i) => `Q${i + 1}`),
      ]);
    }
    getData();
  }, []);
  useEffect(() => {
    setTableData(toTableData(prevQuizData));
  }, [prevQuizData]);

  console.log(tableData);

  return loading ? (
    <h3>loading...</h3>
  ) : (
    <div className={styles["top-container"]}>
      <div className={styles.container}>
        <div className={formStyles["title-area"]}>
          <h1 className={formStyles.title}>퀴즈 성적 수정</h1>
          <h2 className={formStyles.subtitle}>퀴즈 성적을 수정합니다</h2>
        </div>
        <form
          className={styles["form-area"]}
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data: {
              max_score: number;
              scores: { score: number | null; user_id: string }[];
              title: string;
              quiz_id: number;
            }[] = Array.from({ length: dataHeaders.length - 1 }, (_, idx) => ({
              max_score: 0,
              scores: [],
              title: `Q${idx + 1}`,
              quiz_id: -1,
            }));

            for (let [key, value] of formData.entries()) {
              if (key === "xlsx") continue;
              const [studentId, questionId] = key.split("-");
              if (studentId == "0") {
                data[parseInt(questionId) - 1].max_score = parseInt(
                  value as string
                );
                data[parseInt(questionId) - 1].quiz_id =
                  prevQuizData[parseInt(questionId) - 1].id;
                continue;
              }
              try {
                data[parseInt(questionId) - 1].scores.push({
                  score:
                    (value as string) == "n" || (value as string) == "N"
                      ? null
                      : safeParseInt(value as string),
                  user_id: studentId,
                });
              } catch (err: any) {
                toast.error(err.message);
              }
            }

            console.log(data);

            await toast.promise(updateQuiz(practice_id, data, auth.token), {
              loading: "퀴즈 성적를 저장하는중...",
              success: () => {
                navigate(`/lectures/${lecture_id}`);
                return "퀴즈 성적 저장 완료";
              },
              error: (err) => `Error: ${err.message} - ${err.responseMessage}`,
            });
          }}
        >
          <div className={styles["text-area"]}>
            <span>+, - 버튼을 이용해서 문제를 추가/삭제 할 수 있습니다</span>
            <span>결석 등 점수가 없으면 n을 입력해 주세요</span>
          </div>
          <div className={styles["data-input-area"]}>
            <div className={styles["file-input-area"]}>
              <SingleFileInput
                title="채점 결과 xlsx 파일"
                name="xlsx"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onFileUpload={async (file) => {
                  const result = await toast.promise(
                    parseQuizResultXlsx(file),
                    {
                      loading: "xlsx 파일 읽는중...",
                      success: "성공적으로 읽었습니다!",
                      error: (err) =>
                        `Error: ${err.message} - ${err.responseMessage}`,
                    }
                  );
                  setTableData((prev) =>
                    result.map((userScoreRow, userIndex) => {
                      const map = new Map<string, ReactNode>();
                      map.set("학생 명", prev[userIndex].get("학생 명"));
                      let [_, studentId] = (
                        prev[userIndex].get("학생 명") as string
                      ).split("(");
                      studentId = studentId.slice(0, -1);
                      userScoreRow.map((userScore, scoreIdx) => {
                        map.set(
                          `Q${scoreIdx + 1}`,
                          <input
                            className={inputStyles.input}
                            required
                            placeholder={
                              userIndex == 0 ? "만점 점수" : "점수 입력"
                            }
                            defaultValue={userScore}
                            name={`${studentId}-${scoreIdx + 1}`}
                          />
                        );
                      });
                      return map;
                    })
                  );
                  setDataHeaders([
                    "학생 명",
                    ...Array.from({ length: result[0].length }).map(
                      (_, i) => `Q${i + 1}`
                    ),
                  ]);
                }}
              />
              <button
                className={styles["white-button"]}
                type="button"
                onClick={async () => {
                  saveAs(
                    await createQuizResultXlsx(extractStudentInfo(prevQuizData))
                  );
                }}
              >
                <img src={fileDownloadSVG} alt="파일 다운로드" />
                <span>엑셀 서식 다운로드</span>
              </button>
            </div>
            <div className={styles["table-area"]}>
              <TableBase
                gridTemplateColumns={`140px ${"150px ".repeat(
                  dataHeaders.length
                )}`}
                dataHeaders={dataHeaders}
                dataRows={tableData}
              />
              <div className={styles["table-manage-btns"]}>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => {
                    setTableData((prev) =>
                      prev.map((data: Map<string, ReactNode>, idx) => {
                        if (idx === 0) {
                          data.set(
                            `Q${dataHeaders.length}`,
                            <input
                              className={inputStyles.input}
                              required
                              placeholder="만점 점수"
                              name={`0-${dataHeaders.length}`}
                            ></input>
                          );
                          return data;
                        }
                        data.set(
                          `Q${dataHeaders.length}`,
                          <input
                            className={inputStyles.input}
                            required
                            placeholder="점수 입력"
                            name={`${(prev[idx].get("학생 명") as string)
                              .split("(")[1]
                              .slice(0, -1)}-${dataHeaders.length}`}
                          ></input>
                        );
                        return data;
                      })
                    );
                    setDataHeaders([...dataHeaders, `Q${dataHeaders.length}`]);
                  }}
                >
                  <img src={plusSquare} alt="plus btn" />
                </button>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => {
                    if (dataHeaders.length === 2) return;
                    setTableData((prev) => {
                      prev.map((elem) => {
                        elem.delete(`Q${dataHeaders.length - 1}`);
                        return elem;
                      });
                      return prev;
                    });
                    setDataHeaders((prev) => prev.slice(0, -1));
                  }}
                >
                  <img src={minusSquare} alt="minus btn" />
                </button>
              </div>
            </div>
          </div>
          <button type="submit" className={formStyles["primary-button"]}>
            저장하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuizEdit;

export const meta: MetaFunction = () => {
  return [
    {
      title: "퀴즈 성적 수정 | KOJ",
    },
    {
      property: "description",
      content: "퀴즈 성적 수정 화면입니다",
    },
    {
      property: "og:site_name",
      content: "KOJ - 퀴즈 성적 수정",
    },
  ];
};
