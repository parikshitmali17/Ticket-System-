const API_BASE = import.meta.env.VITE_API_URL ?? ''

export class ApiError extends Error {
  constructor(message, { status = 500, success = false } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.success = success
  }
}

async function readError(res) {
  try {
    const data = await res.json()
    return {
      message: data.message || 'Something went wrong. Please try again.',
      success: data.success === false ? false : undefined,
    }
  } catch {
    return { message: 'Something went wrong. Please try again.' }
  }
}

async function request(path, options) {
  let res
  try {
    res = await fetch(`${API_BASE}${path}`, options)
  } catch {
    throw new ApiError(
      'Unable to reach the server. Start the backend on port 5000 and try again.',
      { status: 0 },
    )
  }

  if (!res.ok) {
    const { message, success } = await readError(res)
    throw new ApiError(message, { status: res.status, success })
  }

  return res.json()
}

export function formatTicketId(id) {
  if (id == null) return 'TKT-0000'
  return `TKT-${String(id).padStart(4, '0')}`
}

export async function createTicket({ customerName, email, question }) {
  return request('/api/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerName, email, question }),
  })
}

export async function getTickets() {
  return request('/api/tickets')
}
