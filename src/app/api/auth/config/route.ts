import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REDIRECT_URI
  );

  return NextResponse.json({ googleEnabled });
}
