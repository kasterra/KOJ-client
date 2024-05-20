import { API_SERVER_URL } from "~/util/constant";
import { EmptyResponse, TestcaseResponse } from "~/types/APIResponse";
import { handle401 } from "~/util";
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from "~/util/errors";

export async function postNewTestcase(
  problemId: number,
  formData: FormData,
  token: string
): Promise<TestcaseResponse> {
  const score = formData.get("score") as string;
  if (score === "") {
    throw new BadRequestError("점수는 필수 입력입니다");
  }
  if (parseInt(score) < 0) {
    throw new BadRequestError("점수는 음수가 될 수 없습니다");
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
      throw new BadRequestError("입력값 검증이 실패하였습니다");
      break;
    case 401:
      handle401();
      break;
    case 403:
      throw new ForbiddenError("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 404:
      throw new NotFoundError("해당 문제 ID가 존재하지 않습니다");
      break;
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
      break;
  }
  return await response.json();
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
      throw new ForbiddenError("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 404:
      throw new NotFoundError("해당 TC ID가 존재하지 않습니다");
      break;
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
      break;
  }

  return await response.json();
}

export async function updateTestcase(
  testcaseId: number,
  formData: FormData,
  token: string
): Promise<TestcaseResponse> {
  const score = formData.get("score");
  if (score === "") {
    throw new Error("점수는 필수 입력입니다");
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
      throw new BadRequestError(
        "JWT 토큰이 없거나 입력값 검증이 실패하였습니다"
      );
      break;
    case 401:
      handle401();
      break;
    case 403:
      throw new ForbiddenError("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 404:
      throw new NotFoundError("해당 TC ID가 존재하지 않습니다");
      break;
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
      break;
  }
  return await response.json();
}

export async function deleteTestcase(
  testcaseId: number,
  token: string
): Promise<EmptyResponse> {
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
      throw new ForbiddenError("강의 소유 권한이 없습니다. 다시 확인해 주세요");
      break;
    case 404:
      throw new NotFoundError("해당 TC ID가 존재하지 않습니다");
      break;
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
      break;
  }
  return await response.json();
}

export async function deleteFileInputFromTestCase(
  testcaseId: number,
  fileName: string,
  token: string
): Promise<EmptyResponse> {
  const response = await fetch(
    `${API_SERVER_URL}/testcase/${testcaseId}/file`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        kind: "input",
        name: fileName,
      }),
    }
  );
  switch (response.status) {
    case 401:
      handle401();
      break;
    case 403:
      throw new ForbiddenError("강의 소유 권한이 없습니다. 다시 확인해 주세요");
    case 404:
      throw new NotFoundError("존재하지 않는 TC ID 입니다");
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
  }
  return await response.json();
}

export async function deleteFileOutputFromTestCase(
  testcaseId: number,
  fileName: string,
  token: string
): Promise<EmptyResponse> {
  const response = await fetch(
    `${API_SERVER_URL}/testcase/${testcaseId}/file`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        kind: "output",
        name: fileName,
      }),
    }
  );
  switch (response.status) {
    case 401:
      handle401();
      break;
    case 403:
      throw new ForbiddenError("강의 소유 권한이 없습니다. 다시 확인해 주세요");
    case 404:
      throw new NotFoundError("존재하지 않는 TC ID 입니다");
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
  }
  return await response.json();
}
