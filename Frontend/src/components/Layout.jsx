import { useState } from 'react'
import { Bot, User } from 'lucide-react'

export default function Layout({ activePage, onNavigate, children }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navActive =
    activePage === 'success' ? 'create' : activePage

  const linkClass = (page) =>
    `text-sm transition-colors ${
      navActive === page
        ? 'font-semibold text-brand'
        : 'font-medium text-slate-500 hover:text-slate-700'
    }`

  return (
    <div className="relative flex min-h-screen flex-col font-sans text-navy">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            activePage === 'create' || activePage === 'success'
              ? 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 45%, #eff6ff 100%)'
              : '#f8fafc',
        }}
      />

      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => onNavigate('create')}
            className="flex items-center gap-2"
          >
            <Bot className="h-6 w-6 text-brand" strokeWidth={2.25} />
            <span className="text-base font-bold tracking-tight text-navy sm:text-lg">
              TicketIQ
            </span>
          </button>

          <nav className="hidden items-center gap-6 sm:flex">
            <button
              type="button"
              onClick={() => onNavigate('create')}
              className={linkClass('create')}
            >
              Create Ticket
            </button>
            <button
              type="button"
              onClick={() => onNavigate('tickets')}
              className={linkClass('tickets')}
            >
              Support Tickets
            </button>
            <button
              type="button"
              aria-label="Profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow-sm transition-colors hover:bg-brand-dark"
            >
              <User className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </nav>

          <div className="flex items-center gap-3 sm:hidden">
            <button
              type="button"
              aria-label="Profile"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white"
            >
              <User className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 rounded-md text-slate-600"
            >
              <span
                className={`block h-0.5 w-5 rounded bg-current transition ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
              />
              <span
                className={`block h-0.5 w-5 rounded bg-current transition ${menuOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`block h-0.5 w-5 rounded bg-current transition ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
              />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 sm:hidden">
            <button
              type="button"
              onClick={() => {
                onNavigate('create')
                setMenuOpen(false)
              }}
              className={`block w-full py-2 text-left ${linkClass('create')}`}
            >
              Create Ticket
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate('tickets')
                setMenuOpen(false)
              }}
              className={`block w-full py-2 text-left ${linkClass('tickets')}`}
            >
              Support Tickets
            </button>
          </div>
        )}
      </header>

      <div className="flex flex-1 flex-col">{children}</div>

      <footer className="border-t border-slate-200/80 bg-white/70">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-3 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-6 sm:text-sm lg:px-8">
          <p>© {new Date().getFullYear()} TicketIQ. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <a href="#privacy" className="transition-colors hover:text-slate-700">
              Privacy Policy
            </a>
            <a href="#terms" className="transition-colors hover:text-slate-700">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
