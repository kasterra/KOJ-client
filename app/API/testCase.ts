import toast from "react-hot-toast";
import { TestcaseResponse } from "~/types/APIResponse";

const API_SERVER_URL = "http://155.230.34.223:53469/api/v1";

export async function postNewTestcase(
  problemId: number,
  formData: FormData,
  token: string
) {
  const response = await fetch(
    `${API_SERVER_URL}/problem/${problemId}/testcase`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  switch (response.status) {
    case 400:
      toast.error("입력값 검증이 실패하였습니다");
      break;
    case 401:
      toast.error("유효하지 않은 JWT 토큰. 다시 로그인 해주세요");
      break;
    case 403:
      toast.error("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 404:
      toast.error("해당 문제 ID가 존재하지 않습니다");
      break;
    case 500:
      toast.error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
      break;
  }
  return { ...(await response.json()), status: response.status };
}

export async function getTestcaseById(
  testcaseId: number,
  token: string
): Promise<TestcaseResponse> {
  const response = await fetch(`${API_SERVER_URL}/testcase/${testcaseId}`, {
    method: "GET",
    headers: {
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
      toast.error("해당 TC ID가 존재하지 않습니다");
      break;
    case 500:
      toast.error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
      break;
  }

  return { ...(await response.json()), status: response.status };
}

export async function updateTestcase(
  testcaseId: number,
  formData: FormData,
  token: string
) {}

export async function deleteTestcase(testcaseId: number, token: string) {
  const response = await fetch(`${API_SERVER_URL}/testcase/${testcaseId}`, {
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
      toast.error("해당 TC ID가 존재하지 않습니다");
      break;
    case 500:
      toast.error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
      break;
  }
  return { status: response.status };
}
