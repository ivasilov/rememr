import { Chat } from '@/components/chat'
import { Button, MessageCircleMoreIcon, Sheet, SheetContent, SheetTrigger } from '@rememr/ui'

export function ChatSheet({ bookmarkTitle, bookmarkUrl }: { bookmarkTitle: string; bookmarkUrl: string }) {
  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="min-w-9">
          <MessageCircleMoreIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-2/3 sm:max-w-full xl:w-1/3 2xl:w-1/4">
        <Chat bookmarkTitle={bookmarkTitle} bookmarkUrl={bookmarkUrl} />
      </SheetContent>
    </Sheet>
  )
}
