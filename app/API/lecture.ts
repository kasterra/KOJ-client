import { LectureEntity } from "~/types/APIResponse";

const API_SERVER_URL = "http://155.230.34.223:53469/api/v1";

export async function getCurrentSemesterLectures(token: string) {
  return {
    message: "success",
    data: [
      {
        code: "COMP0000",
        id: 1,
        language: "C",
        title: "기초프로그래밍",
        semester: 20240,
        professor_name: "김교수",
      },
      {
        code: "COMP0001",
        id: 2,
        language: "Java",
        title: "자바프로그래밍",
        semester: 20240,
        professor_name: "최교수",
      },
      {
        code: "COMP0002",
        id: 3,
        language: "C",
        title: "네트워크",
        semester: 20240,
        professor_name: "박교수",
      },
    ],
  };
}

export async function getPreviousSemesterLectures(token: string) {
  return {
    message: "success",
    data: [
      {
        code: "COMP0000",
        id: 1,
        language: "C",
        title: "기초프로그래밍",
        semester: 20232,
        professor_name: "김교수",
      },
      {
        code: "COMP0001",
        id: 2,
        language: "C",
        title: "기초프로그래밍",
        semester: 20232,
        professor_name: "최교수",
      },
      {
        code: "COMP0002",
        id: 3,
        language: "C",
        title: "기초프로그래밍",
        semester: 20232,
        professor_name: "박교수",
      },
    ],
  };
}

export async function postNewLecture(
  code: string,
  language: string,
  semester: number,
  title: string,
  token: string
) {
  const response = await fetch(`${API_SERVER_URL}/lecture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code, language, semester, title }),
  });

  return { ...(await response.json()), status: response.status };
}

export async function getLectureWithLectureId(
  lectureId: string,
  token: string
) {
  return {
    message: "success",
    data: {
      id: 1,
      title: "후로구라밍구 베이직",
      language: "C",
      code: "comp123-456",
      semester: 20241,
      practices: [
        {
          id: 2,
          title: "실습이름",
          problems: [
            {
              id: 6,
              title: "problem1",
            },
            {
              id: 6,
              title: "problem3",
            },
          ],
        },
        {
          id: 2,
          title: "실습이름",
          problems: [
            {
              id: 6,
              title: "problem1",
            },
          ],
        },
      ],
    },
  };
}
