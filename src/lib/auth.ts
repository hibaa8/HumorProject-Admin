import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AdminProfile = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  is_superadmin: boolean;
};

export const requireSuperadmin = async () => {
  const supabase = await createSupabaseServerClient();
  // Temporary bypass requested by user: allow direct dashboard access
  // without Google/session/superadmin checks.
  const bypassAuthForNow = true;

  if (bypassAuthForNow) {
    return {
      supabase,
      user: null,
      profile: {
        id: "temporary-bypass",
        email: null,
        first_name: "Temporary",
        last_name: "Bypass",
        is_superadmin: true,
      } satisfies AdminProfile,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userEmail = user.email?.toLowerCase().trim();
  if (!userEmail) {
    redirect("/not-authorized");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, first_name, last_name, is_superadmin")
    .ilike("email", userEmail)
    .maybeSingle<AdminProfile>();

  if (error || !profile?.is_superadmin) {
    redirect("/not-authorized");
  }

  return { supabase, user, profile };
};
