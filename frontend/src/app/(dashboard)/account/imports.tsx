'use client'
import { FormGroup } from '@/src/components/form-group'
import { Button } from '@/src/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/src/components/ui/dialog'
import { Input } from '@/src/components/ui/input'
import { Progress } from '@/src/components/ui/progress'
import { upperFirst } from 'lodash'
import { ChangeEventHandler, useState } from 'react'
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
  const [progressValue, setProgressValue] = useState(0)

  console.log(progressValue)
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
            console.log(current, max)
            setProgressValue((current / max) * 100)
          })
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={props.onClose}>
      <DialogContent>
        <DialogHeader>{`Import ${upperFirst(props.type)} data`}</DialogHeader>
        {loading ? (
          <div className="flex h-[60px] items-center">
            <Progress value={progressValue} />
          </div>
        ) : (
          <FormGroup htmlFor="file-upload" label="File to be imported">
            <Input id="file-upload" type="file" onChange={handleChange} />
          </FormGroup>
        )}
        <DialogFooter>
          <Button onClick={props.onClose}>Cancel</Button>
          <Button onClick={onSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
