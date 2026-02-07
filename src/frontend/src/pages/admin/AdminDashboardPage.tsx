import { Link } from '@tanstack/react-router';
import { useGetAllBookings } from '../../hooks/useQueries';
import { Users, Calendar, Package, CreditCard, Phone, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const { data: bookings = [] } = useGetAllBookings();

  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const inProgressCount = bookings.filter(b => b.status === 'inProgress').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your service platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold">{pendingCount}</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Confirmed</h3>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold">{confirmedCount}</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">In Progress</h3>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold">{inProgressCount}</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold">{completedCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/admin/users" className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
          <Users className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold mb-1">User Management</h3>
          <p className="text-sm text-muted-foreground">Manage customers and staff</p>
        </Link>

        <Link to="/admin/allocation" className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
          <Calendar className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold mb-1">Job Allocation</h3>
          <p className="text-sm text-muted-foreground">Assign staff to bookings</p>
        </Link>

        <Link to="/admin/services" className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
          <Package className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold mb-1">Services</h3>
          <p className="text-sm text-muted-foreground">Manage categories & plans</p>
        </Link>

        <Link to="/admin/payments" className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
          <CreditCard className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold mb-1">Payments</h3>
          <p className="text-sm text-muted-foreground">Track & reconcile payments</p>
        </Link>

        <Link to="/admin/support" className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
          <Settings className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold mb-1">Support & Feedback</h3>
          <p className="text-sm text-muted-foreground">Review tickets & ratings</p>
        </Link>

        <Link to="/admin/ivr-settings" className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
          <Phone className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold mb-1">IVR Settings</h3>
          <p className="text-sm text-muted-foreground">Configure IVR integration</p>
        </Link>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        <div className="space-y-2">
          {bookings.slice(0, 5).map((booking) => (
            <div key={booking.id.toString()} className="flex justify-between items-center p-3 bg-accent/10 rounded-md">
              <div>
                <p className="font-medium">Booking #{booking.id.toString()}</p>
                <p className="text-sm text-muted-foreground">{booking.timeSlot}</p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary capitalize">
                {booking.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
