import inputStyles from "~/components/Input/input.module.css";
import judgeStyles from "~/css/judge.module.css";
import { ReactNode } from "react";
import { QuizData, UserEntity } from "~/types/APIResponse";

export function toTableData(data: QuizData[]) {
  let transformedData: Map<
    string,
    {
      name: string;
      scores: { [questionId: string]: number | null };
    }
  > = new Map();
  let tableData: Map<string, ReactNode>[] = [];

  // 데이터를 변환
  const row = new Map<string, ReactNode>();
  row.set("학생 명", <span className={judgeStyles.correct}>문제별 만점</span>);

  data.forEach((question, idx) => {
    row.set(
      `Q${idx + 1}`,
      <input
        className={inputStyles.input}
        required
        placeholder="만점 점수"
        name={`0-${idx + 1}`}
        defaultValue={question.max_score}
      />
    );
    question.scores.forEach((score) => {
      if (!transformedData.get(score.user_id)) {
        transformedData.set(score.user_id, {
          name: score.name,
          scores: {},
        });
      }
      transformedData.get(score.user_id)!.scores[question.id] = score.score;
    });
  });

  tableData.push(row);

  // 표 형태의 데이터로 변환

  for (let user_id of transformedData.keys()) {
    const row = new Map<string, ReactNode>();
    row.set("학생 명", `${transformedData.get(user_id)!.name}(${user_id})`);
    data.forEach((question, idx) => {
      row.set(
        `Q${idx + 1}`,
        <input
          className={inputStyles.input}
          required
          placeholder="점수 입력"
          defaultValue={
            transformedData.get(user_id)!.scores[question.id] === null
              ? "n"
              : transformedData.get(user_id)!.scores[question.id] + ""
          }
          name={`${user_id}-${idx + 1}`}
        />
      );
    });
    tableData.push(row);
  }
  return tableData;
}

export function extractStudentInfo(data: QuizData[]) {
  let students: UserEntity[] = [];

  // 학생 정보를 추출
  data.forEach((question) => {
    question.scores.forEach((score) => {
      // 중복된 학생이 없는지 확인
      if (!students.some((student) => student.id === score.user_id)) {
        students.push({
          id: score.user_id,
          name: score.name,
          is_admin: false,
          role: "student",
        });
      }
    });
  });
  return students;
}
