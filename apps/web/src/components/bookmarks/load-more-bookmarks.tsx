import { useEffect, useRef } from 'react'
import { LoadingBookmarkRow } from '../bookmark/loading-bookmark-row'
import { LoadingBookmarks } from './loading'

export type LoadMoreBookmarksProps = { hasMore: boolean; loading: boolean; fetchMore: () => Promise<unknown> }

export const LoadMoreBookmarks = ({ hasMore, loading, fetchMore }: LoadMoreBookmarksProps) => {
  const loader = useRef<HTMLTableRowElement>(null)

  useEffect(() => {
    const currentEl = loader.current
    if (currentEl) {
      var options = {
        root: null,
        rootMargin: '20px',
        threshold: 1.0,
      }
      const handleObserver = (entities: IntersectionObserverEntry[]) => {
        const target = entities[0]
        if (target.isIntersecting && fetchMore) {
          fetchMore()
        }
      }

      const observer = new IntersectionObserver(handleObserver, options)
      if (currentEl) {
        observer.observe(currentEl)
      }
      return () => {
        if (currentEl) {
          observer.unobserve(currentEl)
        }
      }
    }
  }, [fetchMore])

  if (loading) {
    return <LoadingBookmarks />
  }
  if (hasMore) {
    return <LoadingBookmarkRow key="load-more" ref={loader} />
  }
  return null
}
