import { Bot, Link2, Mail, X } from 'lucide-react'
import CategoryBadge from '../CategoryBadge'

export default function TicketDetailPanel({ ticket, onClose }) {
  if (!ticket) return null

  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
        <span className="text-sm font-semibold text-brand">{ticket.displayId}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Copy link"
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
          >
            <Link2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Close details"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">
              {ticket.name}
            </h2>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{ticket.email}</span>
            </p>
          </div>
          <CategoryBadge category={ticket.category} />
        </div>

        <section>
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Customer Inquiry
            </h3>
            <span className="text-xs text-slate-400">{ticket.time}</span>
          </div>
          <div className="rounded-xl bg-slate-100/80 px-4 py-3 text-sm leading-relaxed text-slate-700">
            {ticket.inquiry}
          </div>
        </section>

        <section className="rounded-xl border-l-4 border-brand bg-blue-50 px-4 py-3">
          <div className="mb-2.5 flex items-center gap-1.5">
            <Bot className="h-4 w-4 text-brand" strokeWidth={2.25} />
            <h3 className="text-xs font-bold tracking-wider text-brand uppercase">
              AI Analysis
            </h3>
          </div>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>
              <span className="font-semibold text-slate-800">Intent Detected:</span>{' '}
              {ticket.analysis.intent}
            </li>
            <li>
              <span className="font-semibold text-slate-800">System Check:</span>{' '}
              {ticket.analysis.systemCheck}
            </li>
            <li>
              <span className="font-semibold text-slate-800">Suggested Action:</span>{' '}
              {ticket.analysis.suggestedAction}
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">AI Response</h3>
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-sm leading-relaxed whitespace-pre-line text-slate-700">
            {ticket.aiResponse}
          </div>
        </section>
      </div>
    </aside>
  )
}
