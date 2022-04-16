import type { MetaFunction, LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import globalStyles from "~/styles/global.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export let links: LinksFunction = () => [
  {
    rel: "preload",
    as: "font",
    href: "/fonts/fieldwork-900.woff2",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    as: "font",
    href: "/fonts/fieldwork-800.woff2",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    as: "font",
    href: "/fonts/fieldwork-700.woff2",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    as: "font",
    href: "/fonts/fieldwork-600.woff2",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    as: "font",
    href: "/fonts/fieldwork-400.woff2",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    as: "font",
    href: "/fonts/fieldwork-300.woff2",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    as: "font",
    href: "/fonts/fieldwork-200.woff2",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    as: "font",
    href: "/fonts/fieldwork-100.woff2",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },

  { rel: "stylesheet", href: globalStyles },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
