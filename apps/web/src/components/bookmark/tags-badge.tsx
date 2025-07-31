'use client'

import { TagType } from '@/lib/supabase'
import { Badge, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@rememr/ui'

type TagsBadgeProps = {
  tags: Pick<TagType, 'id' | 'name'>[]
}

export const TagsBadge = ({ tags }: TagsBadgeProps) => {
  if (tags.length === 0) {
    return null
  }

  const tagNames = tags.map(tag => (
    <Badge key={tag.id} variant="secondary">
      {tag.name}
    </Badge>
  ))

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className="cursor-help">
            {tags.length} tag{tags.length > 1 ? 's' : ''}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="flex flex-col gap-1">{tagNames}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
