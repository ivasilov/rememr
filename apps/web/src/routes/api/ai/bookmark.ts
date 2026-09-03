import { createFileRoute } from '@tanstack/react-router'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

export const Route = createFileRoute('/api/ai/bookmark')({
  server: {
    handlers: {
      GET: () =>
        new Response('Method not allowed', {
          status: 405,
          headers: { Allow: 'POST' },
        }),
      POST: async ({ request }) => {
        const apiKey = process.env.OPENAI_API_KEY
        if (!apiKey) {
          return new Response('OpenAI is not configured', { status: 503 })
        }

        try {
          const { messages } = await request.json()
          const openai = new OpenAI({ apiKey })
          const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            stream: true,
            messages,
            temperature: 0.2,
            max_tokens: 100,
          })

          return new StreamingTextResponse(OpenAIStream(response))
        } catch (error) {
          console.error('OpenAI API error:', error)
          return new Response('Error processing your request', { status: 500 })
        }
      },
    },
  },
})
