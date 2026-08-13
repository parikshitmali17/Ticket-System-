import { useCallback, useEffect, useMemo, useState } from 'react'
import { filterAndSortTickets } from '../utils/mapTicket'
import { useTickets } from '../hooks/useTickets'
import { useFilterSortMenus } from '../hooks/useFilterSortMenus'
import TicketsHeader from '../components/tickets/TicketsHeader'
import TicketToolbar from '../components/tickets/TicketToolbar'
import TicketTable from '../components/tickets/TicketTable'
import TicketDetailPanel from '../components/tickets/TicketDetailPanel'

export default function SupportTickets({ onNewTicket }) {
  const { tickets, loading, error, loadTickets } = useTickets()
  const {
    filterOpen,
    setFilterOpen,
    sortOpen,
    setSortOpen,
    filterRef,
    sortRef,
  } = useFilterSortMenus()

  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [detailOpen, setDetailOpen] = useState(true)

  const refreshTickets = useCallback(async () => {
    const mapped = await loadTickets()
    if (mapped.length) {
      setSelectedId(mapped[0].id)
      setDetailOpen(true)
    } else {
      setSelectedId(null)
    }
  }, [loadTickets])

  useEffect(() => {
    refreshTickets()
  }, [refreshTickets])

  const visibleTickets = useMemo(
    () => filterAndSortTickets(tickets, { search, categoryFilter, sortBy }),
    [search, tickets, categoryFilter, sortBy],
  )

  useEffect(() => {
    if (!visibleTickets.length) {
      if (selectedId != null && !tickets.some((t) => t.id === selectedId)) {
        setSelectedId(null)
      }
      return
    }
    if (!visibleTickets.some((t) => t.id === selectedId)) {
      setSelectedId(visibleTickets[0].id)
    }
  }, [visibleTickets, selectedId, tickets])

  const selected = tickets.find((t) => t.id === selectedId) || null

  const selectTicket = (id) => {
    setSelectedId(id)
    setDetailOpen(true)
  }

  const closeDetail = () => {
    setDetailOpen(false)
  }

  return (
    <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <TicketsHeader ticketCount={tickets.length} onNewTicket={onNewTicket} />

      <TicketToolbar
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={tickets.length}
        visibleCount={visibleTickets.length}
        filterOpen={filterOpen}
        onFilterOpenChange={setFilterOpen}
        sortOpen={sortOpen}
        onSortOpenChange={setSortOpen}
        filterRef={filterRef}
        sortRef={sortRef}
      />

      {error && (
        <div
          role="alert"
          className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={refreshTickets}
            className="font-semibold text-red-800 underline-offset-2 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12 xl:gap-6">
        <div className="xl:col-span-7 2xl:col-span-8">
          <TicketTable
            tickets={visibleTickets}
            totalCount={tickets.length}
            loading={loading}
            selectedId={selectedId}
            detailOpen={detailOpen}
            onSelect={selectTicket}
          />
        </div>

        <div className="hidden xl:col-span-5 xl:block 2xl:col-span-4">
          {detailOpen && selected ? (
            <div className="sticky top-20 h-[calc(100vh-8rem)]">
              <TicketDetailPanel ticket={selected} onClose={closeDetail} />
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 text-sm text-slate-400">
              Select a ticket to view details
            </div>
          )}
        </div>
      </div>

      {detailOpen && selected && (
        <div className="fixed inset-0 z-40 xl:hidden">
          <button
            type="button"
            aria-label="Close overlay"
            className="absolute inset-0 bg-slate-900/40"
            onClick={closeDetail}
          />
          <div className="absolute inset-x-0 bottom-0 top-14 flex flex-col sm:inset-y-4 sm:right-4 sm:left-auto sm:w-[min(100%,420px)]">
            <div className="h-full sm:rounded-2xl sm:shadow-2xl">
              <TicketDetailPanel ticket={selected} onClose={closeDetail} />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
