import { API_SERVER_URL } from "~/util/constant";
import {
  AllPracticesResponse,
  EmptyResponse,
  LectureResponse,
  LecturesResponse,
  ProblemDetailResponse,
  UserSearchResponse,
} from "~/types/APIResponse";
import { studentRow } from "~/types";
import { handle401 } from "~/util";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "~/util/errors";

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

  const data = await response.json();

  switch (response.status) {
    case 400:
      throw new BadRequestError(data.message);
    case 401:
      handle401();
      break;
    case 403:
      throw new UnauthorizedError(data.message);
      break;
    case 404:
      throw new NotFoundError("요청하는 사용자의 ID가 존재하지 않습니다");
      break;
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
      break;
  }
  return data;
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

  const data = await response.json();

  switch (response.status) {
    case 400:
      throw new BadRequestError(data.message);
      break;
    case 401:
      handle401();
      break;
    case 403:
      throw new UnauthorizedError(data.message);
      break;
    case 404:
      throw new Error("요청하는 사용자의 ID가 존재하지 않습니다");
      break;
    case 500:
      throw new Error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
      break;
  }
  return data;
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

  const data = await response.json();

  switch (response.status) {
    case 400:
      throw new BadRequestError("올바르지 않은 입력입니다!");
    case 401:
      handle401();
      break;
    case 403:
      throw new UnauthorizedError("권한이 없습니다!");
    case 404:
      throw new NotFoundError("요청하는 사용자의 ID가 존재하지 않습니다");
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
  }
  return data;
}

export async function postNewLecture(
  code: string,
  language: string,
  semester: number,
  title: string,
  token: string
): Promise<LectureResponse> {
  if (!code) {
    throw new BadRequestError("강의 코드는 필수 입력 필드입니다");
  }
  if (!language) {
    throw new BadRequestError("사용 언어는 필수 입력 필드입니다");
  }
  if (!semester) {
    throw new BadRequestError("학기 정보는 필수 입력 필드입니다");
  }
  if (!title) {
    throw new BadRequestError("강의 제목은 필수 입력 필드입니다");
  }
  const response = await fetch(`${API_SERVER_URL}/lecture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code, language, semester, title }),
  });

  const data = await response.json();

  switch (response.status) {
    case 400:
      throw new BadRequestError(data.message);
    case 401:
      handle401();
      break;
    case 403:
      throw new UnauthorizedError(data.message);
    case 409:
      throw new ConflictError(data.message);
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
  }

  return data;
}

export async function UpdateLecture(
  lectureId: number,
  code: string,
  language: string,
  semester: number,
  title: string,
  token: string
): Promise<LectureResponse> {
  if (!code) {
    throw new BadRequestError("강의 코드는 필수 입력 필드입니다");
  }
  if (!language) {
    throw new BadRequestError("사용 언어는 필수 입력 필드입니다");
  }
  if (!semester) {
    throw new BadRequestError("학기 정보는 필수 입력 필드입니다");
  }
  if (!title) {
    throw new BadRequestError("강의 제목은 필수 입력 필드입니다");
  }
  const response = await fetch(`${API_SERVER_URL}/lecture/${lectureId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code, language, semester, title }),
  });

  const data = await response.json();

  switch (response.status) {
    case 400:
      throw new BadRequestError("입력값 검증 실패");
      break;
    case 401:
      handle401();
      break;
    case 403:
      throw new ForbiddenError("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 404:
      throw new NotFoundError("해당 강의 ID가 존재하지 않습니다");
      break;
    case 409:
      throw new Error("강의가 중복됩니다! 입력값을 확인해 주세요");
      break;
    case 500:
      throw new Error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
  }

  return data;
}

export async function deleteLecture(
  lectureId: number,
  token: string
): Promise<EmptyResponse> {
  const response = await fetch(`${API_SERVER_URL}/lecture/${lectureId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  switch (response.status) {
    case 401:
      handle401();
      break;
    case 403:
      throw new Error("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 404:
      throw new Error("해당 강의 ID가 존재하지 않습니다");
      break;
    case 500:
      throw new Error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
      break;
  }

  return data;
}

export async function addUserInLecture(
  lectureId: number,
  userInfo: studentRow,
  token: string
): Promise<EmptyResponse> {
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

  const data = await response.json();

  switch (response.status) {
    case 400:
      throw new BadRequestError("입력값 검증 실패");
    case 401:
      handle401();
      break;
    case 403:
      throw new Error("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 404:
      throw new Error("해당 강의 ID가 존재하지 않습니다");
      break;
    case 500:
      throw new Error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
      break;
  }
  return data;
}

export async function addUsersInLecture(
  lecurteId: number,
  usersInfo: studentRow[],
  token: string
): Promise<EmptyResponse> {
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
  const data = await response.json();
  switch (response.status) {
    case 400:
      throw new BadRequestError(data.message);
    case 401:
      handle401();
      break;
    case 403:
      throw new ForbiddenError("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 404:
      throw new NotFoundError("해당 강의 ID가 존재하지 않습니다");
      break;
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
  }
  return data;
}

export async function removeUserInLecture(
  lectureId: string,
  userId: string,
  token: string
): Promise<EmptyResponse> {
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
      handle401();
      break;
    case 403:
      throw new ForbiddenError("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 404:
      throw new NotFoundError("해당 강의 ID 또는 학생 ID가 존재하지 않습니다");
      break;
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
  }

  if (response.status === 204) return {};

  return await response.json();
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
  const data = await response.json();
  switch (response.status) {
    case 401:
      handle401();
      break;
    case 403:
      throw new ForbiddenError("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 404:
      throw new NotFoundError("해당 강의 ID가 존재하지 않습니다");
      break;
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
  }
  return data;
}

export async function getLectureWithLectureId(
  lectureId: string,
  token: string
): Promise<LectureResponse> {
  const response = await fetch(`${API_SERVER_URL}/lecture/${lectureId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  switch (response.status) {
    case 401:
      handle401();
      break;
    case 403:
      throw new ForbiddenError(
        "강의에 소속이 되어있지 않습니다. 다시 확인해 주세요"
      );
      break;
    case 404:
      throw new NotFoundError("해당 강의 ID가 존재하지 않습니다");
      break;
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
      break;
  }
  return data;
}

export async function getProblemWithProblemId(
  problemId: number | string,
  token: string
): Promise<ProblemDetailResponse> {
  const response = await fetch(`${API_SERVER_URL}/problem/${problemId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  switch (response.status) {
    case 401:
      handle401();
      break;
    case 403:
      throw new ForbiddenError(
        "강의에 소속이 되어있지 않습니다. 다시 확인해 주세요"
      );
      break;
    case 404:
      throw new NotFoundError("해당 강의 ID가 존재하지 않습니다");
      break;
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
      break;
  }
  return data;
}

export async function getAllPractices(
  token: string,
  userId: string
): Promise<AllPracticesResponse> {
  const response = await fetch(`${API_SERVER_URL}/user/${userId}/practices`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  switch (response.status) {
    case 401:
      handle401();
      break;
    case 403:
      throw new ForbiddenError(
        "강의에 소속이 되어있지 않습니다. 다시 확인해 주세요"
      );
      break;
    case 404:
      throw new NotFoundError("해당 강의 ID가 존재하지 않습니다");
      break;
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
      break;
  }
  return data;
}
