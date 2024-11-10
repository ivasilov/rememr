'use client'
import { EditPagesForBookmark } from '@/src/components/edit-pages-for-bookmark'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogContent,
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
  Progress,
  Switch,
} from '@rememr/ui'
import { capitalize } from 'lodash'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ZodError, z } from 'zod'
import { importOnetabBookmarks } from './importers/onetab'
import { importPinboardBookmarks } from './importers/pinboard'

const FormSchema = z.object({
  file: z.any(),
  tags: z.array(z.object({ id: z.string().optional(), name: z.string().trim().min(1) })),
  unread: z.boolean().optional(),
})

const FormId = 'import-bookmarks-form'

export const Imports = () => {
  const [state, setState] = useState<{ dialogShown: boolean; type: string | undefined }>({
    dialogShown: false,
    type: undefined,
  })

  return (
    <>
      <Button onClick={() => setState({ dialogShown: true, type: 'pinboard' })}>Import from Pinboard</Button>
      <Button onClick={() => setState({ dialogShown: true, type: 'onetab' })}>Import from Onetab</Button>
      <Dialog
        open={state.dialogShown && (state.type === 'pinboard' || state.type === 'onetab')}
        onOpenChange={() => setState({ ...state, dialogShown: false })}
      >
        <DialogContent>
          <UploadDialog
            type={state.type as 'pinboard' | 'onetab'}
            onClose={() => setState({ ...state, dialogShown: false })}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

const UploadDialog = (props: { type: 'pinboard' | 'onetab'; onClose: () => void }) => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState({ current: 0, max: 0 })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tags: [],
      unread: props.type === 'onetab' ? false : undefined,
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async ({ file, unread, tags }) => {
    setLoading(true)

    try {
      if (file) {
        const text = await file.text()

        if (props.type === 'onetab') {
          await importOnetabBookmarks(text, { tags: tags.map(t => t.name), unread: !!unread })
        }
        if (props.type === 'pinboard') {
          await importPinboardBookmarks(text, { tags: tags.map(t => t.name) }, (current, max) => {
            setProgress({ current, max })
          })
        }
      } else {
        throw new Error("The file doesn't exist")
      }
    } catch (error) {
      if (error instanceof ZodError) {
        form.setError('file', {
          type: 'manual',
          message: 'The uploaded file is not in the correct format.',
        })
      }
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const progressPercentage = progress.current && progress.max > 0 ? (progress.current / progress.max) * 100 : 0

  const stage = loading ? 'loading' : progress.current > 0 ? 'finished' : 'start'

  return (
    <>
      <DialogHeader>
        <DialogTitle>{`Import ${capitalize(props.type)} data`}</DialogTitle>
      </DialogHeader>
      <div>
        {stage === 'start' && (
          <Form {...form}>
            <form id={FormId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File to be imported</FormLabel>
                    <FormControl>
                      <Input
                        id="file-upload"
                        type="file"
                        onChange={e => {
                          if (e && e.target && e.target.validity.valid && e.target.files && e.target.files[0]) {
                            field.onChange(e.target.files[0])
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional tags for the newly imported bookmarks</FormLabel>
                    <FormControl>
                      <EditPagesForBookmark pages={field.value} onChange={ps => field.onChange(ps)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {props.type === 'onetab' && (
                <FormField
                  control={form.control}
                  name="unread"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-y-0">
                      <div className="h-full space-y-0.5">
                        <FormLabel>Read</FormLabel>
                        <FormDescription>If marked as unread, it will show up in the unread list.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </form>
          </Form>
        )}

        {stage === 'loading' && (
          <>
            <span>
              Imported {progress.current} out of {progress.max} bookmarks so far.
            </span>
            <div>
              <Progress value={progressPercentage} />
            </div>
          </>
        )}
        {stage === 'finished' && (
          <>
            <span>
              Successfully imported {progress.current} out of {progress.max} bookmarks.
            </span>
          </>
        )}
      </div>
      <DialogFooter>
        {(stage === 'start' || stage === 'loading') && <Button onClick={props.onClose}>Cancel</Button>}
        {stage === 'start' && <Button form={FormId}>Save</Button>}
        {stage === 'loading' && (
          <Button disabled>
            <Loader2 className="animate-spin" />
            Save
          </Button>
        )}
        {stage === 'finished' && <Button onClick={props.onClose}>Close</Button>}
      </DialogFooter>
    </>
  )
}
