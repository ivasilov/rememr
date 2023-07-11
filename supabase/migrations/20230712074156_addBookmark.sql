create table if not exists bookmarks (
  "id" uuid not null default uuid_generate_v4() primary key,
  "url" character varying not null,
  "name" character varying not null,
  "read" boolean not null default true,
  "user_id" uuid references auth.users default auth.uid(),
  "created_at" timestamp not null default now(),
  "updated_at" timestamp not null default now()
);

alter table
  bookmarks enable row level security;

create policy "Authenticated users can select bookmarks" on bookmarks for
select
  to authenticated using (true);

create policy "Authenticated users can insert their own bookmarks" on bookmarks for
insert
  to authenticated with check (auth.uid() = user_id);