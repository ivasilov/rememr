'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { EditPagesForBookmark } from '../../../../components/edit-pages-for-bookmark'
import { Button } from '../../../../components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../../components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form'
import { Input } from '../../../../components/ui/input'
import { Switch } from '../../../../components/ui/switch'
import { createClient } from '../../../../utils/supabase/client'

const formId = 'create-new-bookmark'

const NewBookmarkSchema = z.object({
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

export const NewBookmarkComponent = () => {
  const supabase = createClient()

  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<z.infer<typeof NewBookmarkSchema>>({
    resolver: zodResolver(NewBookmarkSchema),
    defaultValues: {
      name: searchParams.get('title') || '',
      url: searchParams.get('url') || '',
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof NewBookmarkSchema>> = async values => {
    const tagNames = values.tagIds.filter(t => !t.id).map(t => ({ name: t.name }))
    const { data: newTags } = await supabase.from('tags').insert(tagNames).select()

    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        name: values.name,
        url: values.url,
        read: values.read,
      })
      .select()

    if (error || data.length !== 1) {
      // TODO: handle this case
      return
    }
    const bookmark = data[0]

    const existingTags = values.tagIds.filter(t => t.id)
    const relations = [...(newTags || []), ...existingTags].map(r => ({ tag_id: r.id!, bookmark_id: bookmark.id }))

    await supabase.from('bookmarks_tags').delete().eq('bookmark_id', bookmark.id)
    if (relations.length > 0) {
      await supabase.from('bookmarks_tags').insert(relations)
    }
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>New bookmark</CardTitle>
      </CardHeader>
      <CardContent>
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
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Button variant="secondary" onClick={() => router.push('/')}>
          Cancel
        </Button>
        <Button variant="default" type="submit" form={formId}>
          Save
        </Button>
      </CardFooter>
    </Card>
  )
}
