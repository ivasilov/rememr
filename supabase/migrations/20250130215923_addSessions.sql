create table "public"."bookmarks_sessions" (
    "bookmark_id" uuid not null,
    "session_id" uuid not null
);


alter table "public"."bookmarks_sessions" enable row level security;

create table "public"."sessions" (
    "id" uuid not null default gen_random_uuid(),
    "name" text,
    "user_id" uuid,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."sessions" enable row level security;

CREATE UNIQUE INDEX bookmarks_sessions_pkey ON public.bookmarks_sessions USING btree (bookmark_id, session_id);

CREATE UNIQUE INDEX sessions_pkey ON public.sessions USING btree (id);

alter table "public"."bookmarks_sessions" add constraint "bookmarks_sessions_pkey" PRIMARY KEY using index "bookmarks_sessions_pkey";

alter table "public"."sessions" add constraint "sessions_pkey" PRIMARY KEY using index "sessions_pkey";

alter table "public"."bookmarks_sessions" add constraint "bookmarks_sessions_bookmark_id_fkey" FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."bookmarks_sessions" validate constraint "bookmarks_sessions_bookmark_id_fkey";

alter table "public"."bookmarks_sessions" add constraint "bookmarks_sessions_session_id_fkey" FOREIGN KEY (session_id) REFERENCES sessions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."bookmarks_sessions" validate constraint "bookmarks_sessions_session_id_fkey";

alter table "public"."sessions" add constraint "sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."sessions" validate constraint "sessions_user_id_fkey";

grant delete on table "public"."bookmarks_sessions" to "anon";

grant insert on table "public"."bookmarks_sessions" to "anon";

grant references on table "public"."bookmarks_sessions" to "anon";

grant select on table "public"."bookmarks_sessions" to "anon";

grant trigger on table "public"."bookmarks_sessions" to "anon";

grant truncate on table "public"."bookmarks_sessions" to "anon";

grant update on table "public"."bookmarks_sessions" to "anon";

grant delete on table "public"."bookmarks_sessions" to "authenticated";

grant insert on table "public"."bookmarks_sessions" to "authenticated";

grant references on table "public"."bookmarks_sessions" to "authenticated";

grant select on table "public"."bookmarks_sessions" to "authenticated";

grant trigger on table "public"."bookmarks_sessions" to "authenticated";

grant truncate on table "public"."bookmarks_sessions" to "authenticated";

grant update on table "public"."bookmarks_sessions" to "authenticated";

grant delete on table "public"."bookmarks_sessions" to "service_role";

grant insert on table "public"."bookmarks_sessions" to "service_role";

grant references on table "public"."bookmarks_sessions" to "service_role";

grant select on table "public"."bookmarks_sessions" to "service_role";

grant trigger on table "public"."bookmarks_sessions" to "service_role";

grant truncate on table "public"."bookmarks_sessions" to "service_role";

grant update on table "public"."bookmarks_sessions" to "service_role";

grant delete on table "public"."sessions" to "anon";

grant insert on table "public"."sessions" to "anon";

grant references on table "public"."sessions" to "anon";

grant select on table "public"."sessions" to "anon";

grant trigger on table "public"."sessions" to "anon";

grant truncate on table "public"."sessions" to "anon";

grant update on table "public"."sessions" to "anon";

grant delete on table "public"."sessions" to "authenticated";

grant insert on table "public"."sessions" to "authenticated";

grant references on table "public"."sessions" to "authenticated";

grant select on table "public"."sessions" to "authenticated";

grant trigger on table "public"."sessions" to "authenticated";

grant truncate on table "public"."sessions" to "authenticated";

grant update on table "public"."sessions" to "authenticated";

grant delete on table "public"."sessions" to "service_role";

grant insert on table "public"."sessions" to "service_role";

grant references on table "public"."sessions" to "service_role";

grant select on table "public"."sessions" to "service_role";

grant trigger on table "public"."sessions" to "service_role";

grant truncate on table "public"."sessions" to "service_role";

grant update on table "public"."sessions" to "service_role";

create policy "Users can manage their own bookmarks_sessions records"
on "public"."bookmarks_sessions"
as permissive
for all
to authenticated
using (((EXISTS ( SELECT 1
   FROM bookmarks
  WHERE ((bookmarks.id = bookmarks_sessions.bookmark_id) AND (bookmarks.user_id = ( SELECT auth.uid() AS uid))))) AND (EXISTS ( SELECT 1
   FROM sessions
  WHERE ((sessions.id = bookmarks_sessions.session_id) AND (sessions.user_id = ( SELECT auth.uid() AS uid)))))))
with check (((EXISTS ( SELECT 1
   FROM bookmarks
  WHERE ((bookmarks.id = bookmarks_sessions.bookmark_id) AND (bookmarks.user_id = ( SELECT auth.uid() AS uid))))) AND (EXISTS ( SELECT 1
   FROM sessions
  WHERE ((sessions.id = bookmarks_sessions.session_id) AND (sessions.user_id = ( SELECT auth.uid() AS uid)))))));


create policy "Users can manage their own sessions"
on "public"."sessions"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));