import ContentSection from '@/components/landing/content'
import FAQs from '@/components/landing/faqs'
import FeaturesSection from '@/components/landing/features'
import HeroSection from '@/components/landing/hero'
import { Button } from '@rememr/ui'
import { Github } from 'lucide-react'

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
          <h2 className="text-foreground mb-6 text-3xl font-bold">Ready to organize your bookmarks?</h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">Install rememr on your server now.</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="min-w-40" asChild>
              <a href="https://github.com/ivasilov/rememr" target="_blank" rel="noopener noreferrer">
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
              © {new Date().getFullYear()} rememr. Open source under MIT license.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/ivasilov/rememr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm"
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
