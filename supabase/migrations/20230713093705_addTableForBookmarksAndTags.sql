create table bookmarks_tags (
  "bookmark_id" uuid references bookmarks,
  "tag_id" uuid references tags,
  primary key (bookmark_id, tag_id)
);