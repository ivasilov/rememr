'use client';
import { EditPagesForBookmark, IdName } from '@/src/components/edit-pages-for-bookmark';
import { FormGroup } from '@/src/components/form-group';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { uniqBy } from 'lodash';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { save } from './action';

export const NewBookmarkComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState(searchParams.get('title') || '');
  const [url, setUrl] = useState(searchParams.get('url') || '');
  const [pages, setPages] = useState<IdName[]>([]);

  const changeName = (e: React.FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const changeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.currentTarget.value);
  };

  const changePages = (p: IdName[]) => {
    console.log(p);
    let pages = p.map(p => ({ id: p.id, name: p.name }));
    setPages(uniqBy(pages, p => p.name));
  };

  return (
    <div className="w-5/6 mx-auto mt-8">
      <FormGroup htmlFor="name" label="Name of the bookmark">
        <Input onChange={changeName} value={name} />
      </FormGroup>
      <FormGroup htmlFor="url" label="Url of the bookmark">
        <Input onChange={changeUrl} value={url} />
      </FormGroup>
      <FormGroup htmlFor="pages-select" label="Pages which have this bookmark">
        <EditPagesForBookmark pages={pages} onChange={changePages} />
      </FormGroup>
      <div>
        <Button onClick={() => router.push('/')}>Cancel</Button>
        <Button onClick={() => save(name, url, pages)}>Save</Button>
      </div>
    </div>
  );
};
