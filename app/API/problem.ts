import { API_SERVER_URL } from "~/util/constant";
import { parsedCodeElement } from "~/util/codeHole";
import { uploadFile } from "./media";
import { handle401 } from "~/util";
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from "~/util/errors";
import { EmptyResponse, ProblemDetailResponse } from "~/types/APIResponse";

export async function postSolveProblem(
  file: File,
  memory_limit: number,
  practice_id: number,
  time_limit: number,
  title: string,
  token: string
): Promise<ProblemDetailResponse> {
  if (0 > memory_limit || memory_limit > 4096) {
    throw new BadRequestError("메모리 제한은 0 ~ 4096 사이 값을 넣어야 합니다");
  }
  if (!title) {
    throw new BadRequestError("제목은 필수 입력 필드입니다");
  }
  if (0 > time_limit || time_limit > 10000) {
    throw new BadRequestError("시간 제한은 0~10,000 사이의 값을 넣어야 합니다");
  }
  const fileUploadResponse = await uploadFile(file, token);
  const file_path = fileUploadResponse.data.path;
  const response = await fetch(`${API_SERVER_URL}/problem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      file_path,
      memory_limit,
      practice_id,
      time_limit,
      title,
      type: "solving",
    }),
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
  }
  return await response.json();
}

export async function postBlankProblem(
  file: File,
  memory_limit: number,
  data: parsedCodeElement[][],
  language: string,
  practice_id: number,
  time_limit: number,
  title: string,
  token: string
): Promise<ProblemDetailResponse> {
  if (0 > memory_limit || memory_limit > 4096) {
    throw new BadRequestError("메모리 제한은 0 ~ 4096 사이 값을 넣어야 합니다");
  }
  if (!title) {
    throw new BadRequestError("제목은 필수 입력 필드입니다");
  }
  if (0 > time_limit || time_limit > 10000) {
    throw new BadRequestError("시간 제한은 0~10,000 사이의 값을 넣어야 합니다");
  }
  const fileUploadResponse = await uploadFile(file, token);
  const file_path = fileUploadResponse.data.path;
  const response = await fetch(`${API_SERVER_URL}/problem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      file_path,
      memory_limit,
      parsed_code_elements: { data, language },
      practice_id,
      time_limit,
      title,
      type: "blank",
    }),
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
  }
  return await response.json();
}

export async function updateProblem(
  problemType: "solving" | "blank",
  problemId: number,
  memory_limit: number,
  time_limit: number,
  title: string,
  token: string,
  file_path: string,
  parsed_code_elements?: parsedCodeElement[][]
): Promise<EmptyResponse> {
  if (0 > memory_limit || memory_limit > 4096) {
    throw new BadRequestError("메모리 제한은 0 ~ 4096 사이 값을 넣어야 합니다");
  }
  if (!title) {
    throw new BadRequestError("제목은 필수 입력 필드입니다");
  }
  if (0 > time_limit || time_limit > 10000) {
    throw new BadRequestError("시간 제한은 0~10,000 사이의 값을 넣어야 합니다");
  }
  if (problemType === "blank") {
    if (!parsed_code_elements) {
      throw new BadRequestError("빈칸 문제에는 빈칸정보가 필요합니다");
    }
  }
  const response = await fetch(`${API_SERVER_URL}/problem/${problemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      file_path,
      memory_limit,
      ...(parsed_code_elements ? { parsed_code_elements } : {}),
      time_limit,
      title,
      type: problemType,
    }),
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
      throw new NotFoundError("해당 문제 ID가 존재하지 않습니다");
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

export async function deleteProblem(
  problemId: number,
  token: string
): Promise<EmptyResponse> {
  const response = await fetch(`${API_SERVER_URL}/problem/${problemId}`, {
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
      throw new NotFoundError("해당 문제 ID가 존재하지 않습니다");
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
