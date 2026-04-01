"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertTrustedSender = void 0;
const trustedPrefixes = ["app://renderer/"];
const isTrustedUrl = (url) => {
    return trustedPrefixes.some((prefix) => url.startsWith(prefix));
};
const assertTrustedSender = (event) => {
    const senderUrl = event.senderFrame?.url ?? "";
    if (!isTrustedUrl(senderUrl)) {
        throw new Error("Untrusted IPC sender.");
    }
};
exports.assertTrustedSender = assertTrustedSender;
