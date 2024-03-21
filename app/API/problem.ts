import { parsedCodeElement } from "~/util/codeHole";
import toast from "react-hot-toast";
import { uploadFile } from "./media";
import { SuccessUploadFileResponse } from "~/types/APIResponse";

const API_SERVER_URL = "http://155.230.34.223:53469/api/v1";

export async function postSolveProblem(
  file: File,
  memory_limit: number,
  practice_id: number,
  time_limit: number,
  title: string,
  token: string
) {
  const fileUploadResponse = await uploadFile(file, token);
  if (fileUploadResponse.status !== 200) {
    return { status: fileUploadResponse.status };
  }
  const file_path = (fileUploadResponse as SuccessUploadFileResponse).data.path;
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
      toast.error("입력값 검증 실패");
      break;
    case 401:
      toast.error("유효하지 않은 JWT 토큰. 다시 로그인 해주세요");
      break;
    case 403:
      toast.error("강의 소유 권한이 없습니다. 다시 확인해 주세요");
  }
  return { status: response.status, ...(await response.json()) };
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
) {
  const fileUploadResponse = await uploadFile(file, token);
  if (fileUploadResponse.status !== 200) {
    return { status: fileUploadResponse.status };
  }
  const file_path = (fileUploadResponse as SuccessUploadFileResponse).data.path;
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
      toast.error("입력값 검증 실패");
      break;
    case 401:
      toast.error("유효하지 않은 JWT 토큰. 다시 로그인 해주세요");
      break;
    case 403:
      toast.error("강의 소유 권한이 없습니다. 다시 확인해 주세요");
  }
  return { status: response.status, ...(await response.json()) };
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
) {
  if (problemType === "blank") {
    if (!parsed_code_elements) {
      toast.error("빈칸 문제에는 빈칸정보가 필요합니다");
      return { status: 400 };
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
      toast.error("입력값 검증 실패");
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
  return { status: response.status };
}

export async function deleteProblem(problemId: number, token: string) {
  const response = await fetch(`${API_SERVER_URL}/problem/${problemId}`, {
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
      toast.error("해당 문제 ID가 존재하지 않습니다");
      break;
    case 500:
      toast.error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
      break;
  }
  return { status: response.status };
}
