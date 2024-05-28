import ExcelJS from "exceljs";
import { studentRow } from "~/types";
import { UserEntity } from "~/types/APIResponse";

export async function parseLectureMemberXlsx(
  file: File
): Promise<studentRow[]> {
  try {
    const workbook = new ExcelJS.Workbook();
    const buffer = await file.arrayBuffer();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.worksheets[0];

    const ARow = worksheet.getColumn("A");
    const idList = ARow.values
      .filter((_, idx) => idx > 1)
      .map((val) => String(val)) as string[];
    const BRow = worksheet.getColumn("B");
    const nameList = BRow.values.filter((_, idx) => idx > 1) as string[];
    const CRow = worksheet.getColumn("C");
    const isTutorList = CRow.values
      .filter((_, idx) => idx > 1)
      .map((value) => (value === "튜터" ? true : false));

    const listLength = idList.length;

    const ret: studentRow[] = [];
    for (let i = 0; i < listLength; ++i) {
      ret.push({
        userId: idList[i],
        userName: nameList[i] + "",
        isTutor: isTutorList[i],
      });
    }
    return ret;
  } catch (error) {
    console.error(error);
  }
  return [];
}

export async function createQuizResultXlsx(users: UserEntity[]) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1", {
    properties: {
      defaultColWidth: 10,
    },
  });

  worksheet.getCell("A1").value = "▶ 서식에서 열은 자유롭게 추가 가능합니다";
  worksheet.getCell("A4").value = "학생 명";
  worksheet.getCell("B4").value = "Q1";

  worksheet.getCell("A5").value = "문제별 만점";
  for (let i = 0; i < users.length; ++i) {
    worksheet.getCell(`A${6 + i}`).value = users[i].name;
  }

  return new File([await workbook.xlsx.writeBuffer()], "quizResultForm.xlsx");
}

export async function parseQuizResultXlsx(file: File) {
  let result: (number | "n")[][] = [];
  try {
    const workbook = new ExcelJS.Workbook();
    const buffer = await file.arrayBuffer();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.worksheets[0];

    const numberOfProblems = worksheet.columnCount - 1;
    const numberOfDataRow = worksheet.rowCount - 4;

    result = Array.from({ length: numberOfDataRow }, () =>
      Array.from({ length: numberOfProblems })
    );

    for (let i = 1; i <= numberOfProblems; ++i) {
      const curColumn = worksheet.getColumn(i + 1);
      const scoreList = curColumn.values.filter(
        (val) => val === "n" || typeof val === "number"
      ) as (number | "n")[];

      scoreList.forEach((val, idx) => {
        result[idx][i - 1] = val;
      });
    }
  } catch (error) {
    console.error(error);
  }
  return result;
}
