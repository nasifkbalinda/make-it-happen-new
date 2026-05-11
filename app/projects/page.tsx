import Link from "next/link";

export default function ProjectsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 pt-24 pb-32 sm:px-10 lg:px-14">
      
      {/* Header */}
      <div className="mb-16 max-w-2xl">
        <h1 className="mb-6 text-5xl font-extrabold text-white sm:text-6xl">
          Selected Works.
        </h1>
        <p className="text-lg leading-relaxed text-gray-400">
          A showcase of our recent digital transformations, stripped down to the raw results and architecture.
        </p>
      </div>

      {/* Flat Grid Layout */}
      <div className="grid gap-8 md:grid-cols-2">
        
        {/* Project Card 1 */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111111] transition-colors hover:border-white/30">
          <div className="aspect-video w-full bg-[#1A1A1A]"></div> {/* Image Placeholder */}
          <div className="p-8">
            <p className="mb-2 text-sm font-semibold tracking-widest text-[#C6F04F] uppercase">Fintech</p>
            <h3 className="mb-3 text-2xl font-bold text-white">Global Payment Gateway</h3>
            <p className="text-gray-400">Complete architectural overhaul handling $2M+ daily volume with zero downtime.</p>
          </div>
        </div>

        {/* Project Card 2 */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111111] transition-colors hover:border-white/30">
          <div className="aspect-video w-full bg-[#1A1A1A]"></div> {/* Image Placeholder */}
          <div className="p-8">
            <p className="mb-2 text-sm font-semibold tracking-widest text-[#C6F04F] uppercase">Healthcare</p>
            <h3 className="mb-3 text-2xl font-bold text-white">Patient Portal App</h3>
            <p className="text-gray-400">HIPAA-compliant mobile application that increased patient engagement by 300%.</p>
          </div>
        </div>

        {/* Project Card 3 */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111111] transition-colors hover:border-white/30">
          <div className="aspect-video w-full bg-[#1A1A1A]"></div> {/* Image Placeholder */}
          <div className="p-8">
            <p className="mb-2 text-sm font-semibold tracking-widest text-[#C6F04F] uppercase">E-Commerce</p>
            <h3 className="mb-3 text-2xl font-bold text-white">Headless Storefront</h3>
            <p className="text-gray-400">Migration to a modern Next.js stack, dropping page load times to under 0.8 seconds.</p>
          </div>
        </div>

        {/* Project Card 4 */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111111] transition-colors hover:border-white/30">
          <div className="aspect-video w-full bg-[#1A1A1A]"></div> {/* Image Placeholder */}
          <div className="p-8">
            <p className="mb-2 text-sm font-semibold tracking-widest text-[#C6F04F] uppercase">SaaS</p>
            <h3 className="mb-3 text-2xl font-bold text-white">Analytics Dashboard</h3>
            <p className="text-gray-400">Real-time data visualization platform processing millions of events per minute.</p>
          </div>
        </div>

      </div>
    </main>
  );
}