'use server';
import { checkAuthentication, createSupabaseServerComponentClient } from '@/src/lib/supabase';
import { SinglePageError } from './components/error';
import { ReadOnlyPage } from './components/read-only-page';

const TagPage = async ({ params: { id } }: { params: { id: string } }) => {
  await checkAuthentication();

  const supabase = createSupabaseServerComponentClient();
  const { data, error } = await supabase.from('tags').select('*, bookmarks (*)').eq('id', id);
  const tag = data![0];
  if (error) {
    return <SinglePageError />;
  }

  if (tag) {
    return <ReadOnlyPage page={tag} />;
  }

  return <SinglePageError />;
};

export default TagPage;
