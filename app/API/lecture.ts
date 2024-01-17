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
