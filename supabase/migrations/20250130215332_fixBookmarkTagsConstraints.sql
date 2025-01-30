alter table "public"."bookmarks_tags" drop constraint "bookmarks_tags_bookmark_id_fkey";

alter table "public"."bookmarks_tags" drop constraint "bookmarks_tags_tag_id_fkey";

alter table "public"."bookmarks_tags" add constraint "bookmarks_tags_bookmark_id_fkey" FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."bookmarks_tags" validate constraint "bookmarks_tags_bookmark_id_fkey";

alter table "public"."bookmarks_tags" add constraint "bookmarks_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."bookmarks_tags" validate constraint "bookmarks_tags_tag_id_fkey";