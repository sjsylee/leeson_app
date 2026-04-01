"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerIpc = void 0;
const registerDataIpc_1 = require("./registerDataIpc");
const registerSettingsIpc_1 = require("./registerSettingsIpc");
const registerWindowIpc_1 = require("./registerWindowIpc");
const registerIpc = (getMainWindow) => {
    (0, registerSettingsIpc_1.registerSettingsIpc)();
    (0, registerDataIpc_1.registerDataIpc)();
    (0, registerWindowIpc_1.registerWindowIpc)(getMainWindow);
};
exports.registerIpc = registerIpc;
