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
      throw new Error("Invalid semester");
  }
}

export function formatLectureInfo(title: string, semester: number) {
  return `${title} (${(semester / 10).toFixed(0)}-${semesterToString(
    semester % 10
  )})`;
}

export function mapRoleToString(role: string) {
  switch (role) {
    case "student":
      return "학생";
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
      throw new Error("Invalid semester string");
  }
  return parseInt(yearStr) * 10 + semesterNumber;
}
