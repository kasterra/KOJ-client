import { ReactNode } from "react";

export type TableRow = Map<string, ReactNode>;

export interface User {
  name: string;
  ID: string;
  role: string;
}

export interface Lecture {
  id: number;
  title: string;
  language: string;
  code: string;
  semester: number;
}

export interface studentRow {
  userId: string;
  isTutor: boolean;
  userName: string;
}

export type language =
  | "plaintext"
  | "python"
  | "java"
  | "javascript"
  | "c"
  | "cpp";

export type judgeStatus =
  | "accepted"
  | "time_limit"
  | "memory_limit"
  | "wrong_answer"
  | "runtime_error"
  | "compile_error"
  | "pending"
  | "running"
  | "internal_error";

export interface ServerSideFile {
  name: string;
  content: string;
}
