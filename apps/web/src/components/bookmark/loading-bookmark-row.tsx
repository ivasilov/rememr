import { Skeleton, TableCell, TableRow } from '@rememr/ui'
import { forwardRef } from 'react'

export const LoadingBookmarkRow = forwardRef<
  HTMLTableRowElement,
  React.HTMLProps<HTMLTableRowElement>
>((props, ref) => {
  return (
    <TableRow ref={ref} {...props}>
      <TableCell className="w-8">
        <Skeleton className="h-5 w-5 rounded" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-64" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-16 rounded-full" />
      </TableCell>
      <TableCell className="w-32">
        <div className="flex items-center justify-end gap-2">
          <Skeleton className="h-8 w-8" />
        </div>
      </TableCell>
    </TableRow>
  )
})

LoadingBookmarkRow.displayName = 'LoadingBookmarkRow'
