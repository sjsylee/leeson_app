import path from "path";
import { net, protocol } from "electron";
import { pathToFileURL } from "url";

protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true,
    },
  },
]);

const resolveRendererPath = (appPath: string, pathname: string): string => {
  const normalizedPath = pathname === "/" ? "/home" : pathname;
  const cleanedPath = normalizedPath.replace(/^\//, "");
  const outDir = path.join(appPath, "renderer", "out");

  if (cleanedPath.startsWith("_next/")) {
    return path.join(outDir, cleanedPath);
  }

  if (cleanedPath.includes(".")) {
    return path.join(outDir, cleanedPath);
  }

  return path.join(outDir, `${cleanedPath}.html`);
};

export const registerRendererProtocol = (appPath: string): void => {
  protocol.handle("app", (request) => {
    const url = new URL(request.url);
    const filePath = resolveRendererPath(appPath, url.pathname);

    return net.fetch(pathToFileURL(filePath).toString());
  });
};

export const getRendererPageUrl = (pageName: string): string => {
  return `app://renderer/${pageName}`;
};
