/* eslint-disable @next/next/no-img-element */
import { Button } from '@/src/components/ui/button';
import { BookmarkType } from '@/src/lib/supabase';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { DeleteBookmarkDialog } from '../delete-bookmark';
import { EditBookmarkDialog } from '../edit-bookmark';
import { Icon } from '../icon';
import { Card } from '../ui/card';

export const Bookmark = (props: { bookmark: BookmarkType }) => {
  const [{ editBookmarkDialogShown, deleteBookmarkDialogShown }, setState] = useState({
    editBookmarkDialogShown: false,
    deleteBookmarkDialogShown: false,
  });

  const bookmark = props.bookmark;
  let hostname = '';
  // new URL can throw and make the whole page unresponsive
  try {
    hostname = new URL(bookmark.url).hostname;
  } catch {}

  return (
    <Card className="group flex overflow-hidden px-6 py-4">
      <img
        className="mr-5 w-5 object-contain"
        alt="bookmark favicon"
        src={`https://s2.googleusercontent.com/s2/favicons?domain=${bookmark.url}&sz=16`}
      />
      <div className="flex w-full  justify-between">
        <div className="flex grow flex-col">
          <a className="font-bold text-black" href={bookmark.url}>
            {bookmark.name}
          </a>
          <span className="font-normal">{hostname}</span>
        </div>

        <div className="min-w-[84px] space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="hidden group-hover:inline-flex"
            onClick={() =>
              setState({
                editBookmarkDialogShown: true,
                deleteBookmarkDialogShown,
              })
            }
          >
            <Icon name={faPencil} size="1x" />
          </Button>
          <Button
            size="sm"
            className="hidden group-hover:inline-flex"
            variant="destructive"
            onClick={() =>
              setState({
                editBookmarkDialogShown,
                deleteBookmarkDialogShown: true,
              })
            }
          >
            <Icon name={faTrash} size="1x" />
          </Button>
        </div>
      </div>
      <DeleteBookmarkDialog
        isOpen={deleteBookmarkDialogShown}
        bookmark={bookmark}
        onClose={() =>
          setState({
            editBookmarkDialogShown,
            deleteBookmarkDialogShown: false,
          })
        }
      />
      <EditBookmarkDialog
        isOpen={editBookmarkDialogShown}
        bookmark={bookmark}
        onClose={() =>
          setState({
            deleteBookmarkDialogShown,
            editBookmarkDialogShown: false,
          })
        }
      />
    </Card>
  );
};
