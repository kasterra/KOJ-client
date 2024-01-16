export interface UserEntity {
  id: string;
  is_admin: boolean;
  name: string;
  role: string;
}

export interface SuccessUserSearchResponse {
  status: 200;
  message: string;
  data: UserEntity[];
}

export interface SuccessUserResponse {
  status: 200;
  message: string;
  data: UserEntity;
}

interface FailedResponse {
  status: number;
  message: string;
}

export type UserResponse = SuccessUserResponse | FailedResponse;

export type UserSearchRespnse = SuccessUserSearchResponse | FailedResponse;

export function isResponseSuccess(
  response: UserResponse
): response is SuccessUserResponse {
  return response.status === 200;
}
