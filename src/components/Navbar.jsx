const LINKS = [
  { label: 'Projects', href: '#projects' },
  { label: 'Studio', href: '#studio' },
  { label: 'Careers', href: '#careers' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  return (
    <header className="relative z-20 w-full px-6 pt-6 md:px-10">
      <nav className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white/80 md:text-xs">
        <ul className="hidden flex-wrap gap-x-8 gap-y-2 justify-self-start md:flex">
          {LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#"
          className="flex h-10 w-10 items-center justify-center justify-self-center rounded-full border border-white/15 bg-white/5 text-lg backdrop-blur-sm transition-colors hover:bg-white/10"
          aria-label="Home"
        >
          <span aria-hidden>🐾</span>
        </a>

        <div className="flex justify-end justify-self-end">
          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/5 md:hidden"
            aria-label="Open menu"
          >
            <span className="h-px w-5 bg-white" />
            <span className="h-px w-5 bg-white" />
            <span className="h-px w-5 bg-white" />
          </button>
        </div>
      </nav>
    </header>
  )
}
