import { Button } from '@rememr/ui'
import { Github } from 'lucide-react'
import ContentSection from '@/components/landing/content'
import FAQs from '@/components/landing/faqs'
import FeaturesSection from '@/components/landing/features'
import HeroSection from '@/components/landing/hero'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <ContentSection />
      <FAQs />

      {/* CTA Section */}
      <section className="bg-muted px-4 py-24">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-12 text-center">
          <h2 className="mb-6 font-bold text-3xl text-foreground">
            Ready to organize your bookmarks?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Install rememr on your server now.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild className="min-w-40" size="lg">
              <a
                href="https://github.com/ivasilov/rememr"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Github className="mr-2 h-4 w-4" />
                View documentation on GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} rememr. Open source under MIT
              license.
            </p>
            <div className="flex items-center gap-6">
              <a
                className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-primary"
                href="https://github.com/ivasilov/rememr"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
