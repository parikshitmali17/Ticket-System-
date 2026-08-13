import { CheckCircle2, Wrench, Sparkles, ArrowRight, Plus, CreditCard, UserRound, HelpCircle } from 'lucide-react'
import CategoryBadge from '../components/CategoryBadge'

const CATEGORY_ICONS = {
  Technical: Wrench,
  Billing: CreditCard,
  Account: UserRound,
  General: HelpCircle,
}

export default function TicketSuccess({ ticket, onViewTickets, onCreateAnother }) {
  const {
    name = 'Sarah Jenkins',
    category = 'Technical',
    ticketId = '#TCK-8921-A',
    aiResponse,
  } = ticket || {}

  const CategoryIcon = CATEGORY_ICONS[category] || HelpCircle

  const response =
    aiResponse ||
    `Hi ${name.split(' ')[0]}, I've analyzed your report regarding the rate limiting errors. This appears to be a known incident (INC-442) affecting the East-US region. I've escalated this to the Tier 2 engineering team and applied a temporary rate-limit exemption to your API key.`

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-[0_8px_40px_rgba(15,23,42,0.08)] sm:p-8 md:p-10">
        {/* Success icon */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 sm:mb-6 sm:h-16 sm:w-16">
          <CheckCircle2 className="h-8 w-8 text-brand sm:h-9 sm:w-9" strokeWidth={2} />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
          Ticket Created Successfully
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Your request has been logged and assigned an ID.
        </p>

        {/* Ticket meta bar */}
        <div className="mt-6 grid grid-cols-1 gap-4 rounded-xl bg-indigo-50/80 px-4 py-4 text-left sm:mt-8 sm:grid-cols-3 sm:gap-2 sm:px-5 sm:py-5">
          <div className="min-w-0 sm:pr-2">
            <p className="text-xs font-medium text-slate-500">Customer</p>
            <p className="mt-1 truncate text-sm font-bold text-navy sm:text-[15px]">
              {name}
            </p>
          </div>
          <div className="min-w-0 sm:border-l sm:border-indigo-100/80 sm:px-4">
            <p className="text-xs font-medium text-slate-500">Category</p>
            <CategoryBadge category={category} className="mt-1.5 gap-1">
              <CategoryIcon className="h-3 w-3" strokeWidth={2.5} />
              {category}
            </CategoryBadge>
          </div>
          <div className="min-w-0 sm:border-l sm:border-indigo-100/80 sm:pl-4">
            <p className="text-xs font-medium text-slate-500">Ticket ID</p>
            <p className="mt-1 font-mono text-sm font-bold tracking-tight text-navy sm:text-[15px]">
              {ticketId}
            </p>
          </div>
        </div>

        {/* AI Assistant Response */}
        <div className="mt-5 rounded-xl border-l-4 border-brand bg-blue-50 px-4 py-4 text-left sm:mt-6 sm:px-5 sm:py-5">
          <div className="mb-2.5 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-brand" strokeWidth={2.25} />
            <h2 className="text-sm font-bold text-brand">AI Assistant Response</h2>
          </div>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-[15px]">
            {response}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onViewTickets}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/40 focus:ring-offset-2"
          >
            View All Tickets
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={onCreateAnother}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2"
          >
            Create Another Ticket
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </main>
  )
}
