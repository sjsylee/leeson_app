import { createHmac } from "crypto";

const pad = (value: number): string => {
  return String(value).padStart(2, "0");
};

const toSignedDate = (date: Date): string => {
  const year = pad(date.getUTCFullYear() % 100);
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
};

export const createCoupangAuthorizationHeader = ({
  accessKey,
  secretKey,
  method,
  path,
  query,
}: {
  accessKey: string;
  secretKey: string;
  method: string;
  path: string;
  query: string;
}): string => {
  const signedDate = toSignedDate(new Date());
  const message = `${signedDate}${method.toUpperCase()}${path}${query}`;
  const signature = createHmac("sha256", secretKey).update(message, "utf8").digest("hex");

  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${signedDate}, signature=${signature}`;
};
