'use client'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { useRouter, useSearchParams } from 'next/navigation'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { EditPagesForBookmark } from '@/components/edit-pages-for-bookmark'
import { useCreateBookmarkMutation } from './create-bookmark-mutation'

const formId = 'create-new-bookmark'

const NewBookmarkSchema = z.object({
  name: z.string().trim().min(1),
  url: z.string().trim().min(1),
  read: z.boolean().default(true),
  description: z.string().trim(),
  tagIds: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .default([]),
})

export const NewBookmarkComponent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<z.infer<typeof NewBookmarkSchema>>({
    resolver: zodResolver(NewBookmarkSchema),
    defaultValues: {
      name: searchParams.get('title') || '',
      url: searchParams.get('url') || '',
      description: '',
    },
  })

  const { mutate: createBookmark, isPending } = useCreateBookmarkMutation()

  const onSubmit: SubmitHandler<z.infer<typeof NewBookmarkSchema>> = async (
    values
  ) => {
    try {
      createBookmark(values, {
        onSuccess: () => {
          toast.success('Bookmark created successfully')
          router.push('/bookmarks')
        },
        onError: (error) => {
          toast.error(`Failed to create bookmark: ${error.message}`)
        },
      })

      toast.success('Bookmark created')
      router.push('/bookmarks')
    } catch (error) {
      toast.error('An unexpected error occurred')
    }
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>New bookmark</CardTitle>
      </CardHeader>
      <CardContent>
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
                    <Input
                      placeholder="Rememr"
                      {...field}
                      disabled={isPending}
                    />
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
                    <Input
                      placeholder="https://rememr.com"
                      {...field}
                      disabled={isPending}
                    />
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
                      disabled={isPending}
                      onCheckedChange={field.onChange}
                    />
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
                    <EditPagesForBookmark
                      disabled={isPending}
                      onChange={(ids) => field.onChange(ids)}
                      pages={field.value}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Button
          disabled={isPending}
          onClick={() => router.push('/bookmarks')}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button
          disabled={isPending}
          form={formId}
          type="submit"
          variant="default"
        >
          {isPending ? 'Creating...' : 'Save'}
        </Button>
      </CardFooter>
    </Card>
  )
}
