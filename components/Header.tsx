import Link from "next/link";

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-14" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 text-2xl font-extrabold text-white tracking-tight">
            Make It Happen
          </Link>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-10">
          <Link href="/services" className="text-sm font-medium leading-6 text-white/80 transition-colors hover:text-[#D7FF65]">Services</Link>
          <Link href="/projects" className="text-sm font-medium leading-6 text-white/80 transition-colors hover:text-[#D7FF65]">Projects</Link>
          <Link href="/blog" className="text-sm font-medium leading-6 text-white/80 transition-colors hover:text-[#D7FF65]">Blog</Link>
          <Link href="/about" className="text-sm font-medium leading-6 text-white/80 transition-colors hover:text-[#D7FF65]">About</Link>
          <Link href="/contact" className="text-sm font-medium leading-6 text-white/80 transition-colors hover:text-[#D7FF65]">Contact</Link>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link 
            href="/contact" 
            className="rounded-full bg-[#D7FF65] px-7 py-2.5 text-sm font-bold text-[#0c1016] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Contact Us
          </Link>
        </div>
      </nav>
    </header>
  );
}