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

  if (error || !profile?.email || !profile.is_superadmin) {
    redirect("/not-authorized");
  }

  return { supabase, user, profile };
};
