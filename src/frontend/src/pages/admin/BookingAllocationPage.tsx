import { useState } from 'react';
import { useGetAllBookings, useAssignStaffToBooking, useGetServiceCategories } from '../../hooks/useQueries';
import { Principal } from '@dfinity/principal';

export default function BookingAllocationPage() {
  const { data: bookings = [] } = useGetAllBookings();
  const { data: categories = [] } = useGetServiceCategories();
  const assignStaff = useAssignStaffToBooking();

  const [selectedBooking, setSelectedBooking] = useState<bigint | null>(null);
  const [staffPrincipal, setStaffPrincipal] = useState('');

  const unassignedBookings = bookings.filter(b => !b.assignedStaff && b.status === 'pending');
  const staff = Array.from(new Set(bookings.filter(b => b.assignedStaff).map(b => b.assignedStaff!.toString())));

  const getCategoryName = (id: bigint) => {
    const category = categories.find(c => c.id === id);
    return category?.name || 'Unknown Service';
  };

  const handleAssign = async () => {
    if (!selectedBooking || !staffPrincipal) return;

    try {
      await assignStaff.mutateAsync({
        bookingId: selectedBooking,
        staffPrincipal: Principal.fromText(staffPrincipal),
      });
      setSelectedBooking(null);
      setStaffPrincipal('');
      alert('Staff assigned successfully!');
    } catch (error: any) {
      alert('Failed to assign staff: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Job Allocation</h1>

      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Unassigned Bookings</h2>
        {unassignedBookings.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No unassigned bookings</p>
        ) : (
          <div className="space-y-3">
            {unassignedBookings.map((booking) => (
              <div
                key={booking.id.toString()}
                className={`p-4 rounded-md border cursor-pointer transition-colors ${
                  selectedBooking === booking.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-accent/5'
                }`}
                onClick={() => setSelectedBooking(booking.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{getCategoryName(booking.category)}</p>
                    <p className="text-sm text-muted-foreground">Booking #{booking.id.toString()}</p>
                    <p className="text-sm text-muted-foreground">{booking.timeSlot}</p>
                    <p className="text-sm text-muted-foreground">{booking.address}</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">
                    Unassigned
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBooking && (
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Assign Staff</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Staff Principal ID</label>
              <input
                type="text"
                value={staffPrincipal}
                onChange={(e) => setStaffPrincipal(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
                placeholder="Enter staff principal ID"
              />
            </div>

            {staff.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Available Staff:</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {staff.map((id) => (
                    <button
                      key={id}
                      onClick={() => setStaffPrincipal(id)}
                      className="block w-full text-left p-2 text-sm bg-accent/10 rounded hover:bg-accent/20 transition-colors"
                    >
                      {id.slice(0, 30)}...
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAssign}
              disabled={!staffPrincipal || assignStaff.isPending}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {assignStaff.isPending ? 'Assigning...' : 'Assign Staff'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
