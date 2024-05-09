import { codeHoles } from "~/util/codeHole";
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

export interface SuccessPracticeDetailResponse {
  status: 200;
  message: string;
  data: SimplePracticeDetail;
}

export interface SuccessAllPracticesResponse {
  status: 200;
  message: string;
  data: AllPracticeType[];
}

export interface SuccessProblemDetailResponse {
  status: 200;
  message: string;
  data: SimpleProblemDetail;
}

export interface SuccessUploadFileResponse {
  status: 200;
  message: string;
  data: {
    path: string;
  };
}

export interface SuccessTestcaseResponse {
  status: 200;
  message: string;
  data: TestcaseType;
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
  start_time: string;
  end_time: string;
  problems: {
    id: number;
    title: string;
  }[];
}

export interface SimpleProblemDetail {
  id: number;
  file_path: string;
  title: string;
  memory_limit: number;
  parsed_code_elements: codeHoles;
  testcases: {
    id: number;
    title: string;
  }[];
  time_limit: number;
  type: "solving" | "blank";
  start_time: string;
  end_time: string;
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

export interface AllPracticeType {
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

export interface TestcaseType {
  argv?: string;
  file_inputs?: string[];
  file_outputs?: string[];
  id: number;
  is_visible: boolean;
  score: number;
  stdin: string;
  stdout: string;
  title: string;
}

export type UserResponse = SuccessUserResponse | FailedResponse;

export type UserSearchResponse = SuccessUserSearchResponse | FailedResponse;

export type LecturesResponse = SuccessLecturesResponse | FailedResponse;

export type AllPracticeResponse = SuccessAllPracticesResponse | FailedResponse;

export type UploadFileResponse = SuccessUploadFileResponse | FailedResponse;

export type TestcaseResponse = SuccessTestcaseResponse | FailedResponse;

export type ProblemDetailResponse =
  | SuccessProblemDetailResponse
  | FailedResponse;
export type PracticeDetailResponse =
  | SuccessPracticeDetailResponse
  | FailedResponse;

export function isSuccessResponse(
  response:
    | UserResponse
    | UserSearchResponse
    | LecturesResponse
    | PracticeDetailResponse
    | AllPracticeResponse
    | TestcaseResponse
): response is
  | SuccessUserResponse
  | SuccessUserSearchResponse
  | SuccessLecturesResponse
  | PracticeDetailResponse
  | SuccessAllPracticesResponse
  | SuccessTestcaseResponse {
  return response.status < 300;
}
