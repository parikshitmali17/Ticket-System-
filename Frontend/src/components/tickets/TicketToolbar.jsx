import { ArrowUpDown, Filter, Search, X } from 'lucide-react'
import { CATEGORIES } from '../../constants/categories'
import { SORT_OPTIONS } from '../../constants/sortOptions'
import { MenuItem, MenuPanel } from '../DropdownMenu'

export default function TicketToolbar({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortChange,
  totalCount,
  visibleCount,
  filterOpen,
  onFilterOpenChange,
  sortOpen,
  onSortOpenChange,
  filterRef,
  sortRef,
}) {
  const filterActive = categoryFilter !== 'all'
  const sortActive = sortBy !== 'newest'
  const activeSortLabel =
    SORT_OPTIONS.find((option) => option.value === sortBy)?.label || 'Sort'

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by customer, email, category, or question..."
            className="w-full rounded-lg border border-transparent bg-slate-100 py-2.5 pr-3 pl-10 text-sm text-navy placeholder:text-slate-400 outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:flex-none" ref={filterRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={filterOpen}
              onClick={() => {
                onFilterOpenChange(!filterOpen)
                onSortOpenChange(false)
              }}
              className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition sm:w-auto ${
                filterActive
                  ? 'border-brand/30 bg-blue-50 text-brand'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter className="h-4 w-4" />
              {filterActive ? categoryFilter : 'Filter'}
            </button>
            <MenuPanel open={filterOpen}>
              <MenuItem
                active={categoryFilter === 'all'}
                onClick={() => {
                  onCategoryFilterChange('all')
                  onFilterOpenChange(false)
                }}
              >
                All categories
              </MenuItem>
              {CATEGORIES.map((category) => (
                <MenuItem
                  key={category}
                  active={categoryFilter === category}
                  onClick={() => {
                    onCategoryFilterChange(category)
                    onFilterOpenChange(false)
                  }}
                >
                  {category}
                </MenuItem>
              ))}
            </MenuPanel>
          </div>

          <div className="relative flex-1 sm:flex-none" ref={sortRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={sortOpen}
              onClick={() => {
                onSortOpenChange(!sortOpen)
                onFilterOpenChange(false)
              }}
              className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition sm:w-auto ${
                sortActive
                  ? 'border-brand/30 bg-blue-50 text-brand'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortActive ? activeSortLabel : 'Sort'}
            </button>
            <MenuPanel open={sortOpen}>
              {SORT_OPTIONS.map((option) => (
                <MenuItem
                  key={option.value}
                  active={sortBy === option.value}
                  onClick={() => {
                    onSortChange(option.value)
                    onSortOpenChange(false)
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </MenuPanel>
          </div>
        </div>
      </div>

      {(filterActive || search.trim()) && (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span>
            Showing {visibleCount} of {totalCount} ticket
            {totalCount === 1 ? '' : 's'}
          </span>
          {filterActive && (
            <button
              type="button"
              onClick={() => onCategoryFilterChange('all')}
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Category: {categoryFilter}
              <X className="h-3 w-3" />
            </button>
          )}
          {search.trim() && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Search: “{search.trim()}”
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
    </>
  )
}
