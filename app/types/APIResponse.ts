import { Lecture } from ".";

export interface UserEntity {
  id: string;
  is_admin: boolean;
  name: string;
  role: string;
}

export interface LectureEntity {
  code: string;
  id: number;
  language: string;
  semester: number;
  title: string;
  professor_name: string;
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

export interface SuccessLecturesResponse {
  status: 200;
  message: string;
  data: LectureEntity[];
}

export interface FailedResponse {
  status: number;
  message: string;
}

export interface SimpleLectureDetail extends Lecture {
  practices: {
    id: number;
    title: string;
  }[];
}

export interface SimplePracticeDetail {
  id: number;
  title: string;
  problems: {
    id: number;
    title: string;
  }[];
}

export interface SimpleProblemDetail {
  id: number;
  title: string;
  testcases: {
    id: number;
    title: string;
  }[];
}

export interface SemesterLecturePracticeDetail {
  semester: number;
  lectures: {
    id: number;
    title: string;
    language: string;
    code: string;
    semester: number;
    practices: {
      id: number;
      title: string;
    }[];
  }[];
}

export type UserResponse = SuccessUserResponse | FailedResponse;

export type UserSearchResponse = SuccessUserSearchResponse | FailedResponse;

export type LecturesResponse = SuccessLecturesResponse | FailedResponse;

export function isSuccessResponse(
  response: UserResponse | UserSearchResponse | LecturesResponse
): response is
  | SuccessUserResponse
  | SuccessUserSearchResponse
  | SuccessLecturesResponse {
  return response.status < 300;
}
