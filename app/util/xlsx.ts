import ExcelJS from "exceljs";
import { studentRow } from "~/types";

export async function parseXlsx(file: File): Promise<studentRow[]> {
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
