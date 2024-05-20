import { API_SERVER_URL } from "~/util/constant";
import { UploadFileResponse } from "~/types/APIResponse";
import {
  BadRequestError,
  InternalServerError,
  RequestTooLongError,
} from "~/util/errors";
import { handle401 } from "~/util";

export async function uploadFile(
  file: File,
  token: string
): Promise<UploadFileResponse> {
  if (!file) {
    throw new BadRequestError("File이 유효하지 않습니다. 다시 확인해주세요");
  }
  if (file.size > 1024 * 1024 * 30) {
    throw new RequestTooLongError("파일이 30MB이상입니다. 너무 파일이 큽니다");
  }
  const formData = new FormData();
  formData.append("documents", file);
  const response = await fetch(`${API_SERVER_URL}/media/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  switch (response.status) {
    case 400:
      throw new BadRequestError("uploadFile은 하나의 파일만 업로드 가능합니다");
      break;
    case 401:
      handle401();
      break;
    case 413:
      throw new RequestTooLongError("파일이 너무 큽니다.");
    case 500:
      throw new InternalServerError(
        "서버 에러가 발생했습니다. 관리자에게 문의해 주세요"
      );
      break;
  }
  return data;
}
