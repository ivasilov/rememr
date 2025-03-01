create table if not exists watchlist (
  "id" uuid not null default uuid_generate_v4() primary key,
  "bookmark_id" uuid not null references bookmarks(id) on delete cascade,
  "user_id" uuid not null references auth.users(id) on delete cascade default auth.uid(),
  "created_at" timestamp not null default now(),
  "updated_at" timestamp not null default now()
);

-- Enable RLS
alter table watchlist enable row level security;

-- Create indexes for better performance
create index if not exists watchlist_bookmark_id_idx on watchlist(bookmark_id);
create index if not exists watchlist_user_id_idx on watchlist(user_id);

-- RLS Policies
create policy "Users can view their own watchlist entries" on watchlist
  for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own watchlist entries" on watchlist
  for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete their own watchlist entries" on watchlist
  for delete to authenticated
  using (auth.uid() = user_id);

-- Add unique constraint to prevent duplicate entries
alter table watchlist
  add constraint unique_user_bookmark unique (user_id, bookmark_id);
