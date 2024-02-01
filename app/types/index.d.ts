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

export type lanugage =
  | "plaintext"
  | "python"
  | "java"
  | "javascript"
  | "c"
  | "cpp";
