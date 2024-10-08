import { Button } from '@/src/components/ui/button'
import { DialogFooter, DialogHeader, DialogTitle } from '@/src/components/ui/dialog'
import { createClient } from '@/src/utils/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { uniqBy } from 'lodash'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { EditPagesForBookmark } from '../edit-pages-for-bookmark'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'

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
      id: z.string().optional(),
      name: z.string(),
    }),
  ),
})

export const EditBookmarkDialog = ({ bookmark, onClose }: Props) => {
  const supabase = createClient()

  const form = useForm<z.infer<typeof EditBookmarkSchema>>({
    resolver: zodResolver(EditBookmarkSchema),
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
    const tagNames = values.tagIds.filter(t => !t.id).map(t => ({ name: t.name }))
    const { data: newTags } = await supabase.from('tags').insert(tagNames).select()

    await supabase
      .from('bookmarks')
      .update({
        name: values.name,
        url: values.url,
        read: values.read,
      })
      .eq('id', bookmark.id)

    const existingTags = values.tagIds.filter(t => t.id)
    const relations = [...(newTags || []), ...existingTags].map(r => ({ tag_id: r.id!, bookmark_id: bookmark.id }))

    await supabase.from('bookmarks_tags').delete().eq('bookmark_id', bookmark.id)
    if (relations.length > 0) {
      await supabase.from('bookmarks_tags').insert(relations)
    }

    onClose()
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
                  <EditPagesForBookmark
                    pages={field.value}
                    onChange={ids => {
                      const transformedIds = ids.map(id => ({ id }))
                      console.log(ids)
                      field.onChange(ids)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="default" type="submit" form={formId}>
          Save
        </Button>
      </DialogFooter>
    </>
  )
}
