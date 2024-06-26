import toast from "react-hot-toast";
import { language } from "~/types";

export function semesterToString(semester: number) {
  switch (semester) {
    case 0:
      return "1";
    case 1:
      return "S";
    case 2:
      return "2";
    case 3:
      return "W";
    default:
      throw new Error(`Invalid semester ${semester}`);
  }
}

export function semesterNumberToString(yearSemester: number) {
  return `${(yearSemester / 10).toFixed(0)}-${semesterToString(
    yearSemester % 10
  )}`;
}

export function formatLectureInfo(title: string, semester: number) {
  return `${title} ${semesterNumberToString(semester)}`;
}

export function mapRoleToString(role: string) {
  switch (role) {
    case "student":
      return "학생";
    case "tutor":
      return "튜터";
    case "professor":
      return "교수";
  }
}

export function semesterStringToNumber(yearStr: string, semesterStr: string) {
  let semesterNumber: number;
  switch (semesterStr) {
    case "1":
      semesterNumber = 0;
      break;
    case "여름":
    case "S":
      semesterNumber = 1;
      break;
    case "2":
      semesterNumber = 2;
      break;
    case "겨울":
    case "W":
      semesterNumber = 3;
      break;
    default:
      throw new Error(`Invalid semester string "${semesterStr}"`);
  }
  return parseInt(yearStr) * 10 + semesterNumber;
}

export function toLocalDateTimeString(date: Date) {
  const ten = (i: number) => (i < 10 ? "0" : "") + i;

  const YYYY = date.getFullYear();
  const MM = ten(date.getMonth() + 1);
  const DD = ten(date.getDate());
  const HH = ten(date.getHours());
  const mm = ten(date.getMinutes());

  return `${YYYY}-${MM}-${DD}T${HH}:${mm}`;
}

export function remainingTimeToString(time: number) {
  const day = Math.floor(time / 86400);
  const hour = Math.floor((time % 86400) / 3600);
  const minute = Math.floor((time % 3600) / 60);
  let ret = "";
  if (day > 0) ret += `${day}일  \n`;
  if (hour > 0) ret += `${hour}시간  \n`;
  if (minute > 0) ret += `${minute}분`;
  if (ret === "") ret = "제출 기한 경과!";
  return ret;
}

export function handle401() {
  toast.error("세션이 만료되었습니다. 다시 로그인 해주세요");
  sessionStorage.clear();
  window.location.href = "/";
}

export function removePackageStatementFromFile(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const content = reader.result as string;
      const updatedContent = content.replace(/package\s+[\w\.]+;/g, "");

      resolve(
        new File([updatedContent], file.name, {
          type: file.type,
        })
      );
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.readAsText(file);
  });
}

export function bytesToSize(bytes: number) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "n/a";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

export const problemTitles: { [key: string]: string } = {
  blank: "빈칸 채우기",
  solving: "문제 해결",
  class_implementation: "클래스 구현",
};

export function readFileAsServerFormat(
  file: File
): Promise<{ content: string; name: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        content: reader.result as string,
        name: file.name,
      });
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function getCodeFileExtension(language: language) {
  switch (language) {
    case "c":
      return "c";
    case "java":
      return "java";
    case "python":
      return "py";
    case "javascript":
      return "js";
    case "cpp":
      return "cpp";
    case "plaintext":
      return "txt";
    default:
      throw new Error(`Invalid language ${language}`);
  }
}

export function safeParseInt(input: string) {
  const parsed = parseInt(input);
  if (isNaN(parsed)) {
    throw Error(`Invalid integer ${input}`);
  }
  return parsed;
}
