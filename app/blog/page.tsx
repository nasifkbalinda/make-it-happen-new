import Link from "next/link";

export default function BlogPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 pt-24 pb-32 sm:px-10 lg:px-14">
      
      {/* Header */}
      <div className="mb-16 max-w-2xl">
        <h1 className="mb-6 text-5xl font-extrabold text-white sm:text-6xl">
          Insights.
        </h1>
        <p className="text-lg leading-relaxed text-gray-400">
          Thoughts, theories, and technical deep-dives from our engineering and design teams.
        </p>
      </div>

      {/* Article List */}
      <div className="flex flex-col gap-6">
        
        {/* Article 1 */}
        <article className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0a0a0a] p-8 transition-colors hover:bg-white/5 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm text-gray-500">May 11, 2026 • Engineering</p>
            <h2 className="mb-3 text-2xl font-bold text-white">Why We Switched to Server Components</h2>
            <p className="text-gray-400">A detailed breakdown of how adopting React Server Components reduced our initial load times by 40%.</p>
          </div>
          <button className="mt-6 w-full rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black sm:mt-0 sm:w-auto">
            Read Post
          </button>
        </article>

        {/* Article 2 */}
        <article className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0a0a0a] p-8 transition-colors hover:bg-white/5 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm text-gray-500">April 28, 2026 • Design</p>
            <h2 className="mb-3 text-2xl font-bold text-white">The Death of Flat Design</h2>
            <p className="text-gray-400">Exploring the return of depth, glassmorphism, and texture in modern user interfaces.</p>
          </div>
          <button className="mt-6 w-full rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black sm:mt-0 sm:w-auto">
            Read Post
          </button>
        </article>

        {/* Article 3 */}
        <article className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0a0a0a] p-8 transition-colors hover:bg-white/5 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm text-gray-500">April 15, 2026 • Strategy</p>
            <h2 className="mb-3 text-2xl font-bold text-white">Building for Scale from Day One</h2>
            <p className="text-gray-400">Common architectural mistakes startups make, and how to avoid costly rewrites down the road.</p>
          </div>
          <button className="mt-6 w-full rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black sm:mt-0 sm:w-auto">
            Read Post
          </button>
        </article>

      </div>
    </main>
  );
}