import { loadProfile } from "./profile";
import { getCredentialStatus } from "./secrets";
import type { AppProfileStatus } from "../types/settings";

export const getProfileStatus = async (): Promise<AppProfileStatus> => {
  const profile = loadProfile();
  const credentialsStored = await getCredentialStatus();
  const missingFields: string[] = [];

  if (!profile.HOST) {
    missingFields.push("HOST");
  }

  if (profile.PORT === null) {
    missingFields.push("PORT");
  }

  if (!credentialsStored.dbUser) {
    missingFields.push("USER");
  }

  if (!credentialsStored.dbPassword) {
    missingFields.push("PASSWORD");
  }

  if (!credentialsStored.coupangAccessKey) {
    missingFields.push("COUPANG_ACCESS_KEY");
  }

  if (!credentialsStored.coupangSecretKey) {
    missingFields.push("COUPANG_SECRET_KEY");
  }

  return {
    isConfigured: missingFields.length === 0,
    missingFields,
    credentialsStored,
  };
};
