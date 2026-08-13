import { useCallback, useState } from 'react'
import { getTickets } from '../api/tickets'
import { mapTicket } from '../utils/mapTicket'

export function useTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTickets = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getTickets()
      const mapped = Array.isArray(data) ? data.map(mapTicket) : []
      setTickets(mapped)
      return mapped
    } catch (err) {
      setError(err.message)
      setTickets([])
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  return { tickets, loading, error, loadTickets }
}
