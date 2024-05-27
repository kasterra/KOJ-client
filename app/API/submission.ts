import { API_SERVER_URL } from "~/util/constant";
import { removePackageStatementFromFile, handle401 } from "~/util";
import {
  BoardResponse,
  EmptyResponse,
  SubmissionResponse,
  SubmissionsResponse,
} from "~/types/APIResponse";
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  RequestTooLongError,
} from "~/util/errors";
import { cp949ToUTF8 } from "~/util/file";

export async function submit(
  token: string,
  problem_id: string,
  formdata: FormData
): Promise<SubmissionResponse> {
  if (formdata.get("language") === "c") {
    const fileList = formdata.getAll("codes") as File[];
    if (fileList.length > 0) {
      formdata.delete("codes");
      const processedFiles = await Promise.all(
        fileList.map(async (file) => {
          return await cp949ToUTF8(file);
        })
      );
      processedFiles.forEach((file) => formdata.append("codes", file));
    }
  }
  if (formdata.get("language") === "java") {
    const fileList = formdata.getAll("codes") as File[];
    const code = formdata.get("code") as string;
    if (fileList.length > 0) {
      formdata.delete("codes");
      const processedFiles = await Promise.all(
        fileList.map(async (file) => {
          return await removePackageStatementFromFile(file);
        })
      );
      processedFiles.forEach((file) => formdata.append("codes", file));
    } else if (code !== "") {
      formdata.delete("code");
      formdata.set("code", code.replaceAll(/package.*;/g, ""));
    }
  }
  const response = await fetch(
    `${API_SERVER_URL}/problem/${problem_id}/submission`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formdata,
    }
  );
  switch (response.status) {
    case 400:
      throw new BadRequestError("JWT토큰이 없거나 입력값 검증 실패");
      break;
    case 401:
      handle401();
      break;
    case 403:
      throw new ForbiddenError("소속되어 있지 않은 강의의 문제 접근");
      break;
    case 404:
      throw new NotFoundError("problem_id가 존재하지 않습니다");
      break;
    case 413:
      throw new RequestTooLongError("Request too long");
      break;
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
  }
  return await response.json();
}

export async function getSubmissionWithSubmissionId(
  submissionId: number,
  token: string
): Promise<SubmissionResponse> {
  const response = await fetch(`${API_SERVER_URL}/submission/${submissionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  switch (response.status) {
    case 400:
      throw new BadRequestError("JWT토큰이 없거나 입력값 검증 실패");
      break;
    case 401:
      handle401();
      break;
  }
  return await response.json();
}

export async function getSubmissionStatus(
  token: string,
  queryParams: {
    user_id?: string;
    lecture_id?: string | number;
    practice_id?: string | number;
    problem_id?: number;
  }
): Promise<SubmissionsResponse> {
  const searchParams = new URLSearchParams();
  if (queryParams.user_id !== undefined) {
    searchParams.append("user_id", queryParams.user_id);
  }
  if (queryParams.lecture_id !== undefined) {
    searchParams.append("lecture_id", queryParams.lecture_id.toString());
  }
  if (queryParams.practice_id !== undefined) {
    searchParams.append("practice_id", queryParams.practice_id.toString());
  }
  if (queryParams.problem_id !== undefined) {
    searchParams.append("problem_id", queryParams.problem_id.toString());
  }
  const response = await fetch(
    `${API_SERVER_URL}/submission_status?${searchParams.toString()}`,
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
      throw new BadRequestError("JWT토큰이 없거나 입력값 검증 실패");
      break;
    case 401:
      handle401();
      break;
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
  }
  return await response.json();
}

export async function getLectureScoreBoard(
  token: string,
  lecture_id: string | number
): Promise<BoardResponse> {
  const response = await fetch(
    `${API_SERVER_URL}/lecture/${lecture_id}/score`,
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
      throw new BadRequestError("JWT토큰이 없거나 입력값 검증 실패");
      break;
    case 401:
      handle401();
      break;
    case 403:
      throw new ForbiddenError("소속되지 않은 강의의 스코어보드 접근");
      break;
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
  }
  return await response.json();
}

export async function getPracticeScoreBoard(
  token: string,
  practice_id: number | string
): Promise<BoardResponse> {
  const response = await fetch(
    `${API_SERVER_URL}/practice/${practice_id}/score`,
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
      throw new BadRequestError("JWT토큰이 없거나 입력값 검증 실패");
      break;
    case 401:
      handle401();
      break;
    case 403:
      throw new ForbiddenError("소속되지 않은 강의의 스코어보드 접근");
      break;
    case 404:
      throw new NotFoundError("존재하지 않는 강의");
      break;
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
  }
  return await response.json();
}

export async function reJudge(
  token: string,
  queryParams: {
    user_id?: string;
    practice_id?: number;
    problem_id?: number;
  }
): Promise<EmptyResponse> {
  const response = await fetch(`${API_SERVER_URL}/re_judge`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(queryParams),
  });

  switch (response.status) {
    case 400:
      throw new BadRequestError("JWT토큰이 없거나 입력값 검증 실패");
      break;
    case 401:
      handle401();
      break;
    case 403:
      throw new ForbiddenError("권한이 부족합니다");
      break;
    case 404:
      throw new NotFoundError("존재하지 않는 항목");
      break;
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
  }
  return await response.json();
}
