import { API_SERVER_URL } from "~/util/constant";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "~/util/errors";
import { handle401 } from "~/util";
import { EmptyResponse, UserSearchResponse } from "~/types/APIResponse";

interface loginResponse {
  message: string;
  data: {
    token: string;
  };
}

interface getUserInfoResponse {
  message: string;
  data: {
    id: string;
    is_admin: boolean;
    name: string;
    role: string;
  };
}

interface changePasswordResponse {
  message: string;
}

export async function login(
  id: string,
  password: string
): Promise<loginResponse> {
  const response = await fetch(`${API_SERVER_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, password }),
  });
  switch (response.status) {
    case 400:
      throw new BadRequestError("body가 유효한 JSON이 아님");
      break;
    case 401:
      throw new UnauthorizedError("PW 불일치");
      break;
    case 404:
      throw new NotFoundError("ID가 존재하지 않습니다");
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
  }
  return await response.json();
}

export async function getUserInfo(
  userId: string,
  token: string
): Promise<getUserInfoResponse> {
  const response = await fetch(`${API_SERVER_URL}/user/${userId}`, {
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
        "권한이 부족해 사용자 정보를 열람할 수 없습니다"
      );
    case 404:
      throw new NotFoundError("해당 ID의 사용자가 없습니다");
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
  }
  return await response.json();
}

export async function changePassword(
  user_id: string,
  token: string,
  old_password: string,
  new_password: string
): Promise<changePasswordResponse> {
  const response = await fetch(`${API_SERVER_URL}/user/${user_id}/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ old_password, new_password }),
  });
  switch (response.status) {
    case 401:
      handle401();
      break;
    case 403:
      throw new ForbiddenError(
        "권한이 부족합니다. 올바른 접근인지 확인해 주십시오"
      );
    case 404:
      throw new NotFoundError("해당 ID의 사용자가 없습니다");
    case 409:
      throw new ConflictError(
        "기존 PW와 일치하지 않습니다. 다시 확인해 주세요"
      );
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
  }
  if (response.status === 204) {
    return {} as changePasswordResponse;
  }
  return await response.json();
}

export async function resetPassword(
  user_id: string,
  token: string
): Promise<changePasswordResponse> {
  const response = await fetch(`${API_SERVER_URL}/user/${user_id}/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ new_password: "password" }),
  });
  switch (response.status) {
    case 401:
      handle401();
      break;
    case 403:
      throw new ForbiddenError(
        "권한이 부족합니다. 올바른 접근인지 확인해 주십시오"
      );
    case 404:
      throw new NotFoundError("해당 ID의 사용자가 없습니다");
    case 409:
      throw new ConflictError(
        "기존 PW와 일치하지 않습니다. 다시 확인해 주세요"
      );
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
  }
  if (response.status === 204) {
    return {} as changePasswordResponse;
  }
  return await response.json();
}

export async function deleteUser(
  user_id: string,
  token: string
): Promise<EmptyResponse> {
  const response = await fetch(`${API_SERVER_URL}/user/${user_id}`, {
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
      throw new ForbiddenError(
        "권한이 부족합니다. 올바른 접근인지 확인해 주십시오"
      );
    case 404:
      throw new NotFoundError("해당 ID의 사용자가 없습니다");
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
  }
  if (response.status === 204) {
    return {} as changePasswordResponse;
  }
  return await response.json();
}

export async function addUser(
  id: string,
  is_admin: boolean,
  name: string,
  role: string,
  token: string
): Promise<getUserInfoResponse> {
  const response = await fetch(`${API_SERVER_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, is_admin, name, role }),
  });
  switch (response.status) {
    case 401:
      handle401();
      break;
    case 403:
      throw new ForbiddenError(
        "권한이 부족합니다. 올바른 접근인지 확인해 주십시오"
      );
    case 404:
      throw new NotFoundError("해당 ID의 사용자가 없습니다");
    case 409:
      throw new ConflictError(
        "학번이 중복되는 사용자가 존재합니다. 다시 확인해 주세요"
      );
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
  }
  if (response.status === 204) {
    return {} as getUserInfoResponse;
  }
  return await response.json();
}

export async function searchUser(
  searchString: string,
  token: string
): Promise<UserSearchResponse> {
  const response = await fetch(
    `${API_SERVER_URL}/user?search=${searchString}`,
    {
      method: "GET",
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
      throw new ForbiddenError(
        "권한이 부족합니다. 올바른 접근인지 확인해 주십시오"
      );
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
  }
  if (response.status === 204) {
    return {} as UserSearchResponse;
  }
  return await response.json();
}
