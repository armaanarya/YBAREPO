# Supabase RLS — required before launch (manual dashboard steps)

Run in Supabase → SQL editor. This makes the API routes (service-role key) the
ONLY write path and denies the public anon key all read/write on PII tables.

```sql
alter table public.signups   enable row level security;
alter table public.analytics enable row level security;

-- List existing policies and DROP anything granting anon SELECT/INSERT/ALL:
select * from pg_policies where schemaname = 'public';
```

Verify as the anon role (SQL editor):

```sql
set role anon;
select count(*) from public.signups;   -- expect: permission denied
select count(*) from public.analytics; -- expect: permission denied
reset role;
```

Then set `SUPABASE_SERVICE_ROLE_KEY` (from Project Settings → API) in Vercel →
Project → Settings → Environment Variables AND in local `.env.local`.
The API routes bypass RLS via the service-role key, so they keep working.
Until that env var is set, `lib/supabase-server.ts` falls back to the anon key
and logs a warning — do not launch in that state.
