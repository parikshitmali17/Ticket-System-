import { Check } from 'lucide-react'

export function MenuPanel({ open, align = 'right', children }) {
  if (!open) return null
  return (
    <div
      className={`absolute top-full z-20 mt-2 min-w-[200px] rounded-xl border border-slate-200 bg-white py-1.5 shadow-[0_8px_30px_rgba(15,23,42,0.12)] ${
        align === 'left' ? 'left-0' : 'right-0'
      }`}
      role="menu"
    >
      {children}
    </div>
  )
}

export function MenuItem({ active, onClick, children }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left text-sm transition hover:bg-slate-50 ${
        active ? 'font-semibold text-brand' : 'font-medium text-slate-700'
      }`}
    >
      <span>{children}</span>
      {active && <Check className="h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} />}
    </button>
  )
}
