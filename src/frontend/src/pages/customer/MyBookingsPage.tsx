import { Link, useNavigate } from '@tanstack/react-router';
import { useGetMyBookings, useGetServiceCategories } from '../../hooks/useQueries';
import { Calendar, MapPin } from 'lucide-react';

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const { data: bookings = [], isLoading } = useGetMyBookings();
  const { data: categories = [] } = useGetServiceCategories();

  const getCategoryName = (id: bigint) => {
    const category = categories.find(c => c.id === id);
    return category?.name || 'Unknown Service';
  };

  const upcomingBookings = bookings.filter(b => 
    b.status === 'pending' || b.status === 'confirmed' || b.status === 'inProgress'
  );

  const historyBookings = bookings.filter(b => 
    b.status === 'completed' || b.status === 'cancelled'
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <Link
          to="/customer/book"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Book New Service
        </Link>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Upcoming Bookings</h2>
        {upcomingBookings.length === 0 ? (
          <div className="bg-card border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No upcoming bookings</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {upcomingBookings.map((booking) => (
              <button
                key={booking.id.toString()}
                onClick={() => navigate({ to: '/customer/bookings/$bookingId', params: { bookingId: booking.id.toString() } })}
                className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow text-left w-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{getCategoryName(booking.category)}</h3>
                    <p className="text-sm text-muted-foreground">Booking #{booking.id.toString()}</p>
                  </div>
                  <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary capitalize">
                    {booking.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{booking.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{booking.address}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">History</h2>
        {historyBookings.length === 0 ? (
          <div className="bg-card border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No booking history</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {historyBookings.map((booking) => (
              <button
                key={booking.id.toString()}
                onClick={() => navigate({ to: '/customer/bookings/$bookingId', params: { bookingId: booking.id.toString() } })}
                className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow opacity-75 text-left w-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{getCategoryName(booking.category)}</h3>
                    <p className="text-sm text-muted-foreground">Booking #{booking.id.toString()}</p>
                  </div>
                  <span className="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground capitalize">
                    {booking.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{booking.timeSlot}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
