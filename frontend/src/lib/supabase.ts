import { createServerActionClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Database } from './database.types';

export const createSupabaseServerComponentClient = () => {
  return createServerComponentClient<Database>({ cookies });
};

export const createSupabaseServerActionClient = () => {
  return createServerActionClient<Database>({ cookies });
};

export const checkAuthentication = async () => {
  const supabase = createSupabaseServerComponentClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // This route can only be accessed by authenticated users.
    // Unauthenticated users will be redirected to the `/login` route.
    redirect('/login');
  }
};

export type BookmarkType = Database['public']['Tables']['bookmarks']['Row'];
export type TagType = Database['public']['Tables']['tags']['Row'];
