drop policy "Authenticated users can delete their own bookmarks" on "public"."bookmarks";

drop policy "Authenticated users can insert their own bookmarks" on "public"."bookmarks";

drop policy "Authenticated users can select bookmarks" on "public"."bookmarks";

drop policy "Authenticated users can insert their own tags" on "public"."tags";

drop policy "Authenticated users can select tags" on "public"."tags";

create policy "Users can manage their own bookmarks"
on "public"."bookmarks"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "users can manage their own bookmarks_tags records"
on "public"."bookmarks_tags"
as permissive
for all
to public
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
to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



