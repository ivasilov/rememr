'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { toast } from 'sonner'
import { EditPagesForBookmark } from '../../../../components/edit-pages-for-bookmark'
import { createClient } from '../../../../utils/supabase/client'
import { save } from './action'

const formId = 'create-new-bookmark'

const NewBookmarkSchema = z.object({
  name: z.string().trim().min(1),
  url: z.string().trim().min(1),
  read: z.boolean().default(true),
  tagIds: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .default([]),
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
    try {
      await save(values.name, values.url, values.tagIds)
      toast.success('Bookmark created')
      router.push('/bookmarks')
    } catch (error) {
      toast.error('Failed to create bookmark', {
        description: error instanceof Error ? error.message : 'Please try again',
      })
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
                    <Input placeholder="Rememr" {...field} />
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
        <Button variant="secondary" onClick={() => router.push('/bookmarks')}>
          Cancel
        </Button>
        <Button variant="default" type="submit" form={formId}>
          Save
        </Button>
      </CardFooter>
    </Card>
  )
}
