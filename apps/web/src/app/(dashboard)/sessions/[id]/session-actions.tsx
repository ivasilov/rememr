'use client'

import { TagType } from '@/lib/supabase'
import { Button } from '@rememr/ui'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { deleteTag } from './action'

export const TagActions = ({ tag }: { tag: TagType }) => {
  const [loading, setLoading] = useState(false)

  const onDelete = async () => {
    setLoading(true)
    await deleteTag(tag.id)
    setLoading(false)
    toast.success(`The tag ${tag.name} has been deleted.`)
  }

  return (
    <Button variant="destructive" disabled={loading} onClick={onDelete}>
      {loading && <Loader2 className="animate-spin" />}
      Delete
    </Button>
  )
}
