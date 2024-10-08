'use client'

import { TagType } from '@/src/lib/supabase'
import { faTag } from '@fortawesome/free-solid-svg-icons'

import { classNames } from '@/src/lib/classnames'
import { createClient } from '@/src/utils/supabase/client'
import { sortBy } from 'lodash'
import { useEffect, useState } from 'react'
import { PageLink } from '.'

export const PageCategories = ({ className }: { className?: string }) => {
  const [tags, setTags] = useState<TagType[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('tags')
      .select()
      .then(({ data }) => {
        if (data) {
          setTags(data)
        }
      })
  }, [])

  if (tags) {
    const sorted = sortBy(tags, p => p.name)

    return (
      <div className="h-full space-y-1">
        <h3 className={classNames(className, 'px-1 text-base font-medium text-gray-500')} id="projects-headline">
          Tags
        </h3>
        <div className="relative h-full space-y-1 overflow-y-auto" role="group" aria-labelledby="projects-headline">
          {sorted.map(page => (
            <PageLink key={page.id} name={page.name} className={className} href={`/tags/${page.id}`} icon={faTag} />
          ))}
        </div>
      </div>
    )
  }

  return <div>Error happened.</div>
}
