import { Link, useNavigate } from '@tanstack/react-router';
import { useGetMyBookings, useGetServiceCategories } from '../../hooks/useQueries';
import { Calendar, Package, FileText, CreditCard } from 'lucide-react';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { data: bookings = [] } = useGetMyBookings();
  const { data: categories = [] } = useGetServiceCategories();

  const upcomingBookings = bookings.filter(b => 
    b.status === 'pending' || b.status === 'confirmed' || b.status === 'inProgress'
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-muted-foreground">Manage your bookings and explore our services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/customer/catalog" className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
          <Package className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold mb-1">Browse Services</h3>
          <p className="text-sm text-muted-foreground">{categories.length} categories available</p>
        </Link>

        <Link to="/customer/bookings" className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
          <Calendar className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold mb-1">My Bookings</h3>
          <p className="text-sm text-muted-foreground">{upcomingBookings.length} upcoming</p>
        </Link>

        <Link to="/customer/subscriptions" className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
          <CreditCard className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold mb-1">Subscriptions</h3>
          <p className="text-sm text-muted-foreground">Manage plans</p>
        </Link>

        <Link to="/customer/support" className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
          <FileText className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold mb-1">Support</h3>
          <p className="text-sm text-muted-foreground">Get help</p>
        </Link>
      </div>

      {upcomingBookings.length > 0 && (
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
          <div className="space-y-3">
            {upcomingBookings.slice(0, 3).map((booking) => (
              <button
                key={booking.id.toString()}
                onClick={() => navigate({ to: '/customer/bookings/$bookingId', params: { bookingId: booking.id.toString() } })}
                className="block w-full text-left p-4 bg-accent/10 rounded-md hover:bg-accent/20 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Booking #{booking.id.toString()}</p>
                    <p className="text-sm text-muted-foreground">{booking.timeSlot}</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                    {booking.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
