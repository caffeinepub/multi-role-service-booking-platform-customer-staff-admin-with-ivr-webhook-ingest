import { Link, useNavigate } from '@tanstack/react-router';
import { useGetAllBookings } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Calendar, Briefcase, Clock } from 'lucide-react';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: allBookings = [] } = useGetAllBookings();

  const myBookings = allBookings.filter(b => 
    b.assignedStaff?.toString() === identity?.getPrincipal().toString()
  );

  const todayBookings = myBookings.filter(b => 
    b.status === 'confirmed' || b.status === 'inProgress'
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Staff Dashboard</h1>
        <p className="text-muted-foreground">Manage your assigned jobs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-6">
          <Briefcase className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold mb-1">Total Assigned</h3>
          <p className="text-3xl font-bold">{myBookings.length}</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <Clock className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold mb-1">Today's Jobs</h3>
          <p className="text-3xl font-bold">{todayBookings.length}</p>
        </div>

        <Link to="/staff/schedule" className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
          <Calendar className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold mb-1">View Schedule</h3>
          <p className="text-sm text-muted-foreground">Check your calendar</p>
        </Link>
      </div>

      {todayBookings.length > 0 && (
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Jobs</h2>
          <div className="space-y-3">
            {todayBookings.map((booking) => (
              <button
                key={booking.id.toString()}
                onClick={() => navigate({ to: '/staff/jobs/$bookingId', params: { bookingId: booking.id.toString() } })}
                className="block w-full text-left p-4 bg-accent/10 rounded-md hover:bg-accent/20 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Job #{booking.id.toString()}</p>
                    <p className="text-sm text-muted-foreground">{booking.timeSlot}</p>
                    <p className="text-sm text-muted-foreground">{booking.address}</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary capitalize">
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
