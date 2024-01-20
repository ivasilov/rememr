'use server';
import { createClient } from '@/src/utils/supabase/server';
import { cookies } from 'next/headers';
import { Bookmarks } from '../../../components/bookmarks';
import { checkAuthentication } from '../../../lib/supabase';

const BookmarksPage = async () => {
  await checkAuthentication();

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: bookmarks,
    error,
    count,
  } = await supabase.from('bookmarks').select('*', { count: 'exact' }).order('created_at').limit(10);
  const classes = 'container pt-8 px-6';

  if (!error) {
    return <Bookmarks bookmarks={bookmarks} className={classes} count={count || bookmarks.length} />;
  }

  return <div>Something bad happened.</div>;
};

export default BookmarksPage;
