import { Outlet, useNavigate } from "@remix-run/react";
import { useEffect } from "react";

const NoAuthOnlyRoute = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (
      sessionStorage.getItem("authToken") &&
      sessionStorage.getItem("authToken")!.length > 10
    ) {
      navigate("/lectures");
    }
  }, []);

  return <Outlet />;
};

export default NoAuthOnlyRoute;
