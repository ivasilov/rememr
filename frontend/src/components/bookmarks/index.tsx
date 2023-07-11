'use client';
import { classNames } from '@/src/lib/classnames';
import { BookmarkType } from '@/src/lib/supabase';
import { createSupabaseBrowserClient } from '@/src/lib/supabase.client';
import { isNumber, last } from 'lodash';
import { useCallback, useState } from 'react';
import { Bookmark } from '../bookmark';
import { LoadMoreBookmarks } from './load-more-bookmarks';

type BookmarksProps = {
  className?: string;
  bookmarks: BookmarkType[];
  count: number;
};

const supabase = createSupabaseBrowserClient();

export const Bookmarks = ({ className, bookmarks: firstBookmarks, count: initialCount }: BookmarksProps) => {
  const [bookmarks, setBookmarks] = useState(firstBookmarks || []);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(initialCount);

  const classes = classNames('space-y-3 grow flex flex-col', className);

  const fetchNextBookmarks = useCallback(async () => {
    setLoading(true);
    const lastBookmark = last(bookmarks);
    const { data, error, count } = await supabase
      .from('bookmarks')
      .select('*', { count: 'exact' })
      .order('created_at')
      .filter('created_at', 'gte', lastBookmark?.created_at)
      .limit(10);
    if (data) {
      setBookmarks([...bookmarks, ...data]);
    }
    if (isNumber(count)) {
      setCount(count);
    }
    setLoading(false);
  }, [bookmarks]);

  return (
    <div className={classes}>
      {bookmarks.map(b => (
        <Bookmark key={b.id} bookmark={b} />
      ))}
      <LoadMoreBookmarks hasMore={count > bookmarks.length} loading={loading} fetchMore={fetchNextBookmarks} />
    </div>
  );
};
