import { deleteImageAction, updateImageAction } from "@/app/admin/images/actions";
import { CreateImageForm } from "@/app/admin/images/create-image-form";
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
          <article key={image.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="truncate text-xs text-zinc-400">{image.id}</p>
              <form action={deleteImageAction}>
                <input type="hidden" name="id" value={image.id} />
                <button className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500 hover:shadow-md hover:shadow-red-500/20">
                  Delete
                </button>
              </form>
            </div>

            <form action={updateImageAction} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={image.id} />
              <input
                name="url"
                defaultValue={image.url ?? ""}
                placeholder="URL"
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
              />
              <input
                name="profile_id"
                defaultValue={image.profile_id ?? ""}
                placeholder="Profile UUID"
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
              />
              <input
                name="image_description"
                defaultValue={image.image_description ?? ""}
                placeholder="Description"
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
              />
              <input
                name="additional_context"
                defaultValue={image.additional_context ?? ""}
                placeholder="Additional context"
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
              />
              <input
                name="celebrity_recognition"
                defaultValue={image.celebrity_recognition ?? ""}
                placeholder="Celebrity recognition"
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
              />
              <div className="flex items-center gap-4 text-sm text-zinc-300">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="is_public" defaultChecked={Boolean(image.is_public)} />
                  Public
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="is_common_use" defaultChecked={Boolean(image.is_common_use)} />
                  Common use
                </label>
              </div>
              <button className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-zinc-950 md:col-span-2 md:w-fit">
                Save changes
              </button>
            </form>
          </article>
        ))}

        {(images ?? []).length === 0 ? (
          <p className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-sm text-zinc-400">No images found.</p>
        ) : null}
      </section>
    </div>
  );
}
