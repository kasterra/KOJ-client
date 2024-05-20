import { codeHoles } from "~/util/codeHole";
import { Lecture, ServerSideFile, judgeStatus, lanugage } from ".";

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
  practices: SimplePracticeDetail[];
}

export interface UserSearchResponse {
  message: string;
  data: UserEntity[];
}

export interface UserResponse {
  message: string;
  data: UserEntity;
}

export interface LectureResponse {
  message: string;
  data: LectureEntity;
}

export interface LecturesResponse {
  message: string;
  data: LectureEntity[];
}

export interface PracticeDetailResponse {
  message: string;
  data: SimplePracticeDetail;
}

export interface AllPracticesResponse {
  message: string;
  data: AllPracticeType[];
}

export interface ProblemDetailResponse {
  message: string;
  data: SimpleProblemDetail;
}

export interface UploadFileResponse {
  message: string;
  data: {
    path: string;
  };
}

export interface TestcaseResponse {
  message: string;
  data: TestcaseType;
}

export interface EmptyResponse {
  message?: string;
}

export interface SubmissionResponse {
  message: string;
  data: Submission;
}

export interface SubmissionsResponse {
  message: string;
  data: Submission[];
}

export interface BoardResponse {
  message: string;
  data: Board;
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
  gain_score: number;
  total_score: number;
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
  argv?: string[];
  file_input?: ServerSideFile[];
  file_output?: ServerSideFile[];
  id: number;
  is_visible: boolean;
  score: number;
  stdin: string;
  stdout: string;
  title: string;
}

export interface Submission {
  codes: ServerSideFile[];
  created_at: string;
  entrypoint: string;
  id: number;
  language: lanugage;
  message: string;
  progress: number;
  status: judgeStatus;
  used_memory: number;
  used_time: number;
}

export interface Board {
  metadata: {
    id: number;
    score: number;
    title: string;
  }[];
  users: {
    id: string;
    name: string;
    scores: number[];
    total_score: number;
  }[];
}
