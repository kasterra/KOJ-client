import { API_SERVER_URL } from "~/util/constant";
import toast from "react-hot-toast";

export async function setSemester(semester: number, token: string) {
  const response = await fetch(`${API_SERVER_URL}/semester`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ semester }),
  });

  switch (response.status) {
    case 400:
      toast.error("JWT토큰이 없거나 입력값 검증 실패");
      break;
    case 401:
      toast.error("유효하지 않은 JWT 토큰");
      break;
    case 403:
      toast.error("관리자만 접근할 수 있는 API 입니다");
      break;
  }
  return { ...(await response.json()), status: response.status };
}

export async function getSemester(token: string) {
  const response = await fetch(`${API_SERVER_URL}/semester`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  switch (response.status) {
    case 400:
      toast.error("JWT토큰이 없거나 입력값 검증 실패");
      break;
    case 401:
      toast.error("유효하지 않은 JWT 토큰");
      break;
    case 403:
      toast.error("관리자만 접근할 수 있는 API 입니다");
      break;
  }
  return { ...(await response.json()), status: response.status };
}
