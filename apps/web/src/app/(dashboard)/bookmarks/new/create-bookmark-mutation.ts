import { bookmarks, bookmarkTags, tags } from '@/lib/database'

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const isUuid = (value: string) => UUID_PATTERN.test(value)

export type CreateBookmarkValues = {
  description: string | null
  name: string
  read: boolean
  tagIds: { id: string; name: string }[]
  url: string
}

export const createBookmark = async (
  values: CreateBookmarkValues,
  userId: string
) => {
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

  const bookmark = {
    created_at: timestamp,
    description: values.description,
    id: crypto.randomUUID(),
    name: values.name,
    read: values.read,
    updated_at: timestamp,
    url: values.url,
    user_id: userId,
  }

  await bookmarks.insert(bookmark).isPersisted.promise

  const tagIds = values.tagIds.map((tag) => {
    if (isUuid(tag.id)) {
      return tag.id
    }

    const createdTag = newTags.find((candidate) => candidate.name === tag.name)
    if (!createdTag) {
      throw new Error(`Failed to create tag ${tag.name}`)
    }

    return createdTag.id
  })

  if (tagIds.length > 0) {
    await bookmarkTags.insert(
      tagIds.map((tagId) => ({
        bookmark_id: bookmark.id,
        tag_id: tagId,
      }))
    ).isPersisted.promise
  }

  return bookmark
}
