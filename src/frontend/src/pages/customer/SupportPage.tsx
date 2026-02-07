import { useState } from 'react';
import { useCreateSupportTicket, useGetMySupportTickets } from '../../hooks/useQueries';

export default function SupportPage() {
  const [message, setMessage] = useState('');
  const createTicket = useCreateSupportTicket();
  const { data: tickets = [] } = useGetMySupportTickets();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTicket.mutateAsync(message);
      setMessage('');
      alert('Support ticket created successfully!');
    } catch (error: any) {
      alert('Failed to create ticket: ' + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Support & Feedback</h1>
        <p className="text-muted-foreground">We're here to help</p>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Submit a Ticket</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Message *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
              rows={4}
              placeholder="Describe your issue or feedback..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={!message.trim() || createTicket.isPending}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {createTicket.isPending ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </form>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">My Tickets</h2>
        {tickets.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No tickets yet</p>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id.toString()} className="p-4 bg-accent/10 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium">Ticket #{ticket.id.toString()}</p>
                  <span className="px-2 py-1 text-xs rounded-full bg-muted capitalize">
                    {ticket.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{ticket.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
