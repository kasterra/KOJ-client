import type { LinksFunction } from "@remix-run/node";
import normailzeCSS from "./css/normalize.css?url";
import fontsCSS from "./css/fonts.css?url";
import globalCSS from "./css/global.css?url";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import { CLIENT_SERVER_URL } from "./util/constant";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: normailzeCSS },
  { rel: "stylesheet", href: fontsCSS },
  { rel: "stylesheet", href: globalCSS },
];

export default function App() {
  const location = useLocation();
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="og:image"
          content={`${CLIENT_SERVER_URL}/images/og-image.jpg`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="850" />
        <meta http-equiv="Copyright" content="skeep and kasterra" />
        

        <meta
          name="og:description"
          content="경북대에서 만든 교육용 다기능 온라인 저지"
        />
        <script src="/prism.js" />
        <script defer data-domain="koj.kasterra.dev" src="https://koj-admin.kasterra.dev/js/script.js"/>
        <Meta />
        <Links />
      </head>
      <body>
        <AuthProvider>
          <Toaster />
          <Outlet />
        </AuthProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
