'use server';
import { checkAuthentication } from '@/src/lib/supabase';
import { NewBookmarkComponent } from './component';

const NewBookmarkPage = async () => {
  await checkAuthentication();

  return <NewBookmarkComponent />;
};

export default NewBookmarkPage;
