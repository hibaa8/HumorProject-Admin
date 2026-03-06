import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const rawNext = searchParams.get("next");
  const nextPath = rawNext && rawNext.startsWith("/") ? rawNext : "/admin";

  return NextResponse.redirect(`${origin}${nextPath}`);
}
