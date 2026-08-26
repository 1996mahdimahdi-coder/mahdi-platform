import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const googleClientId = process.env.GOOGLE_CLIENT_ID || "";

  const googleEnabled = Boolean(
    googleClientId &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REDIRECT_URI
  );

  return NextResponse.json({
    googleEnabled,
    googleClientId: googleEnabled ? googleClientId : "",
  });
}
