'use client';
import { FormGroup } from '@/src/components/form-group';
import { Button } from '@/src/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/src/components/ui/dialog';
import { Input } from '@/src/components/ui/input';
import { createClient } from '@/src/utils/supabase/client';
import { upperFirst } from 'lodash';
import { useState } from 'react';

export const Imports = () => {
  const [state, setState] = useState<{ dialogShown: boolean; type: string | undefined }>({
    dialogShown: false,
    type: undefined,
  });

  return (
    <>
      <Button onClick={() => setState({ dialogShown: true, type: 'pinboard' })}>Import from Pinboard</Button>
      <Button onClick={() => setState({ dialogShown: true, type: 'onetab' })}>Import from Onetab</Button>
      {state.dialogShown && (state.type === 'pinboard' || state.type === 'onetab') ? (
        <UploadDialog type={state.type} onClose={() => setState({ dialogShown: false, type: undefined })} />
      ) : null}
    </>
  );
};

const UploadDialog = (props: { type: 'pinboard' | 'onetab'; onClose: () => void }) => {
  const supabase = createClient();

  const [state, setState] = useState<{ file: { name: string } | undefined }>({
    file: undefined,
  });

  const handleChange = (e: any) => {
    if (e && e.target && e.target.validity.valid && e.target.files && e.target.files[0]) {
      setState({ ...state, file: e.target.files[0] });
    }
  };

  const onSubmit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const id = user?.id;

    if (state.file) {
      const { data } = await supabase.storage.from('uploads').createSignedUploadUrl(`${id}/${props.type}.json`);
      if (data) {
        const { error } = await supabase.storage
          .from('uploads')
          .uploadToSignedUrl(data.path, data.token, state.file as any, { upsert: true });

        if (!error) {
          const { error: functionError } = await supabase.functions.invoke('import-bookmarks');
          if (!functionError) {
            props.onClose();
          }
        }
      }
    }
  };

  return (
    <Dialog open onOpenChange={props.onClose}>
      <DialogContent>
        <DialogHeader>{`Import ${upperFirst(props.type)} data`}</DialogHeader>
        <div>
          <FormGroup htmlFor="file-upload" label="File to be imported">
            <Input id="file-upload" type="file" onChange={handleChange} />
          </FormGroup>
        </div>
        <DialogFooter>
          <Button onClick={props.onClose}>Cancel</Button>
          <Button onClick={onSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
