import { Outlet, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "~/components/Header";
import { useAuth } from "~/contexts/AuthContext";
import { LectureDataProvider } from "~/contexts/LectureDataContext";

const ProctedRoute = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [authContextIsLoading, setAuthContextIsLoading] = useState(
    auth.token === "" && auth.userId === ""
  );

  useEffect(() => {
    if (
      !sessionStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken")!.length < 10
    ) {
      toast.error("로그인을 하고 접속하십시오");
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (authContextIsLoading)
      setAuthContextIsLoading(auth.token === "" && auth.userId === "");
  });

  return authContextIsLoading ? null : (
    <LectureDataProvider>
      <Header />
      <Outlet />
    </LectureDataProvider>
  );
};

export default ProctedRoute;
