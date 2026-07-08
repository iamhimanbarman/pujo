import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-[var(--gradient-footer)] text-[var(--text-inverse)] pt-16 pb-8 border-t border-[var(--border-strong)]">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-4 md:col-span-2">
          <Link href="/" className="inline-block outline-none focus-visible:ring-3 focus-visible:ring-brand rounded-md w-fit">
            <span className="font-display font-bold text-3xl tracking-tight text-white">
              Sharod<span className="text-[var(--gold-400)]">Darshan</span>
            </span>
          </Link>
          <p className="text-[var(--text-disabled)] max-w-[42ch] font-light leading-relaxed">
            A public visual directory preserving the cultural heritage, artistry, and emotion of Durga Pujo across West Bengal.
          </p>
        </div>

        {/* Links Column 1 */}
        <div className="flex flex-col gap-4">
          <h4 className="font-heading font-semibold text-white tracking-wide">Explore</h4>
          <nav className="flex flex-col gap-2.5">
            <Link href="/search" className="text-[var(--text-disabled)] hover:text-white transition-colors text-[var(--font-footer)] w-fit">Search Pujos</Link>
            <Link href="/districts" className="text-[var(--text-disabled)] hover:text-white transition-colors text-[var(--font-footer)] w-fit">Browse Districts</Link>
            <Link href="/area/salt-lake" className="text-[var(--text-disabled)] hover:text-white transition-colors text-[var(--font-footer)] w-fit">Salt Lake</Link>
            <Link href="/area/jadavpur" className="text-[var(--text-disabled)] hover:text-white transition-colors text-[var(--font-footer)] w-fit">Jadavpur</Link>
          </nav>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col gap-4">
          <h4 className="font-heading font-semibold text-white tracking-wide">Contribute</h4>
          <nav className="flex flex-col gap-2.5">
            <Link href="/upload" className="text-[var(--text-disabled)] hover:text-[var(--gold-400)] transition-colors text-[var(--font-footer)] w-fit">Submit Image</Link>
            <Link href="/login" className="text-[var(--text-disabled)] hover:text-white transition-colors text-[var(--font-footer)] w-fit">Creator Login</Link>
            <Link href="/guidelines" className="text-[var(--text-disabled)] hover:text-white transition-colors text-[var(--font-footer)] w-fit">Upload Guidelines</Link>
          </nav>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10 text-[var(--text-disabled)] text-sm">
        <p>© {currentYear} Sharod Darshan. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
