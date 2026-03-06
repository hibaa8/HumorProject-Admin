import { requireSuperadmin } from "@/lib/auth";

type CaptionRow = {
  id: string;
  content: string | null;
  is_public: boolean;
  is_featured: boolean;
  like_count: number | null;
  image_id: string;
  profiles: { email: string | null } | { email: string | null }[] | null;
  images: { url: string | null } | { url: string | null }[] | null;
};

export default async function CaptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { supabase } = await requireSuperadmin();
  const { q } = await searchParams;

  let query = supabase
    .from("captions")
    .select(
      "id, content, is_public, is_featured, like_count, created_datetime_utc, profile_id, image_id, profiles(email), images(url)"
    )
    .order("created_datetime_utc", { ascending: false })
    .limit(100);

  if (q) {
    query = query.ilike("content", `%${q}%`);
  }

  const { data: captions, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  const captionRows = (captions ?? []) as CaptionRow[];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="text-xl font-semibold">Captions (read-only)</h2>
        <p className="mt-1 text-sm text-zinc-400">Inspect caption content and engagement fields.</p>

        <form className="mt-4 flex gap-2" method="get">
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search caption text"
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
          <button className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900">Search</button>
        </form>
      </section>

      <section className="space-y-3">
        {captionRows.map((caption) => {
          const profileEmail =
            caption.profiles && !Array.isArray(caption.profiles)
              ? caption.profiles.email
              : "(unknown profile)";
          const imageUrl =
            caption.images && !Array.isArray(caption.images)
              ? caption.images.url
              : "(unknown image)";

          return (
            <article key={caption.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Tag text={caption.is_public ? "public" : "private"} color={caption.is_public ? "emerald" : "zinc"} />
                <Tag text={caption.is_featured ? "featured" : "standard"} color={caption.is_featured ? "amber" : "zinc"} />
                <Tag text={`${caption.like_count ?? 0} likes`} color="blue" />
              </div>
              <p className="mt-3 text-sm leading-6">{caption.content ?? "(empty caption)"}</p>
              <div className="mt-4 grid gap-2 text-xs text-zinc-400 md:grid-cols-2">
                <p>Author: {profileEmail}</p>
                <p className="truncate">Image: {imageUrl}</p>
                <p className="font-mono">Caption ID: {caption.id}</p>
                <p className="font-mono">Image ID: {caption.image_id}</p>
              </div>
            </article>
          );
        })}

        {captionRows.length === 0 ? (
          <p className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-sm text-zinc-400">No captions found.</p>
        ) : null}
      </section>
    </div>
  );
}

function Tag({
  text,
  color,
}: {
  text: string;
  color: "emerald" | "amber" | "blue" | "zinc";
}) {
  const cls =
    color === "emerald"
      ? "bg-emerald-950 text-emerald-300"
      : color === "amber"
        ? "bg-amber-950 text-amber-300"
        : color === "blue"
          ? "bg-blue-950 text-blue-300"
          : "bg-zinc-800 text-zinc-300";

  return <span className={`rounded px-2 py-1 ${cls}`}>{text}</span>;
}
