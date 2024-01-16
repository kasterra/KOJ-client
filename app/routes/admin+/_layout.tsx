import { Outlet, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getUserInfo } from "~/API/user";
import Header from "~/components/Header";
import { useAuth } from "~/contexts/AuthContext";

const ProctedRoute = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [contextIsLoading, setContextIsLoading] = useState(
    auth.token === "" && auth.userId === ""
  );

  const [isNotAdmin, setIsNotAdmin] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    const userId = sessionStorage.getItem("userId");
    if (!token || !userId) {
      setIsNotAdmin(true);
      return;
    }
    getUserInfo(userId, token).then(({ status, data }) => {
      console.log(token, userId);
      if (status !== 200 || data.is_admin === false) {
        setIsNotAdmin(true);
        return;
      }
    });
  }, []);

  useEffect(() => {
    if (
      !sessionStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken")!.length < 10 ||
      isNotAdmin
    ) {
      toast.error("관리자만 접속할 수 있는 페이지 입니다");
      navigate("/");
    }
  }, [isNotAdmin]);

  useEffect(() => {
    if (contextIsLoading)
      setContextIsLoading(auth.token === "" && auth.userId === "");
  });

  return contextIsLoading ? null : (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default ProctedRoute;
