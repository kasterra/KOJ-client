import { Outlet, useNavigate } from "@remix-run/react";
import { useEffect } from "react";

const ProctedRoute = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (
      sessionStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken")!.length < 8
    ) {
      navigate("/lectures");
    }
  });

  return <Outlet />;
};

export default ProctedRoute;
