import {
  DropdownMenuItem,
  MessageCircleMoreIcon,
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@rememr/ui'
import { Chat } from '@/components/chat'

export function ChatDropdownMenuItem({
  bookmarkTitle,
  bookmarkUrl,
}: {
  bookmarkTitle: string
  bookmarkUrl: string
}) {
  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>
        <DropdownMenuItem>
          <MessageCircleMoreIcon />
          <span>Ask AI</span>
        </DropdownMenuItem>
      </SheetTrigger>
      <SheetContent className="w-2/3 sm:max-w-full xl:w-1/3 2xl:w-1/4">
        <Chat bookmarkTitle={bookmarkTitle} bookmarkUrl={bookmarkUrl} />
      </SheetContent>
    </Sheet>
  )
}
