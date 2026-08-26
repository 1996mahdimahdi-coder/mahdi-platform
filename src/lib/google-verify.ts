import { jwtVerify, createRemoteJWKSet, type JWTPayload } from "jose";

const GOOGLE_JWKS_URL = new URL("https://www.googleapis.com/oauth2/v3/certs");
const GOOGLE_ISSUERS = [
  "https://accounts.google.com",
  "accounts.google.com",
];

const googleJwks = createRemoteJWKSet(GOOGLE_JWKS_URL);

export type GoogleIdTokenPayload = {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
} & JWTPayload;

export async function verifyGoogleIdToken(
  idToken: string,
  clientId: string
): Promise<{ payload: GoogleIdTokenPayload | null; error: string | null }> {
  try {
    const { payload } = await jwtVerify(idToken, googleJwks, {
      issuer: GOOGLE_ISSUERS,
      audience: clientId,
    });
    return { payload: payload as GoogleIdTokenPayload, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[GoogleVerify]", msg);
    return { payload: null, error: msg };
  }
}
