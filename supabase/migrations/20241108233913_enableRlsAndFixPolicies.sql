drop policy "users can manage their own bookmarks_tags records" on "public"."bookmarks_tags";

drop policy "Users can manage their own tags" on "public"."tags";

alter table "public"."bookmarks_tags" enable row level security;

create policy "users can manage their own bookmarks_tags records"
on "public"."bookmarks_tags"
as permissive
for all
to authenticated
using (((EXISTS ( SELECT 1
   FROM bookmarks
  WHERE ((bookmarks.id = bookmarks_tags.bookmark_id) AND (bookmarks.user_id = ( SELECT auth.uid() AS uid))))) AND (EXISTS ( SELECT 1
   FROM tags
  WHERE ((tags.id = bookmarks_tags.tag_id) AND (tags.user_id = ( SELECT auth.uid() AS uid)))))))
with check (((EXISTS ( SELECT 1
   FROM bookmarks
  WHERE ((bookmarks.id = bookmarks_tags.bookmark_id) AND (bookmarks.user_id = ( SELECT auth.uid() AS uid))))) AND (EXISTS ( SELECT 1
   FROM tags
  WHERE ((tags.id = bookmarks_tags.tag_id) AND (tags.user_id = ( SELECT auth.uid() AS uid)))))));


create policy "Users can manage their own tags"
on "public"."tags"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



