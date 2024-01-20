'use server';
import { Bookmarks } from '@/src/components/bookmarks';
import { checkAuthentication } from '@/src/lib/supabase';
import { createClient } from '@/src/utils/supabase/server';
import { cookies } from 'next/headers';

const BookmarksPage = async () => {
  await checkAuthentication();

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
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
