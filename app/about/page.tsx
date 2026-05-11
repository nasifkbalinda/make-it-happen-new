export default function AboutPage() {
    return (
      <main className="mx-auto w-full max-w-7xl px-6 pt-24 pb-32 sm:px-10 lg:px-14">
        
        {/* 1. Hero Text Section */}
        <div className="mb-24 max-w-3xl">
          <h1 className="mb-6 text-5xl font-extrabold text-white sm:text-6xl">
            We engineer digital <br className="hidden sm:block" />
            excellence.
          </h1>
          <p className="text-lg leading-relaxed text-gray-400">
            Make It Happen was founded on a simple principle: technology should empower, not complicate. We are a collective of developers, designers, and strategists obsessed with building scalable, beautiful software for forward-thinking companies.
          </p>
        </div>
  
        {/* 2. Core Values Grid */}
        <div className="mb-24">
          <h2 className="mb-10 text-2xl font-bold tracking-tight text-white">Our Core Values</h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            
            {/* Card 1 */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-[#C6F04F]/50 hover:bg-white/10 hover:shadow-[0_10px_30px_rgba(198,240,79,0.1)]">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#C6F04F]/10 text-[#C6F04F]">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Relentless Innovation</h3>
              <p className="text-sm leading-relaxed text-gray-400">
                We don't settle for "good enough." We constantly push the boundaries of what modern tech stacks can achieve to give our clients an unfair advantage.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-pink-500/50 hover:bg-white/10 hover:shadow-[0_10px_30px_rgba(236,72,153,0.1)]">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500/10 text-pink-500">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Radical Collaboration</h3>
              <p className="text-sm leading-relaxed text-gray-400">
                We work with you, not just for you. Complete transparency, agile feedback loops, and constant communication are our operational baselines.
              </p>
            </div>
  
            {/* Card 3 */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/50 hover:bg-white/10 hover:shadow-[0_10px_30px_rgba(59,130,246,0.1)]">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Bulletproof Quality</h3>
              <p className="text-sm leading-relaxed text-gray-400">
                From the first line of code to the final deployment, security, scalability, and performance are meticulously built into our DNA.
              </p>
            </div>
  
          </div>
        </div>
  
      </main>
    );
  }