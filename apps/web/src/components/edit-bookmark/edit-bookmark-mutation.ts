import { useMutation } from '@tanstack/react-query'
import type { Tag } from '@/lib/database'
import { useDatabase } from '@/lib/database'

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const isUuid = (value: string) => UUID_PATTERN.test(value)

type EditBookmarkValues = {
  description: string | null
  id: string
  name: string
  read: boolean
  tagIds: { id: string; name: string }[]
  url: string
}

export const useEditBookmarkMutation = (
  originalTags: Pick<Tag, 'id' | 'name'>[]
) => {
  const { bookmarks, bookmarkTags, tags, userId } = useDatabase()

  return useMutation({
    mutationFn: async (values: EditBookmarkValues) => {
      const timestamp = new Date().toISOString()
      const newTags = values.tagIds
        .filter((tag) => !isUuid(tag.id))
        .map((tag) => ({
          created_at: timestamp,
          id: crypto.randomUUID(),
          name: tag.name,
          updated_at: timestamp,
          user_id: userId,
        }))

      if (newTags.length > 0) {
        await tags.insert(newTags).isPersisted.promise
      }

      const selectedTagIds = values.tagIds.map((tag) => {
        if (isUuid(tag.id)) {
          return tag.id
        }

        const createdTag = newTags.find(
          (candidate) => candidate.name === tag.name
        )
        if (!createdTag) {
          throw new Error(`Failed to create tag ${tag.name}`)
        }

        return createdTag.id
      })
      const originalTagIds = new Set(originalTags.map((tag) => tag.id))
      const selectedTagIdSet = new Set(selectedTagIds)
      const removedRelations = originalTags
        .filter((tag) => !selectedTagIdSet.has(tag.id))
        .map((tag) => ({ bookmark_id: values.id, tag_id: tag.id }))
      const addedRelations = selectedTagIds
        .filter((tagId) => !originalTagIds.has(tagId))
        .map((tagId) => ({ bookmark_id: values.id, tag_id: tagId }))

      const bookmarkTransaction = bookmarks.update(values.id, (draft) => {
        draft.description = values.description
        draft.name = values.name
        draft.read = values.read
        draft.updated_at = timestamp
        draft.url = values.url
      })

      const relationTransactions: Promise<unknown>[] = []
      if (removedRelations.length > 0) {
        relationTransactions.push(
          bookmarkTags.delete(
            removedRelations.map((relation) =>
              bookmarkTags.getKeyFromItem(relation)
            )
          ).isPersisted.promise
        )
      }
      if (addedRelations.length > 0) {
        relationTransactions.push(
          bookmarkTags.insert(addedRelations).isPersisted.promise
        )
      }

      await Promise.all([
        bookmarkTransaction.isPersisted.promise,
        ...relationTransactions,
      ])
    },
  })
}
