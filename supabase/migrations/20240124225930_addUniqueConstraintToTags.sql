CREATE UNIQUE INDEX tag_name_user_id ON public.tags USING btree (name, user_id);

alter table "public"."tags" add constraint "tag_name_user_id" UNIQUE using index "tag_name_user_id";


