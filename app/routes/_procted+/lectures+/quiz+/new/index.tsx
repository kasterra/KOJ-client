import TextInput from "~/components/Input/TextInput";
import styles from "../index.module.css";
import judgeStyles from "~/css/judge.module.css";
import inputStyles from "~/components/Input/input.module.css";
import formStyles from "~/components/common/form.module.css";
import { MetaFunction, useSearchParams } from "@remix-run/react";
import { getUsersInLecture } from "~/API/lecture";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { UserEntity } from "~/types/APIResponse";
import TableBase from "~/components/Table/TableBase";
import plusSquare from "~/assets/plus-square.svg";
import minusSquare from "~/assets/minus-square.svg";
import SingleFileInput from "~/components/Input/SingleFileInput";
import fileDownloadSVG from "~/assets/fileDownload.svg";
import { createQuizResultXlsx, parseQuizResultXlsx } from "~/util/xlsx";
import pkg from "file-saver";
import toast from "react-hot-toast";
const { saveAs } = pkg;

const QuizRegister = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const lecture_id = searchParams.get("lecture_id")!;
  const practice_id = searchParams.get("practice_id")!;
  const [users, setUsers] = useState<UserEntity[]>([]);
  const [tableData, setTableData] = useState<Map<string, ReactNode>[]>([]);
  const [dataHeaders, setDataHeaders] = useState<ReactNode[]>([
    "학생 명",
    "Q1",
  ]);
  useEffect(() => {
    async function getData() {
      const { data: users } = await getUsersInLecture(lecture_id, auth.token);
      setUsers(users);
      setLoading(false);
    }
    getData();
  }, []);
  useEffect(() => {
    setTableData([
      (function () {
        const map = new Map<string, ReactNode>();
        map.set(
          "학생 명",
          <span className={judgeStyles.correct}>문제별 만점</span>
        );
        map.set(
          "Q1",
          <input
            className={inputStyles.input}
            required
            placeholder="만점 점수"
            name="S0-Q1"
          />
        );
        return map;
      })(),
      ...users.map((user, userIndex) => {
        const map = new Map<string, ReactNode>();
        map.set("학생 명", user.name);
        map.set(
          "Q1",
          <input
            className={inputStyles.input}
            required
            placeholder="점수 입력"
            name={`S${userIndex + 1}-Q1`}
          />
        );
        return map;
      }),
    ]);
  }, [users]);

  return loading ? (
    <h3>loading...</h3>
  ) : (
    <div className={styles["top-container"]}>
      <div className={styles.container}>
        <div className={formStyles["title-area"]}>
          <h1 className={formStyles.title}>퀴즈 성적 등록</h1>
          <h2 className={formStyles.subtitle}>퀴즈 성적을 등록합니다</h2>
        </div>
        <form
          className={styles["form-area"]}
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data: {
              [studentId: string]: { [questionId: string]: string };
            } = {};

            for (let [key, value] of formData.entries()) {
              if (key === "xlsx") continue;
              const [studentId, questionId] = key.split("-");
              if (!data[studentId]) {
                data[studentId] = {};
              }
              data[studentId][questionId] = value as string;
            }

            console.log(data);
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
                            name={`S${userIndex}-Q${scoreIdx + 1}`}
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
                  saveAs(await createQuizResultXlsx(users));
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
                              name={`S0-Q${dataHeaders.length}`}
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
                            name={`S${idx}-Q${dataHeaders.length}`}
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

export default QuizRegister;

export const meta: MetaFunction = () => {
  return [
    {
      title: "퀴즈 성적 입력 | KOJ",
    },
    {
      property: "description",
      content: "퀴즈 성적 입력 화면입니다",
    },
    {
      property: "og:site_name",
      content: "KOJ - 퀴즈 성적 입력",
    },
  ];
};
