import keytar from "keytar";
import type {
  CoupangCredentialInput,
  DbCredentialInput,
  UnipassCredentialInput,
} from "../types/settings";

const serviceName = "com.leeson.app.db";
const userAccount = "db-user";
const passwordAccount = "db-password";
const coupangAccessKeyAccount = "coupang-access-key";
const coupangSecretKeyAccount = "coupang-secret-key";
const unipassKeyAccount = "unipass-key";

export const getStoredCredentials = async (): Promise<{
  user: string | null;
  password: string | null;
  coupangAccessKey: string | null;
  coupangSecretKey: string | null;
  unipassKey: string | null;
}> => {
  const [user, password, coupangAccessKey, coupangSecretKey, unipassKey] = await Promise.all([
    keytar.getPassword(serviceName, userAccount),
    keytar.getPassword(serviceName, passwordAccount),
    keytar.getPassword(serviceName, coupangAccessKeyAccount),
    keytar.getPassword(serviceName, coupangSecretKeyAccount),
    keytar.getPassword(serviceName, unipassKeyAccount),
  ]);

  return { user, password, coupangAccessKey, coupangSecretKey, unipassKey };
};

export const getCredentialStatus = async (): Promise<{
  dbUser: boolean;
  dbPassword: boolean;
  coupangAccessKey: boolean;
  coupangSecretKey: boolean;
  unipassKey: boolean;
}> => {
  const credentials = await getStoredCredentials();

  return {
    dbUser: Boolean(credentials.user),
    dbPassword: Boolean(credentials.password),
    coupangAccessKey: Boolean(credentials.coupangAccessKey),
    coupangSecretKey: Boolean(credentials.coupangSecretKey),
    unipassKey: Boolean(credentials.unipassKey),
  };
};

export const saveDbCredentials = async ({ user, password }: DbCredentialInput): Promise<void> => {
  await Promise.all([
    keytar.setPassword(serviceName, userAccount, user),
    keytar.setPassword(serviceName, passwordAccount, password),
  ]);
};

export const clearDbCredentials = async (): Promise<void> => {
  await Promise.all([
    keytar.deletePassword(serviceName, userAccount),
    keytar.deletePassword(serviceName, passwordAccount),
  ]);
};

export const saveCoupangCredentials = async ({
  accessKey,
  secretKey,
}: CoupangCredentialInput): Promise<void> => {
  await Promise.all([
    keytar.setPassword(serviceName, coupangAccessKeyAccount, accessKey),
    keytar.setPassword(serviceName, coupangSecretKeyAccount, secretKey),
  ]);
};

export const clearCoupangCredentials = async (): Promise<void> => {
  await Promise.all([
    keytar.deletePassword(serviceName, coupangAccessKeyAccount),
    keytar.deletePassword(serviceName, coupangSecretKeyAccount),
  ]);
};

export const saveUnipassKey = async ({ unipassKey }: UnipassCredentialInput): Promise<void> => {
  await keytar.setPassword(serviceName, unipassKeyAccount, unipassKey);
};

export const clearUnipassKey = async (): Promise<void> => {
  await keytar.deletePassword(serviceName, unipassKeyAccount);
};
