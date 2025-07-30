'use client'

import { Badge, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@rememr/ui'
import { TagType } from '@/lib/supabase'

type TagsBadgeProps = {
  tags: Pick<TagType, 'id' | 'name'>[]
}

export const TagsBadge = ({ tags }: TagsBadgeProps) => {
  if (tags.length === 0) {
    return null
  }

  const tagNames = tags.map(tag => tag.name).join(', ')

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className="cursor-help">
            {tags.length} tag{tags.length > 1 ? 's' : ''}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tagNames}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}