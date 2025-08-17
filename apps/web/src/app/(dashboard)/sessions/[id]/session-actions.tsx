'use client'

import { Button } from '@rememr/ui'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { TagType } from '@/lib/supabase'
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
    <Button disabled={loading} onClick={onDelete} variant="destructive">
      {loading && <Loader2 className="animate-spin" />}
      Delete
    </Button>
  )
}
