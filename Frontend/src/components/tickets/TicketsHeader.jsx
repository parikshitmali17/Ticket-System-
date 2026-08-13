import { Plus, Ticket } from 'lucide-react'

export default function TicketsHeader({ ticketCount, onNewTicket }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
          Support Tickets
        </h1>
        <p className="mt-1 text-sm text-slate-500 sm:text-base">
          Manage and respond to customer inquiries.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 sm:text-sm">
          <Ticket className="h-3.5 w-3.5" />
          {ticketCount} Ticket{ticketCount === 1 ? '' : 's'} Total
        </span>
        <button
          type="button"
          onClick={onNewTicket}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          New Ticket
        </button>
      </div>
    </div>
  )
}
