import { useGetAllSupportTickets, useGetAllFeedback } from '../../hooks/useQueries';
import { Star } from 'lucide-react';

export default function SupportAndFeedbackPage() {
  const { data: tickets = [] } = useGetAllSupportTickets();
  const { data: feedback = [] } = useGetAllFeedback();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Support & Feedback</h1>

      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Support Tickets</h2>
        {tickets.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No tickets</p>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id.toString()} className="p-4 bg-accent/10 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">Ticket #{ticket.id.toString()}</p>
                    <p className="text-xs text-muted-foreground">{ticket.customerId.toString().slice(0, 15)}...</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-muted capitalize">
                    {ticket.status}
                  </span>
                </div>
                <p className="text-sm">{ticket.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Customer Feedback</h2>
        {feedback.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No feedback yet</p>
        ) : (
          <div className="space-y-3">
            {feedback.map((item) => (
              <div key={item.id.toString()} className="p-4 bg-accent/10 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">Booking #{item.bookingId.toString()}</p>
                    <div className="flex gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Number(item.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {item.comments && <p className="text-sm">{item.comments}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
