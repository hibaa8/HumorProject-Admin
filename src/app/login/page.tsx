import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const nextPath = params.next && params.next.startsWith("/") ? params.next : "/admin";

  // Temporary bypass requested by user.
  redirect(nextPath);
}
