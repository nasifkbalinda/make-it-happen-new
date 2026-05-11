export default function ContactPage() {
    return (
      <main className="mx-auto w-full max-w-7xl px-6 pt-24 pb-32 sm:px-10 lg:px-14">
        
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          
          {/* Left Column: Contact Information */}
          <div className="flex flex-col justify-center">
            <h1 className="mb-6 text-5xl font-extrabold text-white sm:text-6xl">
              Let's build<br />something great.
            </h1>
            <p className="mb-12 max-w-md text-lg leading-relaxed text-gray-400">
              Whether you need a complete digital transformation, a new website, or a custom software solution, our team is ready to make it happen.
            </p>
  
            <div className="space-y-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-[#C6F04F]">Email Us</p>
                <a href="mailto:hello@makeithappen.com" className="mt-2 text-xl font-medium text-white transition-colors hover:text-gray-300">
                  hello@makeithappen.com
                </a>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-[#C6F04F]">Call Us</p>
                <p className="mt-2 text-xl font-medium text-white">
                  +1 (555) 123-4567
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-[#C6F04F]">Visit Us</p>
                <p className="mt-2 text-xl font-medium text-white">
                  123 Innovation Drive<br />Tech District, CA 90210
                </p>
              </div>
            </div>
          </div>
  
          {/* Right Column: The Glassmorphism Form */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg sm:p-10">
            <form className="flex flex-col gap-6">
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-white/70">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    placeholder="John"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 outline-none transition-all focus:border-[#C6F04F] focus:bg-white/10 focus:ring-1 focus:ring-[#C6F04F]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-white/70">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    placeholder="Doe"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 outline-none transition-all focus:border-[#C6F04F] focus:bg-white/10 focus:ring-1 focus:ring-[#C6F04F]"
                  />
                </div>
              </div>
  
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-white/70">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="john@company.com"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 outline-none transition-all focus:border-[#C6F04F] focus:bg-white/10 focus:ring-1 focus:ring-[#C6F04F]"
                />
              </div>
  
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-medium text-white/70">How can we help?</label>
                <textarea 
                  id="message" 
                  rows={5}
                  placeholder="Tell us about your project..."
                  className="resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 outline-none transition-all focus:border-[#C6F04F] focus:bg-white/10 focus:ring-1 focus:ring-[#C6F04F]"
                ></textarea>
              </div>
  
              <button 
                type="button" 
                className="mt-4 w-full rounded-full bg-gradient-to-r from-[#D7FF65] to-[#C6F04F] py-4 text-base font-bold text-[#111720] shadow-[0_0_20px_rgba(198,240,79,0.3)] transition-transform hover:-translate-y-1"
              >
                Send Message
              </button>
              
            </form>
          </div>
  
        </div>
      </main>
    );
  }