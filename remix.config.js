import { flatRoutes } from "remix-flat-routes";

/**
 * @type {import("@remix-run/dev").AppConfig}
 */
export default {
  // ignore all files in routes folder to prevent
  // default remix convention from picking up routes
  ignoredRouteFiles: ["**/*"],
  routes: async (defineRoutes) => {
    return flatRoutes("routes", defineRoutes);
  },
};
