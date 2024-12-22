import { cn } from '@rememr/ui'
import { LoadingBookmark } from '../bookmark'

export const LoadingBookmarks = ({ count = 3, className }: { count?: number; className?: string }) => {
  const result: JSX.Element[] = []

  for (let i = 0; i < count; i++) {
    result.push(<LoadingBookmark key={i} />)
  }

  return <div className={cn('flex grow flex-col space-y-3', className)}>{result}</div>
}
