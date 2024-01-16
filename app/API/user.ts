const API_SERVER_URL = "http://155.230.34.223:53469/api/v1";

interface loginResponse {
  status: number;
  message: string;
  data: {
    token: string;
  };
}

interface getUserInfoResponse {
  status: number;
  message: string;
  data: {
    id: string;
    is_admin: boolean;
    name: string;
    role: string;
  };
}

interface changePasswordResponse {
  status: number;
  message: string;
}

export async function login(
  id: string,
  password: string
): Promise<loginResponse> {
  const response = await fetch(`${API_SERVER_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, password }),
  });

  return { ...(await response.json()), status: response.status };
}

export async function getUserInfo(
  userId: string,
  token: string
): Promise<getUserInfoResponse> {
  const response = await fetch(`${API_SERVER_URL}/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return { ...(await response.json()), status: response.status };
}

export async function changePassword(
  user_id: string,
  token: string,
  old_password: string,
  new_password: string
): Promise<changePasswordResponse> {
  const response = await fetch(`${API_SERVER_URL}/user/${user_id}/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ old_password, new_password }),
  });

  return { ...(await response.json()), status: response.status };
}

export async function resetPassword(
  user_id: string,
  token: string
): Promise<changePasswordResponse> {
  const response = await fetch(`${API_SERVER_URL}/user/${user_id}/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ new_password: "password" }),
  });

  return { ...(await response.json()), status: response.status };
}

export async function deleteUser(user_id: string, token: string) {
  const response = await fetch(`${API_SERVER_URL}/user/${user_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return { ...(await response.json()), status: response.status };
}

export async function addUser(
  id: string,
  is_admin: boolean,
  name: string,
  role: string,
  token: string
) {
  const response = await fetch(`${API_SERVER_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, is_admin, name, role }),
  });
  return { ...(await response.json()), status: response.status };
}
