import { useParams, Link } from '@tanstack/react-router';
import { useGetAllBookings, useGetServiceCategories, useUpdateBookingStatus } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Calendar, MapPin, User, ArrowLeft } from 'lucide-react';
import { BookingStatus } from '../../backend';
import IvrUpdatesPanel from '../../components/ivr/IvrUpdatesPanel';

export default function JobDetailsPage() {
  const { bookingId } = useParams({ strict: false }) as { bookingId: string };
  const { identity } = useInternetIdentity();
  const { data: allBookings = [] } = useGetAllBookings();
  const { data: categories = [] } = useGetServiceCategories();
  const updateStatus = useUpdateBookingStatus();

  const booking = allBookings.find(b => b.id.toString() === bookingId);
  const category = categories.find(c => c.id === booking?.category);

  const isMyJob = booking?.assignedStaff?.toString() === identity?.getPrincipal().toString();

  const handleStatusUpdate = async (newStatus: BookingStatus) => {
    if (!booking) return;

    try {
      await updateStatus.mutateAsync({
        bookingId: booking.id,
        status: newStatus,
      });
    } catch (error: any) {
      alert('Failed to update status: ' + error.message);
    }
  };

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Job not found</p>
        <Link to="/staff/jobs" className="text-primary hover:underline mt-4 inline-block">
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/staff/jobs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      <div className="bg-card border rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">{category?.name || 'Service'}</h1>
            <p className="text-muted-foreground">Job #{booking.id.toString()}</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary capitalize">
            {booking.status}
          </span>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Time Slot</p>
              <p className="font-medium">{booking.timeSlot}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{booking.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Customer</p>
              <p className="font-medium">{booking.customerId.toString().slice(0, 10)}...</p>
            </div>
          </div>
        </div>

        {isMyJob && (
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {booking.status === BookingStatus.confirmed && (
                <button
                  onClick={() => handleStatusUpdate(BookingStatus.inProgress)}
                  disabled={updateStatus.isPending}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  Start Job
                </button>
              )}
              {booking.status === BookingStatus.inProgress && (
                <button
                  onClick={() => handleStatusUpdate(BookingStatus.completed)}
                  disabled={updateStatus.isPending}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  Mark Complete
                </button>
              )}
              <button
                onClick={() => handleStatusUpdate(BookingStatus.cancelled)}
                disabled={updateStatus.isPending}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors disabled:opacity-50"
              >
                Cancel Job
              </button>
            </div>
          </div>
        )}
      </div>

      <IvrUpdatesPanel bookingId={booking.id} />
    </div>
  );
}
