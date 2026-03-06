# Humor Project Admin Area

Next.js admin app for managing selected staging data in Supabase.

## Features

- Google OAuth sign-in via Supabase
- Superadmin gate on all `/admin/*` routes (`profiles.is_superadmin = true` required)
- Dashboard with dataset stats and creator highlights
- Profiles: read-only browser
- Images: full CRUD forms
- Captions: read-only browser

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Ensure `.env.local` exists with these values:

```bash
SUPABASE_ANON_KEY=
SUPABASE_PROJECT_ID=
SUPABASE_URL=
GOOGLE_OAUTH_CLIENT_ID=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_URL=
```

3. Run dev server:

```bash
npm run dev
```

## Superadmin Bootstrap (avoid lockout)

If your signed-in user is not a superadmin yet, run this once in Supabase SQL Editor:

```sql
update public.profiles
set is_superadmin = true
where id = <your-auth-user-id>;
```

Then sign out and sign in again.

## Deploy to Vercel

1. Import this `admin-area` project into Vercel.
2. Add the same env vars from `.env.local` in Vercel Project Settings.
3. Confirm your Supabase Google provider is enabled and callback URLs include your Vercel domain:
   - `https://<your-domain>/auth/callback`
4. Deploy.
