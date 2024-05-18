import { API_SERVER_URL } from "~/util/constant";
import toast from "react-hot-toast";
import { TestcaseResponse } from "~/types/APIResponse";
import { handle401 } from "~/util";

export async function postNewTestcase(
  problemId: number,
  formData: FormData,
  token: string
) {
  const score = formData.get("score") as string;
  if (score === "") {
    toast.error("점수는 필수 입력입니다");
    return { message: "Declined by FE", status: 400 };
  }
  if (parseInt(score) < 0) {
    toast.error("점수는 음수가 될 수 없습니다");
    return { message: "Declined by FE", status: 400 };
  }
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
      handle401();
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
      handle401();
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
) {
  const score = formData.get("score");
  if (score === "") {
    toast.error("점수는 필수 입력입니다");
    return { message: "Declined by FE", status: 400 };
  }
  const response = await fetch(`${API_SERVER_URL}/testcase/${testcaseId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  switch (response.status) {
    case 400:
      toast.error("JWT 토큰이 없거나 입력값 검증이 실패하였습니다");
      break;
    case 401:
      handle401();
      break;
    case 403:
      toast.error("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 404:
      toast.error("해당 TC ID가 존재하지 않습니다");
      break;
  }
  return { ...(await response.json()), status: response.status };
}

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
      handle401();
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

export async function deleteFileInputFromTestCase(
  testcaseId: number,
  token: string,
  fileName: string
) {
  const response = { status: 404 };
  switch (response.status) {
    case 401:
      handle401();
      break;
    case 403:
      throw new Error("강의 소유 권한이 없습니다. 다시 확인해 주세요");
    case 404:
      throw new Error("현재 구현되어 있지 않은 API 입니다");
    case 500:
      throw new Error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
  }
}

export async function deleteFileOutputFromTestCase(
  testcaseId: number,
  token: string,
  fileName: string
) {
  const response = { status: 404 };
  switch (response.status) {
    case 401:
      handle401();
      break;
    case 403:
      throw new Error("강의 소유 권한이 없습니다. 다시 확인해 주세요");
    case 404:
      throw new Error("현재 구현되어 있지 않은 API 입니다");
    case 500:
      throw new Error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
  }
}
