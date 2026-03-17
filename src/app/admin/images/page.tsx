import { CreateImageForm } from "@/app/admin/images/create-image-form";
import { ImageRowActions } from "@/app/admin/images/image-row-actions";
import { requireSuperadmin } from "@/lib/auth";

export default async function ImagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { supabase } = await requireSuperadmin();
  const { q } = await searchParams;

  let query = supabase
    .from("images")
    .select(
      "id, created_datetime_utc, modified_datetime_utc, url, profile_id, is_public, is_common_use, image_description, additional_context, celebrity_recognition"
    )
    .order("created_datetime_utc", { ascending: false })
    .limit(50);

  if (q) {
    query = query.or(
      `url.ilike.%${q}%,image_description.ilike.%${q}%,additional_context.ilike.%${q}%`
    );
  }

  const { data: images, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="text-xl font-semibold">Image management</h2>
        <p className="mt-1 text-sm text-zinc-400">Create, update, and delete rows in public.images, including file upload.</p>

        <form className="mt-4 flex gap-2" method="get">
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search url/description/context"
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
          <button className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900">Search</button>
        </form>
      </section>

      <section className="rounded-2xl border border-emerald-900 bg-emerald-950/20 p-5">
        <h3 className="text-lg font-semibold">Create image</h3>
        <CreateImageForm />
      </section>

      <section className="space-y-4">
        {(images ?? []).map((image) => (
          <ImageRowActions key={image.id} image={image} />
        ))}

        {(images ?? []).length === 0 ? (
          <p className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-sm text-zinc-400">No images found.</p>
        ) : null}
      </section>
    </div>
  );
}
