import { persistNormalizedProfile, readLegacyConfig } from "./profile";
import {
  getCredentialStatus,
  saveCoupangCredentials,
  saveDbCredentials,
} from "./secrets";

export const migrateLegacyConfig = async (): Promise<void> => {
  const legacyConfig = readLegacyConfig();
  const credentialStatus = await getCredentialStatus();
  const legacyUser = typeof legacyConfig.USER === "string" ? legacyConfig.USER : null;
  const legacyPassword = typeof legacyConfig.PASSWORD === "string" ? legacyConfig.PASSWORD : null;
  const legacyAccessKey =
    typeof legacyConfig.ACCESS_KEY === "string" ? legacyConfig.ACCESS_KEY : null;
  const legacySecretKey =
    typeof legacyConfig.SECRET_KEY === "string" ? legacyConfig.SECRET_KEY : null;

  if (!credentialStatus.dbUser && !credentialStatus.dbPassword && legacyUser && legacyPassword) {
    await saveDbCredentials({
      user: legacyUser,
      password: legacyPassword,
    });
  }

  if (
    !credentialStatus.coupangAccessKey &&
    !credentialStatus.coupangSecretKey &&
    legacyAccessKey &&
    legacySecretKey
  ) {
    await saveCoupangCredentials({
      accessKey: legacyAccessKey,
      secretKey: legacySecretKey,
    });
  }

  persistNormalizedProfile(legacyConfig);
};
