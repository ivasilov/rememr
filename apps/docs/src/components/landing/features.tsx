import { Code, PackageOpen, Save, Search, Tags, Zap } from 'lucide-react'

export default function Features() {
  return (
    <section className="pb-12 md:pb-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-balance text-4xl font-medium lg:text-5xl">
            The foundation for creative teams management
          </h2>
          <p>
            Lyra is evolving to be more than just the models. It supports an entire to the APIs and platforms helping
            developers and businesses innovate.
          </p>
        </div>

        <div className="*:p-12 relative mx-auto grid max-w-4xl divide-x divide-y border sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Code className="size-4" />
              <h3 className="text-sm font-medium">100% Open Source</h3>
            </div>
            <p className="text-sm">Self-hostable, privacy-focused, and powered by the community.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tags className="size-4" />
              <h3 className="text-sm font-medium">Tag Everything</h3>
            </div>
            <p className="text-sm">Add tags to bookmarks for instant filtering and recall.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="size-4" />

              <h3 className="text-sm font-medium">Blazing Fast</h3>
            </div>
            <p className="text-sm">Built for speed—from saving to searching—no matter your library size.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Search className="size-4" />

              <h3 className="text-sm font-medium">Lightning Search</h3>
            </div>
            <p className="text-sm">Tag and URL search—all optimized for real-time results.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Save className="size-4" />

              <h3 className="text-sm font-medium">Save in one click</h3>
            </div>
            <p className="text-sm">
              Add bookmarks directly from Chrome or Firefox with a single tap—no need to leave your flow.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <PackageOpen className="size-4" />

              <h3 className="text-sm font-medium">Self-hostable</h3>
            </div>
            <p className="text-sm">Run it on your own server, Raspberry Pi, or the cloud—your choice, your rules.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
