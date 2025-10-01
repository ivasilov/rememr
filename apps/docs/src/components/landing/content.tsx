import { WordRotate } from '../ui/word-rotate'

export default function ContentSection() {
  return (
    <section className="bg-muted py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <h2 className="font-medium text-4xl">Own your data.</h2>
          <div className="space-y-6">
            <p>
              We started building rememr to be easy to selfhost and avoid losing
              our favorite tools. <span>We were there when </span>
              <WordRotate words={['Google Reader', 'Pocket', 'Omnivore']} />
              <span> shut down, we remember.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
