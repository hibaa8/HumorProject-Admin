import { requireSuperadmin } from "@/lib/auth";

type TopCreator = {
  profileId: string;
  captionCount: number;
  totalLikes: number;
  email: string | null;
};

export default async function AdminDashboardPage() {
  const { supabase } = await requireSuperadmin();

  const [
    { count: profileCount },
    { count: superadminCount },
    { count: imageCount },
    { count: publicImageCount },
    { count: captionCount },
    { count: featuredCaptionCount },
    { data: captionRows },
    { data: recentImages },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("is_superadmin", true),
    supabase.from("images").select("id", { count: "exact", head: true }),
    supabase
      .from("images")
      .select("id", { count: "exact", head: true })
      .eq("is_public", true),
    supabase.from("captions").select("id", { count: "exact", head: true }),
    supabase
      .from("captions")
      .select("id", { count: "exact", head: true })
      .eq("is_featured", true),
    supabase
      .from("captions")
      .select("profile_id, like_count")
      .not("profile_id", "is", null)
      .limit(6000),
    supabase
      .from("images")
      .select("id, url, image_description, is_public, created_datetime_utc")
      .order("created_datetime_utc", { ascending: false })
      .limit(8),
  ]);

  const publicImageRatio = imageCount
    ? Math.round(((publicImageCount ?? 0) / imageCount) * 100)
    : 0;

  const groupedByCreator = new Map<string, { captionCount: number; totalLikes: number }>();
  (captionRows ?? []).forEach((row) => {
    const current = groupedByCreator.get(row.profile_id) ?? { captionCount: 0, totalLikes: 0 };
    groupedByCreator.set(row.profile_id, {
      captionCount: current.captionCount + 1,
      totalLikes: current.totalLikes + (row.like_count ?? 0),
    });
  });

  const topCreatorPairs = [...groupedByCreator.entries()]
    .sort((a, b) => {
      const byCount = b[1].captionCount - a[1].captionCount;
      if (byCount !== 0) {
        return byCount;
      }
      return b[1].totalLikes - a[1].totalLikes;
    })
    .slice(0, 6);

  const topIds = topCreatorPairs.map(([id]) => id);
  const { data: profileRows } = topIds.length
    ? await supabase.from("profiles").select("id, email").in("id", topIds)
    : { data: [] as { id: string; email: string | null }[] };

  const emailMap = new Map((profileRows ?? []).map((row) => [row.id, row.email]));
  const topCreators: TopCreator[] = topCreatorPairs.map(([profileId, stats]) => ({
    profileId,
    captionCount: stats.captionCount,
    totalLikes: stats.totalLikes,
    email: emailMap.get(profileId) ?? null,
  }));

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6">
        <h2 className="text-2xl font-semibold">Data pulse</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Fast snapshot across profiles, images, and captions in staging.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Profiles" value={profileCount ?? 0} />
          <StatCard label="Superadmins" value={superadminCount ?? 0} />
          <StatCard label="Images" value={imageCount ?? 0} />
          <StatCard label="Public Images" value={publicImageCount ?? 0} helper={`${publicImageRatio}% public`} />
          <StatCard label="Captions" value={captionCount ?? 0} />
          <StatCard label="Featured Captions" value={featuredCaptionCount ?? 0} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <h3 className="text-lg font-semibold">Top caption creators</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Ranked by caption volume, then total likes.
          </p>
          <div className="mt-4 space-y-3">
            {topCreators.length === 0 ? (
              <p className="text-sm text-zinc-500">No caption data yet.</p>
            ) : (
              topCreators.map((creator, index) => (
                <div key={creator.profileId} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium">
                      #{index + 1} {creator.email ?? creator.profileId}
                    </p>
                    <p className="text-xs text-zinc-400">{creator.totalLikes} likes</p>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">{creator.captionCount} captions</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <h3 className="text-lg font-semibold">Latest images</h3>
          <p className="mt-1 text-sm text-zinc-400">Newest uploads and visibility state.</p>
          <div className="mt-4 space-y-2">
            {(recentImages ?? []).map((image) => (
              <div key={image.id} className="flex items-start justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                <div className="min-w-0">
                  <p className="truncate text-xs text-zinc-300">{image.url ?? "(no url)"}</p>
                  <p className="truncate text-xs text-zinc-500">{image.image_description ?? "No description"}</p>
                </div>
                <span className={`rounded px-2 py-1 text-[10px] font-semibold ${image.is_public ? "bg-emerald-950 text-emerald-300" : "bg-zinc-800 text-zinc-300"}`}>
                  {image.is_public ? "PUBLIC" : "PRIVATE"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: number;
  helper?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value.toLocaleString()}</p>
      {helper ? <p className="mt-1 text-xs text-zinc-500">{helper}</p> : null}
    </div>
  );
}
