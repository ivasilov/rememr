'use client'

import { Button, Input, SheetFooter, SheetHeader, SheetTitle } from '@rememr/ui'
import { useChat } from 'ai/react'
import { Send } from 'lucide-react'
import { Markdown } from '../markdown'

export function Chat({
  bookmarkTitle,
  bookmarkUrl,
}: {
  bookmarkTitle: string
  bookmarkUrl: string
}) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
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
            {messages.map((message) => (
              <div
                className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                key={message.id}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'assistant'
                      ? 'bg-secondary'
                      : 'bg-primary text-primary-foreground'
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
        <form
          className="flex w-full items-center gap-3 border-t"
          onSubmit={handleSubmit}
        >
          <Input
            className="flex-1"
            disabled={isLoading}
            onChange={handleInputChange}
            placeholder="Type a message..."
            value={input}
          />
          <Button disabled={isLoading} size="icon" type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </SheetFooter>
    </div>
  )
}
