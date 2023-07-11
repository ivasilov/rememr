'use server';
import { createSupabaseServerActionClient } from '@/src/lib/supabase';
import { revalidatePath } from 'next/cache';

export const deleteBookmark = async (id: string) => {
  const supabase = createSupabaseServerActionClient();

  await supabase.from('bookmarks').delete().eq('id', id);

  revalidatePath('/bookmarks');
};
