import type { JSX } from 'react'
import { LoadingBookmarkRow } from '../bookmark/loading-bookmark-row'

export const LoadingBookmarks = ({ count = 3, className }: { count?: number; className?: string }) => {
  const result: JSX.Element[] = []

  for (let i = 0; i < count; i++) {
    result.push(<LoadingBookmarkRow key={i} />)
  }

  return <>{result}</>
}
