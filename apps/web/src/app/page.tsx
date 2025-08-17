import { Button } from '@rememr/ui'
import { Github } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/logo'
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20 text-center text-foreground">
        <Logo className="mx-auto mb-10" />
        <h1 className="font-bold text-4xl text-foreground tracking-tight sm:text-6xl">
          rememr
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
          Open-source bookmark management. Organize bookmarks seamlessly across
          the web.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="/bookmarks">Start for free</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a
              href="https://github.com/ivasilov/rememr"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Github className="mr-2 h-4 w-4" />
              Star on GitHub
            </a>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold text-lg">Smart Organization</h3>
            <p className="text-muted-foreground">
              Tagging for effortless bookmark management.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold text-lg">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Instant search and access to your bookmarks from the web.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold text-lg">Open Source</h3>
            <p className="text-muted-foreground">
              Fully transparent, community-driven development with MIT license.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      {/* <section className="container mx-auto px-4 py-24">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Trusted by developers worldwide</h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Join thousands of developers who manage their bookmarks with BookmarkHub
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 opacity-75 md:grid-cols-4">Add company/partner logos here</div>
      </section> */}

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-2xl bg-primary/5 p-8 text-center">
          <h2 className="mb-4 font-bold text-2xl">Ready to get started?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            Join our open-source community and transform how you manage
            bookmarks.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg">Get Started</Button>
            <Button size="lg" variant="outline">
              View Documentation
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
            <div className="flex gap-6">
              <a
                className="text-muted-foreground text-sm hover:text-primary"
                href="https://github.com/ivasilov/rememr"
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub
              </a>
              {/* <a href="#" className="text-muted-foreground hover:text-primary text-sm">
                Documentation
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary text-sm">
                Privacy
              </a> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
