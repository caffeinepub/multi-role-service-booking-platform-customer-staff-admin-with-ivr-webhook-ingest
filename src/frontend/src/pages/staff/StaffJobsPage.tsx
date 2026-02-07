import { useNavigate } from '@tanstack/react-router';
import { useGetAllBookings, useGetServiceCategories } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Calendar, MapPin } from 'lucide-react';

export default function StaffJobsPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: allBookings = [] } = useGetAllBookings();
  const { data: categories = [] } = useGetServiceCategories();

  const myBookings = allBookings.filter(b => 
    b.assignedStaff?.toString() === identity?.getPrincipal().toString()
  );

  const getCategoryName = (id: bigint) => {
    const category = categories.find(c => c.id === id);
    return category?.name || 'Unknown Service';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Jobs</h1>

      {myBookings.length === 0 ? (
        <div className="bg-card border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">No jobs assigned yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {myBookings.map((booking) => (
            <button
              key={booking.id.toString()}
              onClick={() => navigate({ to: '/staff/jobs/$bookingId', params: { bookingId: booking.id.toString() } })}
              className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow text-left w-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{getCategoryName(booking.category)}</h3>
                  <p className="text-sm text-muted-foreground">Job #{booking.id.toString()}</p>
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
  );
}
