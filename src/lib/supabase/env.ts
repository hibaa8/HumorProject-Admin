const candidateAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
const supabaseProjectId = process.env.SUPABASE_PROJECT_ID;
const projectDerivedUrl = supabaseProjectId
  ? `https://${supabaseProjectId}.supabase.co`
  : undefined;
const candidateUrl =
  projectDerivedUrl ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL;

if (!candidateUrl || !candidateAnonKey) {
  throw new Error(
    "Missing Supabase env vars. Set SUPABASE_PROJECT_ID (preferred) or SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL and provide a Supabase anon key."
  );
}

const supabaseUrl: string = candidateUrl;
const supabaseAnonKey: string = candidateAnonKey;

export { supabaseAnonKey, supabaseUrl };
