import { useState } from 'react'
import Layout from './components/Layout'
import CreateTicket from './pages/CreateTicket'
import SupportTickets from './pages/SupportTickets'
import TicketSuccess from './pages/TicketSuccess'

function App() {
  const [page, setPage] = useState('create')
  const [createdTicket, setCreatedTicket] = useState(null)

  const handleNavigate = (next) => {
    setPage(next)
    if (next !== 'success') setCreatedTicket(null)
  }

  return (
    <Layout activePage={page} onNavigate={handleNavigate}>
      {page === 'create' && (
        <CreateTicket
          onSubmitSuccess={(ticket) => {
            setCreatedTicket(ticket)
            setPage('success')
          }}
        />
      )}
      {page === 'success' && (
        <TicketSuccess
          ticket={createdTicket}
          onViewTickets={() => handleNavigate('tickets')}
          onCreateAnother={() => handleNavigate('create')}
        />
      )}
      {page === 'tickets' && (
        <SupportTickets onNewTicket={() => handleNavigate('create')} />
      )}
    </Layout>
  )
}

export default App
