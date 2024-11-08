'use client'
import { FormGroup } from '@/src/components/form-group'
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Input, Progress } from '@rememr/ui'
import { upperFirst } from 'lodash'
import { Loader2 } from 'lucide-react'
import { ChangeEventHandler, useState } from 'react'
import { ZodError } from 'zod'
import { importOnetabBookmarks } from './importers/onetab'
import { importPinboardBookmarks } from './importers/pinboard'

function readFile(file: Blob) {
  return new Promise((resolve, reject) => {
    var fr = new FileReader()
    fr.onload = () => {
      resolve(fr.result)
    }
    fr.onerror = reject
    fr.readAsDataURL(file)
  })
}

export const Imports = () => {
  const [state, setState] = useState<{ dialogShown: boolean; type: string | undefined }>({
    dialogShown: false,
    type: undefined,
  })

  return (
    <>
      <Button onClick={() => setState({ dialogShown: true, type: 'pinboard' })}>Import from Pinboard</Button>
      <Button onClick={() => setState({ dialogShown: true, type: 'onetab' })}>Import from Onetab</Button>
      {state.dialogShown && (state.type === 'pinboard' || state.type === 'onetab') ? (
        <UploadDialog type={state.type} onClose={() => setState({ dialogShown: false, type: undefined })} />
      ) : null}
    </>
  )
}

const UploadDialog = (props: { type: 'pinboard' | 'onetab'; onClose: () => void }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>()
  const [progress, setProgress] = useState({ current: 0, max: 0 })

  const [file, setFile] = useState<File | undefined>(undefined)

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    if (e && e.target && e.target.validity.valid && e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const onSubmit = async () => {
    setLoading(true)
    try {
      if (file) {
        const text = await file.text()

        if (props.type === 'onetab') {
          await importOnetabBookmarks(text)
        }
        if (props.type === 'pinboard') {
          await importPinboardBookmarks(text, (current, max) => {
            setProgress({ current, max })
          })
        }
      }
    } catch (error) {
      if (error instanceof ZodError) {
        setError('The uploaded file is not in the correct format.')
      }
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const progressPercentage = progress.current && progress.max > 0 ? (progress.current / progress.max) * 100 : 0

  const stage = loading ? 'loading' : progress.current > 0 ? 'finished' : 'start'

  return (
    <Dialog open onOpenChange={props.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Import ${upperFirst(props.type)} data`}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {stage === 'start' && (
            <>
              <FormGroup htmlFor="file-upload" label="File to be imported">
                <Input id="file-upload" type="file" onChange={handleChange} />
              </FormGroup>
              {error && <span className="text-destructive text-sm">{error}</span>}
            </>
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
          {stage === 'start' && <Button onClick={onSubmit}>Save</Button>}
          {stage === 'loading' && (
            <Button disabled onClick={onSubmit}>
              <Loader2 className="animate-spin" />
              Save
            </Button>
          )}
          {stage === 'finished' && <Button onClick={props.onClose}>Close</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
