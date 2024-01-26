import {
  LecturesResponse,
  UserEntity,
  UserSearchResponse,
} from "~/types/APIResponse";
import toast from "react-hot-toast";
import { studentRow } from "~/types";

const API_SERVER_URL = "http://155.230.34.223:53469/api/v1";

export async function getFutureSemesterLectures(
  userId: string,
  token: string
): Promise<LecturesResponse> {
  const response = await fetch(
    `${API_SERVER_URL}/user/${userId}/lectures?semester=future`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  switch (response.status) {
    case 400:
      toast.error("올바르지 않은 입력입니다!");
      break;
    case 401:
      toast.error("세션이 만료되었습니다. 다시 로그인 해주세요");
      break;
    case 403:
      toast.error("권한이 없습니다!");
      break;
    case 404:
      toast.error("요청하는 사용자의 ID가 존재하지 않습니다");
      break;
    case 500:
      toast.error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
      break;
  }
  return { ...(await response.json()), status: response.status };
}

export async function getCurrentSemesterLectures(
  userId: string,
  token: string
): Promise<LecturesResponse> {
  const response = await fetch(
    `${API_SERVER_URL}/user/${userId}/lectures?semester=present`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  switch (response.status) {
    case 400:
      toast.error("올바르지 않은 입력입니다!");
      break;
    case 401:
      toast.error("세션이 만료되었습니다. 다시 로그인 해주세요");
      break;
    case 403:
      toast.error("권한이 없습니다!");
      break;
    case 404:
      toast.error("요청하는 사용자의 ID가 존재하지 않습니다");
      break;
    case 500:
      toast.error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
      break;
  }
  return { ...(await response.json()), status: response.status };
}

export async function getPreviousSemesterLectures(
  userId: string,
  token: string
): Promise<LecturesResponse> {
  const response = await fetch(
    `${API_SERVER_URL}/user/${userId}/lectures?semester=past`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  switch (response.status) {
    case 400:
      toast.error("올바르지 않은 입력입니다!");
      break;
    case 401:
      toast.error("세션이 만료되었습니다. 다시 로그인 해주세요");
      break;
    case 403:
      toast.error("권한이 없습니다!");
      break;
    case 404:
      toast.error("요청하는 사용자의 ID가 존재하지 않습니다");
      break;
    case 500:
      toast.error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
      break;
  }
  return { ...(await response.json()), status: response.status };
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

export async function UpdateLecture(
  lectureId: number,
  code: string,
  language: string,
  semester: number,
  title: string,
  token: string
) {
  const response = await fetch(`${API_SERVER_URL}/lecture/${lectureId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code, language, semester, title }),
  });

  switch (response.status) {
    case 400:
      toast.error("입력값 검증 실패");
      break;
    case 401:
      toast.error("유효하지 않은 JWT 토큰. 다시 로그인 해주세요");
      break;
    case 403:
      toast.error("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 404:
      toast.error("해당 강의 ID가 존재하지 않습니다");
      break;
    case 409:
      toast.error("강의가 중복됩니다! 입력값을 확인해 주세요");
      break;
    case 500:
      toast.error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
  }

  return { ...(await response.json()), status: response.status };
}

export async function deleteLecture(lectureId: number, token: string) {
  const response = await fetch(`${API_SERVER_URL}/lecture/${lectureId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  switch (response.status) {
    case 204:
      toast.success("성공적으로 삭제되었습니다");
      break;
    case 401:
      toast.error("유효하지 않은 JWT 토큰. 다시 로그인 해주세요");
      break;
    case 403:
      toast.error("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 404:
      toast.error("해당 강의 ID가 존재하지 않습니다");
      break;
    case 500:
      toast.error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
      break;
  }

  return { ...(await response.json()), status: response.status };
}

export async function addUserInLecture(
  lectureId: number,
  userInfo: studentRow,
  token: string
) {
  const { userId, isTutor, userName } = userInfo;
  const response = await fetch(`${API_SERVER_URL}/lecture/${lectureId}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: [{ id: userId, is_tutor: isTutor, name: userName }],
    }),
  });
  switch (response.status) {
    case 401:
      toast.error("유효하지 않은 JWT 토큰. 다시 로그인 해주세요");
      break;
    case 403:
      toast.error("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 404:
      toast.error("해당 강의 ID가 존재하지 않습니다");
      break;
    case 500:
      toast.error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
      break;
  }
  return { ...(await response.json()), status: response.status };
}

export async function addUsersInLecture(
  lecurteId: number,
  usersInfo: studentRow[],
  token: string
) {
  const response = await fetch(`${API_SERVER_URL}/lecture/${lecurteId}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: usersInfo.map(({ userId, isTutor, userName }) => ({
        id: userId,
        is_tutor: isTutor,
        name: userName,
      })),
    }),
  });
  switch (response.status) {
    case 401:
      toast.error("유효하지 않은 JWT 토큰. 다시 로그인 해주세요");
      break;
    case 403:
      toast.error("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 404:
      toast.error("해당 강의 ID가 존재하지 않습니다");
      break;
    case 500:
      toast.error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
  }
  return { ...(await response.json()), status: response.status };
}

export async function removeUserInLecture(
  lectureId: string,
  userId: string,
  token: string
) {
  const response = await fetch(
    `${API_SERVER_URL}/lecture/${lectureId}/user/${userId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  switch (response.status) {
    case 401:
      toast.error("유효하지 않은 JWT 토큰. 다시 로그인 해주세요");
      break;
    case 403:
      toast.error("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 404:
      toast.error("해당 강의 ID 또는 학생 ID가 존재하지 않습니다");
      break;
    case 500:
      toast.error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
  }
  return { status: response.status };
}

export async function getUsersInLecture(
  lectureId: string,
  token: string
): Promise<UserSearchResponse> {
  const response = await fetch(`${API_SERVER_URL}/lecture/${lectureId}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  switch (response.status) {
    case 401:
      toast.error("유효하지 않은 JWT 토큰. 다시 로그인 해주세요");
      break;
    case 403:
      toast.error("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 404:
      toast.error("해당 강의 ID가 존재하지 않습니다");
      break;
    case 500:
      toast.error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
  }
  return { ...(await response.json()), status: response.status };
}

export async function getLectureWithLectureId(
  lectureId: string,
  token: string
) {
  const response = await fetch(`${API_SERVER_URL}/lecture/${lectureId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  switch (response.status) {
    case 401:
      toast.error("유효하지 않은 JWT 토큰. 다시 로그인 해주세요");
      break;
    case 403:
      toast.error("강의에 소속이 되어있지 않습니다. 다시 확인해 주세요");
      break;
    case 404:
      toast.error("해당 강의 ID가 존재하지 않습니다");
      break;
    case 500:
      toast.error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
      break;
  }
  return { ...(await response.json()), status: response.status };
}

export async function getProblemWithProblemId(
  problemId: string,
  token: string
) {
  console.log("getProblemWithProblemId");
  return {
    message: "success",
    data: {
      id: 6,
      title: "problem1",
      testcases: [{ id: 1, title: "TC1" }],
    },
  };
}

export async function getAllPractices(token: string, userId: string) {
  return {
    message: "success",
    data: [
      {
        semester: 20241,
        lectures: [
          {
            id: 1,
            title: "후로구라밍구 베이직",
            language: "C",
            code: "comp123-456",
            semester: 20241,
            practices: [
              {
                id: 2,
                title: "실습이름",
              },
            ],
          },
        ],
      },
    ],
  };
}
