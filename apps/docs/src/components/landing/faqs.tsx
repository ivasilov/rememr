'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@rememr/ui'

const faqItems = [
  {
    id: 'item-1',
    question: 'How can I self-host?',
    answer:
      'You can self-host the application on your own server. We provide a Docker image that you can run on your own server.',
  },
  {
    id: 'item-2',
    question: 'Why should I use rememr when AI can build me an app for my specific needs?',
    answer:
      'We believe that AI is a great tool to help you manage your bookmarks, but it is not a replacement for a human. We want to provide a tool that is easy to use and that you can trust.',
  },
  {
    id: 'item-3',
    question: 'I have an idea for a feature, how can I contribute?',
    answer:
      'You can contribute to the project by opening an issue or a pull request. We are always looking for new ideas and feedback.',
  },
]

export default function FAQs() {
  return (
    <section className="bg-transparent py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div>
          <h2 className="text-foreground text-4xl font-semibold">Frequently Asked Questions</h2>
        </div>

        <div className="mt-12">
          <Accordion
            type="single"
            collapsible
            className="bg-card ring-foreground/5 rounded-(--radius) w-full border border-transparent px-8 py-3 shadow ring-1"
          >
            {faqItems.map(item => (
              <AccordionItem key={item.id} value={item.id} className="border-dotted">
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
