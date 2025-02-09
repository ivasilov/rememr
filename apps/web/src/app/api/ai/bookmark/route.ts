import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages,
      temperature: 0.2,
      max_tokens: 100,
    })

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error('OpenAI API error:', error)
    return new Response('Error processing your request', { status: 500 })
  }
}
