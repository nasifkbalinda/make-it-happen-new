import Link from "next/link";

export default function ServicesPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 pt-24 pb-32 sm:px-10 lg:px-14">
      
      <h1 className="mb-6 text-5xl font-extrabold text-white">Our Services</h1>
      <p className="mb-16 max-w-2xl text-lg text-gray-400">
        We provide end-to-end IT solutions designed to scale your business, optimize your workflows, and secure your digital future.
      </p>

      {/* Services Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="flex h-64 flex-col justify-end rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-colors hover:bg-white/10">
          <h3 className="text-2xl font-bold text-white">Cloud Infrastructure</h3>
        </div>
        <div className="flex h-64 flex-col justify-end rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-colors hover:bg-white/10">
          <h3 className="text-2xl font-bold text-white">Cybersecurity</h3>
        </div>
        <div className="flex h-64 flex-col justify-end rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-colors hover:bg-white/10">
          <h3 className="text-2xl font-bold text-white">Custom Software</h3>
        </div>
      </div>
      
      <div className="mt-16">
        <Link href="/" className="inline-flex items-center text-[#C6F04F] transition-colors hover:text-white">
          <span aria-hidden className="mr-2 text-lg leading-none">&larr;</span>
          Back to Home
        </Link>
      </div>

    </main>
  );
}