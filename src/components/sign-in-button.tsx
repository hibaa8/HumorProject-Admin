"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type SignInButtonProps = {
  nextPath: string;
};

export function SignInButton({ nextPath }: SignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onSignIn = async () => {
    setIsLoading(true);
    const supabase = createSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
      nextPath
    )}`;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
  };

  return (
    <button
      type="button"
      onClick={onSignIn}
      disabled={isLoading}
      className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? "Redirecting..." : "Continue with Google"}
    </button>
  );
}
