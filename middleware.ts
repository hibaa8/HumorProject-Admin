import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseProjectId = process.env.SUPABASE_PROJECT_ID;
const projectDerivedUrl = supabaseProjectId
  ? `https://${supabaseProjectId}.supabase.co`
  : undefined;
const supabaseUrl =
  projectDerivedUrl || process.env.SUPABASE_URL;

export async function middleware(request: NextRequest) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  // Temporary bypass requested by user: allow dashboard access without login.
  const bypassAuthForNow = true;
  if (bypassAuthForNow) {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/not-authorized" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico";

  if (!user && !isPublicRoute) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
