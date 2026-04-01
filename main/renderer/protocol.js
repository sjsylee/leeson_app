"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRendererPageUrl = exports.registerRendererProtocol = void 0;
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const url_1 = require("url");
electron_1.protocol.registerSchemesAsPrivileged([
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
const resolveRendererPath = (appPath, pathname) => {
    const normalizedPath = pathname === "/" ? "/home" : pathname;
    const cleanedPath = normalizedPath.replace(/^\//, "");
    const outDir = path_1.default.join(appPath, "renderer", "out");
    if (cleanedPath.startsWith("_next/")) {
        return path_1.default.join(outDir, cleanedPath);
    }
    if (cleanedPath.includes(".")) {
        return path_1.default.join(outDir, cleanedPath);
    }
    return path_1.default.join(outDir, `${cleanedPath}.html`);
};
const registerRendererProtocol = (appPath) => {
    electron_1.protocol.handle("app", (request) => {
        const url = new URL(request.url);
        const filePath = resolveRendererPath(appPath, url.pathname);
        return electron_1.net.fetch((0, url_1.pathToFileURL)(filePath).toString());
    });
};
exports.registerRendererProtocol = registerRendererProtocol;
const getRendererPageUrl = (pageName) => {
    return `app://renderer/${pageName}`;
};
exports.getRendererPageUrl = getRendererPageUrl;
