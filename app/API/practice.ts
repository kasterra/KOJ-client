import toast from "react-hot-toast";
import { PracticeDetailResponse } from "~/types/APIResponse";

const API_SERVER_URL = "http://155.230.34.223:53469/api/v1";

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
      toast.error("유효하지 않은 JWT 토큰. 다시 로그인 하세요");
      break;
    case 403:
      toast.error("강의에 소속된 유저가 이닙니다. 다시 확인해 주세요");
      break;
    case 404:
      toast.error("해당 실습 ID가 존재하지 않습니다");
      break;
    default:
      break;
  }
  return { ...(await response.json()), status: response.status };
}

export async function createNewPractice(
  lecture_id: number,
  start_time: string,
  end_time: string,
  title: string,
  token: string
) {
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
      toast.error("입력값 검증 실패");
      break;
    case 401:
      toast.error("유효하지 않은 JWT 토큰. 다시 로그인 해주세요");
      break;
    case 403:
      toast.error("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 500:
      toast.error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
      break;
  }
  return { ...(await response.json()), status: response.status };
}

export async function updatePractice(
  practice_id: number,
  start_time: string,
  end_time: string,
  title: string,
  token: string
) {
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
      toast.error("입력값 검증 실패");
      break;
    case 401:
      toast.error("유효하지 않은 JWT 토큰. 다시 로그인 해주세요");
      break;
    case 403:
      toast.error("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 404:
      toast.error("해당 실습 ID가 존재하지 않습니다");
      break;
    case 500:
      toast.error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
      break;
  }
  return { status: response.status };
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
      toast.error("유효하지 않은 JWT 토큰. 다시 로그인 해주세요");
      break;
    case 403:
      toast.error("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 404:
      toast.error("강의 ID가 없거나 실습 ID 가 없습니다");
      break;
    case 500:
      toast.error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
      break;
  }
  return { status: response.status };
}
