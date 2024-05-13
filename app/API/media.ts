import { API_SERVER_URL } from "~/util/constant";
import toast from "react-hot-toast";
import { UploadFileResponse } from "~/types/APIResponse";

export async function uploadFile(
  file: File,
  token: string
): Promise<UploadFileResponse> {
  if (!file) {
    toast.error("File이 유효하지 않습니다. 다시 확인해주세요");
    return { message: "declined by FE", status: 400 };
  }
  if (file.size > 1024 * 1024 * 30) {
    toast.error("파일이 30MB이상입니다. 너무 파일이 큽니다");
    return { message: "declined by FE", status: 413 };
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
  switch (response.status) {
    case 400:
      toast.error("uploadFile은 하나의 파일만 업로드 가능합니다");
      break;
    case 401:
      toast.error("유효하지 않은 JWT 토큰. 다시 로그인 해주세요");
      break;
    case 413:
      toast.error("파일이 너무 큽니다.");
      break;
    case 500:
      toast.error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
      break;
  }
  return { ...(await response.json()), status: response.status };
}
