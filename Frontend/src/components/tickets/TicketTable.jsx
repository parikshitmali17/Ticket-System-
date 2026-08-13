import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import CategoryBadge from '../CategoryBadge'
import TicketAvatar from './TicketAvatar'

export default function TicketTable({
  tickets,
  totalCount,
  loading,
  selectedId,
  detailOpen,
  onSelect,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.05)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-100/80 text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <th className="px-4 py-3 sm:px-5">Customer</th>
              <th className="px-4 py-3 sm:px-5">Email</th>
              <th className="px-4 py-3 sm:px-5">Category</th>
              <th className="px-4 py-3 sm:px-5">Question</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-sm text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-brand" />
                    Loading tickets...
                  </span>
                </td>
              </tr>
            )}
            {!loading &&
              tickets.map((ticket) => {
                const isSelected = ticket.id === selectedId && detailOpen
                return (
                  <tr
                    key={ticket.id}
                    onClick={() => onSelect(ticket.id)}
                    className={`cursor-pointer border-t border-slate-100 transition hover:bg-slate-50/80 ${
                      isSelected ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <td className="relative px-4 py-3.5 sm:px-5">
                      {isSelected && (
                        <span className="absolute top-0 bottom-0 left-0 w-1 bg-brand" />
                      )}
                      <div className="flex items-center gap-2.5">
                        <TicketAvatar
                          initials={ticket.initials}
                          avatarClass={ticket.avatarClass}
                        />
                        <span
                          className={`font-semibold ${isSelected ? 'text-brand' : 'text-navy'}`}
                        >
                          {ticket.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 sm:px-5">
                      {ticket.email}
                    </td>
                    <td className="px-4 py-3.5 sm:px-5">
                      <CategoryBadge category={ticket.category} />
                    </td>
                    <td className="max-w-[180px] truncate px-4 py-3.5 text-slate-600 sm:max-w-[220px] sm:px-5">
                      {ticket.questionShort}
                    </td>
                  </tr>
                )
              })}
            {!loading && tickets.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-sm text-slate-500">
                  {totalCount === 0
                    ? 'No tickets yet. Create a ticket to get started.'
                    : 'No tickets match your search or filter.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-500 sm:px-5">
        <span>
          {tickets.length === 0
            ? 'Showing 0 of 0'
            : `Showing 1 to ${tickets.length} of ${totalCount}`}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous page"
            className="rounded-md p-1.5 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next page"
            className="rounded-md p-1.5 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
