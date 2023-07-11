'use server';
import { Bookmarks } from '@/src/components/bookmarks';
import { checkAuthentication, createSupabaseServerComponentClient } from '@/src/lib/supabase';

const BookmarksPage = async () => {
  await checkAuthentication();

  const supabase = createSupabaseServerComponentClient();
  const {
    data: bookmarks,
    error,
    count,
  } = await supabase.from('bookmarks').select('*', { count: 'exact' }).eq('read', false).order('created_at').limit(10);
  const classes = 'container pt-8 px-6';

  if (!error) {
    return <Bookmarks bookmarks={bookmarks} className={classes} count={count || bookmarks.length} />;
  }

  return <div>Something bad happened.</div>;
};

export default BookmarksPage;
