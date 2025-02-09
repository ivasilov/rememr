'use client'

import { Button, Input, SheetFooter, SheetHeader, SheetTitle } from '@rememr/ui'
import { useChat } from 'ai/react'
import { Send } from 'lucide-react'
import { Markdown } from '../markdown'

export function Chat({ bookmarkTitle, bookmarkUrl }: { bookmarkTitle: string; bookmarkUrl: string }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/bookmark',
    initialMessages: [
      {
        id: '1',
        content: `Hi, can we discuss about [${bookmarkTitle}](${bookmarkUrl})?`,
        role: 'system',
      },
    ],
  })

  return (
    <div className="flex h-full flex-col">
      <SheetHeader>
        <SheetTitle>Chat</SheetTitle>
      </SheetHeader>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
              >
                <a></a>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'assistant' ? 'bg-secondary' : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <Markdown>{message.content}</Markdown>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SheetFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-3 border-t">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </SheetFooter>
    </div>
  )
}
