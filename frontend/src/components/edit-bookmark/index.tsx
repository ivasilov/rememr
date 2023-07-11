import { FormGroup } from '@/src/components/form-group';
import { Button } from '@/src/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { createSupabaseBrowserClient } from '@/src/lib/supabase.client';
import { uniqBy } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { EditPagesForBookmark, IdName } from '../edit-pages-for-bookmark';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';

interface Props {
  isOpen: boolean;
  bookmark: { id: string };
  onClose: () => void;
}

export const EditBookmarkDialog = ({ bookmark, isOpen, onClose }: Props) => {
  const supabase = createSupabaseBrowserClient();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const [tagIds, setTagIds] = useState<IdName[]>([]);
  const [read, setRead] = useState(false);

  useEffect(() => {
    supabase
      .from('bookmarks')
      .select('*, tags (*)')
      .eq('id', bookmark.id)
      .then(({ data }) => {
        const bookmark = data![0];

        setName(bookmark.name);
        setUrl(bookmark.url);
        setRead(bookmark.read);
        changePages(bookmark.tags);
      });
  }, [bookmark.id, supabase]);

  const update = useCallback(async () => {
    const tagNames = tagIds.filter(t => !t.id).map(t => ({ name: t.name }));
    const { data: newTags } = await supabase.from('tags').insert(tagNames).select();

    await supabase
      .from('bookmarks')
      .update({
        name: name,
        url: url,
      })
      .eq('id', bookmark.id);

    const existingTags = tagIds.filter(t => t.id);
    const relations = [...(newTags || []), ...existingTags].map(r => ({ tag_id: r.id!, bookmark_id: bookmark.id }));

    await supabase.from('bookmarks_tags').delete().eq('bookmark_id', bookmark.id);
    if (relations.length > 0) {
      await supabase.from('bookmarks_tags').insert(relations);
    }

    onClose();
  }, [bookmark.id, name, onClose, supabase, tagIds, url]);

  const changeName = (e: React.FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const changeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.currentTarget.value);
  };

  const changeReadFlag = (flag: boolean) => {
    setRead(flag);
  };

  const changePages = (p: IdName[]) => {
    let pages = p.map(p => ({ id: p.id, name: p.name }));
    setTagIds(uniqBy(pages, p => p.name));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editing bookmark</DialogTitle>
        </DialogHeader>
        <div>
          <FormGroup htmlFor="name" label="Name of the bookmark">
            <Input id="name" onChange={changeName} value={name} />
          </FormGroup>
          <FormGroup htmlFor="url" label="Url of the bookmark">
            <Input onChange={changeUrl} value={url} />
          </FormGroup>
          <FormGroup htmlFor="read" label="Read">
            <Switch checked={read} onCheckedChange={changeReadFlag} />
          </FormGroup>

          <FormGroup htmlFor="pages" label="Pages which have this bookmark">
            <EditPagesForBookmark pages={tagIds} onChange={changePages} />
          </FormGroup>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" onClick={() => update()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
