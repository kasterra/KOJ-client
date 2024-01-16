import { ReactNode } from "react";

export type TableRow = Map<string, ReactNode>;

export interface Lecture {
  name: string;
  code: string;
}

export interface User {
  name: string;
  ID: string;
  role: string;
}
