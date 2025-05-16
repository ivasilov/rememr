import { createClient } from '@/utils/supabase/client'
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
} from '@rememr/ui'
import { uniqBy } from 'lodash'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { EditPagesForBookmark } from '../edit-pages-for-bookmark'
import { useEditBookmarkMutation } from './edit-bookmark-mutation'

const formId = 'edit-bookmark'

interface Props {
  bookmark: { id: string }
  onClose: () => void
}

const EditBookmarkSchema = z.object({
  name: z.string(),
  url: z.string(),
  read: z.boolean(),
  tagIds: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
})

const supabase = createClient()

export const EditBookmarkDialog = ({ bookmark, onClose }: Props) => {
  const { mutateAsync, isPending } = useEditBookmarkMutation()

  const form = useForm<z.infer<typeof EditBookmarkSchema>>({
    resolver: zodResolver(EditBookmarkSchema),
    defaultValues: {
      name: '',
      url: '',
      read: false,
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

        let pages = bookmark.tags.map(p => ({ id: p.id, name: p.name }))
        const tagIds = uniqBy(pages, p => p.name)

        form.reset({
          name: bookmark.name,
          url: bookmark.url,
          read: bookmark.read,
          tagIds: tagIds,
        })
      })
  }, [bookmark.id, supabase])

  const onSubmit: SubmitHandler<z.infer<typeof EditBookmarkSchema>> = async values => {
    try {
      await mutateAsync({
        id: bookmark.id,
        tagIds: values.tagIds.map(t => ({ id: t.id, name: t.name })),
        name: values.name,
        url: values.url,
        read: values.read,
      })
      toast.success(
        <span>
          Succesfully updated <span className="text-primary">{values.name}</span>.
        </span>,
      )
      onClose()
    } catch (e: any) {
      console.log(e)
      toast.error(
        <span>
          Error happened while trying to edit a bookmark: <span className="text-destructive">{e?.message}</span>.
        </span>,
      )
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Editing bookmark</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name of the bookmark</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
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
                  <Input placeholder="shadcn" {...field} />
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
                  <FormDescription>If marked as unread, it will show up in the unread list.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                  <EditPagesForBookmark pages={field.value} onChange={ids => field.onChange(ids)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button variant="default" type="submit" form={formId} disabled={isPending}>
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </>
  )
}
