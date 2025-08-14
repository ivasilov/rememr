import { Button } from '@rememr/ui'
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="before:bg-muted border-e-foreground relative overflow-hidden before:absolute before:inset-1 before:h-[calc(100%-8rem)] sm:before:inset-2 lg:before:h-[calc(100%-14rem)]">
      <div className="py-20 md:py-36">
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <div>
            <h1 className="text-balance mx-auto mt-8 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
              The last bookmarking app you&apos;ll ever need
            </h1>
            <p className="text-muted-foreground text-balance mx-auto my-6 max-w-xl text-xl">
              Organize bookmarks seamlessly across the web.
            </p>

            <div className="flex items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="#link">
                  <span className="text-nowrap">Install on your server</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="relative z-10 mx-auto max-w-5xl px-6">
            <div className="mt-12 md:mt-16">
              <div className="bg-background rounded-(--radius) relative mx-auto overflow-hidden border border-transparent shadow-lg shadow-black/10 ring-1 ring-black/10">
                <Image src="/mist/tailark-2.png" alt="app screen" width="2880" height="1842" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
