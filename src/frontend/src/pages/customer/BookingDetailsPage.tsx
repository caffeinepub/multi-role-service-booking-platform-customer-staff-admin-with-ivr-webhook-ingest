import { useParams, Link } from '@tanstack/react-router';
import { useGetMyBookings, useGetServiceCategories, useGetIVRTasks } from '../../hooks/useQueries';
import { Calendar, MapPin, User, ArrowLeft } from 'lucide-react';
import BookingStatusTimeline from '../../components/bookings/BookingStatusTimeline';
import LeaveRatingCard from '../../components/feedback/LeaveRatingCard';
import IvrUpdatesPanel from '../../components/ivr/IvrUpdatesPanel';

export default function BookingDetailsPage() {
  const { bookingId } = useParams({ strict: false }) as { bookingId: string };
  const { data: bookings = [] } = useGetMyBookings();
  const { data: categories = [] } = useGetServiceCategories();

  const booking = bookings.find(b => b.id.toString() === bookingId);
  const category = categories.find(c => c.id === booking?.category);

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Booking not found</p>
        <Link to="/customer/bookings" className="text-primary hover:underline mt-4 inline-block">
          Back to Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/customer/bookings"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Bookings
      </Link>

      <div className="bg-card border rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">{category?.name || 'Service'}</h1>
            <p className="text-muted-foreground">Booking #{booking.id.toString()}</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary capitalize">
            {booking.status}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
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

            {booking.assignedStaff && (
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Staff</p>
                  <p className="font-medium">{booking.assignedStaff.toString().slice(0, 10)}...</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <BookingStatusTimeline status={booking.status} />
          </div>
        </div>
      </div>

      <IvrUpdatesPanel bookingId={booking.id} />

      {booking.status === 'completed' && (
        <LeaveRatingCard bookingId={booking.id} />
      )}
    </div>
  );
}
