import { Bookmarks } from '@/src/components/bookmarks';
import { BookmarkType } from '@/src/lib/supabase';
import { Heading } from '../heading';

export const ReadOnlyPage = (props: { page: { id: string; name: string; bookmarks: BookmarkType[] } }) => {
  const page = props.page;

  return (
    <>
      <Heading page={page} />
      <Bookmarks bookmarks={page.bookmarks} />
    </>
  );
};
