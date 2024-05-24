import { API_SERVER_URL } from "~/util/constant";
import { PracticeDetailResponse } from "~/types/APIResponse";
import { handle401 } from "~/util";
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from "~/util/errors";

export async function getPracticeWithPracticeId(
  practiceId: number | string,
  token: string
): Promise<PracticeDetailResponse> {
  const response = await fetch(`${API_SERVER_URL}/practice/${practiceId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  switch (response.status) {
    case 401:
      handle401();
      break;
    case 403:
      throw new ForbiddenError(
        "강의에 소속된 유저가 이닙니다. 다시 확인해 주세요"
      );
      break;
    case 404:
      throw new NotFoundError("해당 실습 ID가 존재하지 않습니다");
      break;
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
    default:
      break;
  }
  return await response.json();
}

export async function createNewPractice(
  lecture_id: number,
  start_time: string,
  end_time: string,
  title: string,
  token: string
) {
  if (!title) {
    throw new BadRequestError("제목은 필수 입력 필드입니다");
  }
  const response = await fetch(`${API_SERVER_URL}/practice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ lecture_id, start_time, end_time, title }),
  });

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
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
      break;
  }
  return await response.json();
}

export async function updatePractice(
  practice_id: number,
  start_time: string,
  end_time: string,
  title: string,
  token: string
) {
  if (!title) {
    throw new BadRequestError("제목은 필수 입력 필드입니다");
  }
  const response = await fetch(`${API_SERVER_URL}/practice/${practice_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ start_time, end_time, title }),
  });

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
      throw new NotFoundError("해당 실습 ID가 존재하지 않습니다");
      break;
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
      break;
  }
  if (response.status === 204) {
    return {};
  }
  return await response.json();
}

export async function deletePractice(
  practiceId: number,
  token: string
): Promise<{ status: number }> {
  const response = await fetch(`${API_SERVER_URL}/practice/${practiceId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  switch (response.status) {
    case 401:
      handle401();
      break;
    case 403:
      throw new ForbiddenError("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 404:
      throw new NotFoundError("강의 ID가 없거나 실습 ID 가 없습니다");
      break;
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
      break;
  }
  if (response.status === 204) {
    return { status: 204 };
  }
  return await response.json();
}
