import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userEmail = user?.email?.toLowerCase().trim();
  if (!userEmail) {
    return NextResponse.redirect(`${origin}/not-authorized`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, is_superadmin")
    .ilike("email", userEmail)
    .maybeSingle<{ email: string | null; is_superadmin: boolean }>();

  if (!profile?.email || !profile.is_superadmin) {
    return NextResponse.redirect(`${origin}/not-authorized`);
  }

  return NextResponse.redirect(`${origin}/admin`);
}
