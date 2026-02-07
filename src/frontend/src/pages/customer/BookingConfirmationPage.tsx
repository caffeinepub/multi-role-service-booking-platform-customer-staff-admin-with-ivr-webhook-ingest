import { Link, useParams } from '@tanstack/react-router';
import { CheckCircle } from 'lucide-react';

export default function BookingConfirmationPage() {
  const { bookingId } = useParams({ strict: false }) as { bookingId: string };

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
      <p className="text-muted-foreground mb-8">
        Your service has been booked successfully. We'll notify you once a staff member is assigned.
      </p>

      <div className="bg-card border rounded-lg p-6 mb-8">
        <p className="text-sm text-muted-foreground mb-2">Booking ID</p>
        <p className="text-2xl font-bold">#{bookingId}</p>
      </div>

      <div className="flex gap-4 justify-center">
        <Link
          to="/customer/bookings"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          View My Bookings
        </Link>
        <Link
          to="/"
          className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
