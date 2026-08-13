import { formatTicketId } from '../api/tickets'

const AVATAR_COLORS = [
  'bg-orange-400 text-white',
  'bg-sky-400 text-white',
  'bg-pink-400 text-white',
  'bg-violet-400 text-white',
  'bg-emerald-400 text-white',
  'bg-amber-400 text-white',
]

export function initialsFromName(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function avatarClassForId(id) {
  if (typeof id === 'number') return AVATAR_COLORS[id % AVATAR_COLORS.length]
  const text = String(id)
  let hash = 0
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash + text.charCodeAt(i)) % AVATAR_COLORS.length
  }
  return AVATAR_COLORS[hash]
}

export function formatTime(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function mapTicket(ticket) {
  const name = ticket.customerName || 'Unknown'
  const question = ticket.question || ''
  const displayId = formatTicketId(ticket.id)

  return {
    id: ticket.id,
    displayId,
    name,
    initials: initialsFromName(name) || '?',
    avatarClass: avatarClassForId(ticket.id),
    email: ticket.email,
    category: ticket.category || 'General',
    questionShort: question.length > 28 ? `${question.slice(0, 28)}...` : question,
    inquiry: question,
    createdAt: ticket.createdAt || '',
    time: formatTime(ticket.createdAt),
    analysis: {
      intent: `${ticket.category || 'General'} support request`,
      systemCheck: `Ticket ${displayId} classified as ${ticket.category || 'General'}.`,
      suggestedAction: 'Automated response sent to the customer.',
    },
    aiResponse: ticket.aiResponse || 'No AI response available yet.',
  }
}

export function filterAndSortTickets(tickets, { search, categoryFilter, sortBy }) {
  const q = search.trim().toLowerCase()

  let list = tickets.filter((t) => {
    const matchesCategory =
      categoryFilter === 'all' || t.category === categoryFilter
    if (!matchesCategory) return false
    if (!q) return true
    return (
      t.name.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.inquiry.toLowerCase().includes(q) ||
      t.questionShort.toLowerCase().includes(q) ||
      t.displayId.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    )
  })

  list = [...list].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'category-asc':
        return a.category.localeCompare(b.category)
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return list
}
