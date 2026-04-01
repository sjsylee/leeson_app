import mariadb from "mariadb";
import { loadProfile } from "../config/profile";
import { getStoredCredentials } from "../config/secrets";

type DatabaseName = "Category" | "Keyword";

const getHost = (): string => {
  const profile = loadProfile();

  if (!profile.HOST) {
    throw new Error("HOST is not configured.");
  }

  return profile.HOST;
};

const getPort = (): number => {
  const profile = loadProfile();

  if (profile.PORT === null) {
    throw new Error("PORT is not configured.");
  }

  return profile.PORT;
};

export const withDatabase = async <T>(
  database: DatabaseName,
  run: (conn: mariadb.PoolConnection) => Promise<T>
): Promise<T> => {
  const credentials = await getStoredCredentials();

  if (!credentials.user || !credentials.password) {
    throw new Error("Database credentials are not configured.");
  }

  const pool = mariadb.createPool({
    host: getHost(),
    port: getPort(),
    user: credentials.user,
    password: credentials.password,
    database,
    connectionLimit: 5,
  });

  let conn: mariadb.PoolConnection | undefined;

  try {
    conn = await pool.getConnection();

    return await run(conn);
  } finally {
    if (conn) {
      conn.end();
    }

    await pool.end();
  }
};
