import { Outlet, useNavigate } from "@remix-run/react";
import { useEffect } from "react";

const ProctedRoute = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (
      sessionStorage.getItem("authToken") &&
      sessionStorage.getItem("authToken")!.length < 10
    ) {
      alert("로그인을 하고 접속하십시오");
      navigate("/");
    }
  }, []);

  return <Outlet />;
};

export default ProctedRoute;
