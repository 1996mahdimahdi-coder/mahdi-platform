import type { PoolConfig } from "pg";

/**
 * Resolves the pg Pool options from a DATABASE_URL.
 *
 * Why: the previous code created the Pool with only `connectionString`, so
 * TLS was implicitly decided by the server / pg defaults and no connection
 * timeout was set. For any non-local database (production Postgres/Neon),
 * TLS is now **explicitly required** with full certificate verification.
 *
 * Local development (localhost/127.0.0.1) keeps the previous behaviour: no
 * TLS block, connection string passed through unchanged.
 *
 * Escape hatch for platforms that present self-signed / private CA
 * certificates: set DATABASE_SSL_INSECURE=1 in the environment. Only use it
 * when the connection is already inside a trusted private network or the
 * vendor explicitly requires it.
 */
export function resolvePoolConfig(
  databaseUrl: string,
  env: Record<string, string | undefined> = process.env
): PoolConfig {
  const isLocalHost = /(localhost|127\.0\.0\.1|::1)/i.test(databaseUrl);

  const ssl = isLocalHost
    ? undefined
    : env.DATABASE_SSL_INSECURE === "1"
      ? { rejectUnauthorized: false }
      : { rejectUnauthorized: true };

  return {
    connectionString: databaseUrl,
    ...(ssl ? { ssl } : {}),
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
}