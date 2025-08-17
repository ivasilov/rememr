import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Switch,
  Textarea,
} from '@rememr/ui'
import { uniqBy } from 'lodash'
import { useEffect } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import type { BookmarkType } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/client'
import { EditPagesForBookmark } from '../edit-pages-for-bookmark'
import { useEditBookmarkMutation } from './edit-bookmark-mutation'

const formId = 'edit-bookmark'

type Props = {
  bookmark: BookmarkType
  onClose: () => void
}

const EditBookmarkSchema = z.object({
  name: z.string().trim(),
  url: z.string().trim(),
  read: z.boolean(),
  description: z.string().trim(),
  tagIds: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
})

const supabase = createClient()

export const EditBookmarkDialog = ({ bookmark, onClose }: Props) => {
  const { mutateAsync, isPending } = useEditBookmarkMutation()

  const form = useForm<z.infer<typeof EditBookmarkSchema>>({
    resolver: zodResolver(EditBookmarkSchema),
    defaultValues: {
      name: bookmark.name,
      url: bookmark.url,
      read: bookmark.read,
      description: bookmark.description || '',
      tagIds: [],
    },
  })

  // TODO: loading the bookmark in useEffect is an anti-pattern. Get rid of it.
  useEffect(() => {
    supabase
      .from('bookmarks')
      .select('*, tags (*)')
      .eq('id', bookmark.id)
      .then(({ data }) => {
        const bookmark = data![0]

        const pages = bookmark.tags.map((p) => ({ id: p.id, name: p.name }))
        const tagIds = uniqBy(pages, (p) => p.name)

        form.reset({
          name: bookmark.name,
          url: bookmark.url,
          read: bookmark.read,
          description: bookmark.description || '',
          tagIds,
        })
      })
  }, [bookmark.id, supabase])

  const onSubmit: SubmitHandler<z.infer<typeof EditBookmarkSchema>> = async (
    values
  ) => {
    try {
      await mutateAsync({
        id: bookmark.id,
        tagIds: values.tagIds.map((t) => ({ id: t.id, name: t.name })),
        name: values.name,
        url: values.url,
        description: values.description,
        read: values.read,
      })
      toast.success(
        <span>
          Succesfully updated{' '}
          <span className="text-primary">{values.name}</span>.
        </span>
      )
      onClose()
    } catch (e: any) {
      console.log(e)
      toast.error(
        <span>
          Error happened while trying to edit a bookmark:{' '}
          <span className="text-destructive">{e?.message}</span>.
        </span>
      )
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Editing bookmark</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          className="flex flex-col space-y-4"
          id={formId}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name of the bookmark</FormLabel>
                <FormControl>
                  <Input placeholder="Good bookmarking app" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Url of the bookmark</FormLabel>
                <FormControl>
                  <Input placeholder="https://rememr.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="read"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Read</FormLabel>
                  <FormDescription>
                    If marked as unread, it will show up in the unread list.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tagIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags which have this bookmark</FormLabel>
                <FormControl>
                  <EditPagesForBookmark
                    onChange={(ids) => field.onChange(ids)}
                    pages={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <DialogFooter>
        <Button disabled={isPending} onClick={onClose} variant="secondary">
          Cancel
        </Button>
        <Button
          disabled={isPending}
          form={formId}
          type="submit"
          variant="default"
        >
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </>
  )
}
