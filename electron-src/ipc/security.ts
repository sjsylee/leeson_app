import type { IpcMainEvent, IpcMainInvokeEvent } from "electron";

const trustedPrefixes = ["app://renderer/"];

const isTrustedUrl = (url: string): boolean => {
  return trustedPrefixes.some((prefix) => url.startsWith(prefix));
};

export const assertTrustedSender = (
  event: IpcMainInvokeEvent | IpcMainEvent
): void => {
  const senderUrl = event.senderFrame?.url ?? "";

  if (!isTrustedUrl(senderUrl)) {
    throw new Error("Untrusted IPC sender.");
  }
};
