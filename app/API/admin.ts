import { API_SERVER_URL } from "~/util/constant";
import { handle401 } from "~/util";
import { EmptyResponse } from "~/types/APIResponse";
import { BadRequestError, ForbiddenError } from "~/util/errors";

export async function setSemester(
  semester: number,
  token: string
): Promise<EmptyResponse> {
  const response = await fetch(`${API_SERVER_URL}/semester`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ semester }),
  });

  switch (response.status) {
    case 400:
      throw new BadRequestError("JWT토큰이 없거나 입력값 검증 실패");
      break;
    case 401:
      handle401();
      break;
    case 403:
      throw new ForbiddenError("관리자만 접근할 수 있는 API 입니다");
      break;
  }
  return { ...(await response.json()), status: response.status };
}

export async function getSemester(
  token: string
): Promise<{ semester: number }> {
  const response = await fetch(`${API_SERVER_URL}/semester`, {
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
    case 403:
      throw new ForbiddenError("관리자만 접근할 수 있는 API 입니다");
      break;
  }
  return { ...(await response.json()), status: response.status };
}
