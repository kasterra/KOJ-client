import toast from "react-hot-toast";

const API_SERVER_URL = "http://155.230.34.223:53469/api/v1";

export async function submit(
  token: string,
  problem_id: string,
  formdata: FormData
) {
  const response = await fetch(
    `${API_SERVER_URL}/problem/${problem_id}/submission`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formdata,
    }
  );
  switch (response.status) {
    case 400:
      toast.error("JWT토큰이 없거나 입력값 검증 실패");
      break;
    case 401:
      toast.error("유효하지 않은 JWT 토큰. 다시 로그인 하세요");
      break;
    case 403:
      toast.error("소속되어 있지 않은 강의의 문제 접근");
      break;
    case 404:
      toast.error("problem_id가 존재하지 않습니다");
      break;
    case 413:
      toast.error("Request too long");
      break;
  }
  return { ...(await response.json()), status: response.status };
}

export async function getSubmissionWithSubmissionId(
  submissionId: number,
  token: string
) {
  const response = await fetch(`${API_SERVER_URL}/submission/${submissionId}`, {
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
      toast.error("유효하지 않은 JWT 토큰. 다시 로그인 하세요");
      break;
  }
  return { ...(await response.json()), status: response.status };
}

export async function getSubmissionStatus(
  token: string,
  queryParams: {
    user_id?: string;
    lecture_id?: string | number;
    practice_id?: number;
    problem_id?: number;
  }
) {
  const searchParams = new URLSearchParams();
  if (queryParams.user_id !== undefined) {
    searchParams.append("user_id", queryParams.user_id);
  }
  if (queryParams.lecture_id !== undefined) {
    searchParams.append("lecture_id", queryParams.lecture_id.toString());
  }
  if (queryParams.practice_id !== undefined) {
    searchParams.append("practice_id", queryParams.practice_id.toString());
  }
  if (queryParams.problem_id !== undefined) {
    searchParams.append("problem_id", queryParams.problem_id.toString());
  }
  const response = await fetch(
    `${API_SERVER_URL}/submission_status?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  switch (response.status) {
    case 400:
      toast.error("JWT토큰이 없거나 입력값 검증 실패");
      break;
    case 401:
      toast.error("유효하지 않은 JWT 토큰. 다시 로그인 하세요");
      break;
  }
  return { ...(await response.json()), status: response.status };
}

export async function getLectureScoreBoard(
  token: string,
  lecture_id: string | number
) {
  const response = await fetch(
    `${API_SERVER_URL}/lecture/${lecture_id}/score`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  switch (response.status) {
    case 400:
      toast.error("JWT토큰이 없거나 입력값 검증 실패");
      break;
    case 401:
      toast.error("유효하지 않은 JWT 토큰. 다시 로그인 하세요");
      break;
    case 403:
      toast.error("소속되지 않은 강의의 스코어보드 접근");
      break;
  }
  return { ...(await response.json()), status: response.status };
}

export async function getPracticeScoreBoard(
  token: string,
  practice_id: number | string
) {
  const response = await fetch(
    `${API_SERVER_URL}/practice/${practice_id}/score`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  switch (response.status) {
    case 400:
      toast.error("JWT토큰이 없거나 입력값 검증 실패");
      break;
    case 401:
      toast.error("유효하지 않은 JWT 토큰. 다시 로그인 하세요");
      break;
    case 403:
      toast.error("소속되지 않은 강의의 스코어보드 접근");
      break;
    case 404:
      toast.error("존재하지 않는 강의");
      break;
  }
  return { ...(await response.json()), status: response.status };
}
