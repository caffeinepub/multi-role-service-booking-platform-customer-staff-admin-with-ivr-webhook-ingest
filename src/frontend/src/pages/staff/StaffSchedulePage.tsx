import { useGetAllBookings, useGetServiceCategories } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Calendar } from 'lucide-react';

export default function StaffSchedulePage() {
  const { identity } = useInternetIdentity();
  const { data: allBookings = [] } = useGetAllBookings();
  const { data: categories = [] } = useGetServiceCategories();

  const myBookings = allBookings.filter(b => 
    b.assignedStaff?.toString() === identity?.getPrincipal().toString() &&
    (b.status === 'confirmed' || b.status === 'inProgress')
  );

  const getCategoryName = (id: bigint) => {
    const category = categories.find(c => c.id === id);
    return category?.name || 'Unknown Service';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">My Schedule</h1>
      </div>

      {myBookings.length === 0 ? (
        <div className="bg-card border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">No scheduled jobs</p>
        </div>
      ) : (
        <div className="bg-card border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Time Slot</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Service</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Location</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {myBookings.map((booking) => (
                <tr key={booking.id.toString()} className="hover:bg-accent/5">
                  <td className="px-6 py-4 text-sm">{booking.timeSlot}</td>
                  <td className="px-6 py-4 text-sm font-medium">{getCategoryName(booking.category)}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{booking.address}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary capitalize">
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
