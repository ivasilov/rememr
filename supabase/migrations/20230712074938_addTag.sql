CREATE TABLE tags (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" character varying NOT NULL,
  "user_id" uuid references auth.users default auth.uid(),
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now()
);

alter table
  tags enable row level security;

create policy "Authenticated users can select tags" on tags for
select
  to authenticated using (true);

create policy "Authenticated users can insert their own tags" on tags for
insert
  to authenticated with check (auth.uid() = user_id);