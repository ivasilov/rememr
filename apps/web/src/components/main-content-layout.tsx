import { cn } from '@rememr/ui'
import { PropsWithChildren } from 'react'

/**
 * Used to wrap content which shows up in the main window in the (dashboard) routes. This component could be added to
 * dashboard layout but that limits us when wanting to use full width pages.
 */
export const MainContentLayout = ({ className, children }: PropsWithChildren<{ className?: string }>) => {
  return <div className={cn('container flex max-w-6xl flex-col gap-4 pb-16 pt-4', className)}>{children}</div>
}
