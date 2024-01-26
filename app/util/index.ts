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
      semesterNumber = 1;
      break;
    case "2":
      semesterNumber = 2;
      break;
    case "겨울":
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
