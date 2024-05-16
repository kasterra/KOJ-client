import { API_SERVER_URL } from "~/util/constant";
import toast from "react-hot-toast";
import { removePackageStatementFromFile, handle401 } from "~/util";

export async function submit(
  token: string,
  problem_id: string,
  formdata: FormData
) {
  if (formdata.get("language") === "java") {
    const fileList = formdata.getAll("codes") as File[];
    const code = formdata.get("code") as string;
    if (fileList.length > 0) {
      formdata.delete("codes");
      const processedFiles = await Promise.all(
        fileList.map(async (file) => await removePackageStatementFromFile(file))
      );

      processedFiles.forEach((file) => formdata.append("codes", file));
    } else if (code !== "") {
      formdata.delete("code");
      formdata.set("code", code.replaceAll(/package.*;/g, ""));
    }
  }
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
      handle401();
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
      handle401();
      break;
  }
  return { ...(await response.json()), status: response.status };
}

export async function getSubmissionStatus(
  token: string,
  queryParams: {
    user_id?: string;
    lecture_id?: string | number;
    practice_id?: string | number;
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
      handle401();
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
      handle401();
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
      handle401();
      break;
    case 403:
      toast.error("소속되지 않은 강의의 스코어보드 접근");
      break;
    case 404:
      toast.error("아직 미구현 되어있다고 하네요");
      break;
  }
  return { ...(await response.json()), status: response.status };
}

export async function reJudge(
  token: string,
  queryParams: {
    user_id?: string;
    practice_id?: number;
    problem_id?: number;
  }
): Promise<{ status: number; message: string }> {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(`${API_SERVER_URL}/re_judge`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(queryParams),
    });

    switch (response.status) {
      case 400:
        toast.error("JWT토큰이 없거나 입력값 검증 실패");
        reject(400);
        break;
      case 401:
        handle401();
        reject(401);
        break;
      case 403:
        toast.error("권한이 부족합니다");
        reject(403);
        break;
      case 404:
        toast.error("존재하지 않는걸 재채점 한다고 하네요");
        reject(404);
        break;
    }
    resolve({ ...(await response.json()), status: response.status });
  });
}
