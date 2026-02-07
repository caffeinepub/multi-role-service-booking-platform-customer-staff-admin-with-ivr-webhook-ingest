import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useGetCallerUserProfile, useGetServiceCategories, useCreateBooking } from '../../hooks/useQueries';
import { AlertCircle } from 'lucide-react';

export default function BookServicePage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { categoryId?: string };
  const { data: profile } = useGetCallerUserProfile();
  const { data: categories = [] } = useGetServiceCategories();
  const createBooking = useCreateBooking();

  const [categoryId, setCategoryId] = useState(search.categoryId || '');
  const [address, setAddress] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [notes, setNotes] = useState('');

  const timeSlots = [
    '10:00 AM - 11:00 AM',
    '12:00 PM - 01:00 PM',
    '03:00 PM - 04:00 PM',
    '05:00 PM - 06:00 PM',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile?.isVerified) {
      alert('Please verify your mobile number before booking services.');
      navigate({ to: '/profile-setup' });
      return;
    }

    try {
      await createBooking.mutateAsync({
        serviceCategory: BigInt(categoryId),
        address,
        timeSlot,
        preferredTime: BigInt(Date.now() * 1000000),
      });

      navigate({ to: `/customer/booking-confirmation/${categoryId}` });
    } catch (error: any) {
      alert('Failed to create booking: ' + error.message);
    }
  };

  const canSubmit = categoryId && address.trim() && timeSlot;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Book a Service</h1>

      {!profile?.isVerified && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800 dark:text-yellow-200">Mobile Verification Required</p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              You must verify your mobile number before booking services.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-card border rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Service Category *</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background"
            required
          >
            <option value="">Select a service</option>
            {categories.map((cat) => (
              <option key={cat.id.toString()} value={cat.id.toString()}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Your Name</label>
          <input
            type="text"
            value={profile?.name || ''}
            disabled
            className="w-full px-3 py-2 border rounded-md bg-muted"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Service Address *</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background"
            rows={3}
            placeholder="Enter complete address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Preferred Time Slot *</label>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background"
            required
          >
            <option value="">Select a time slot</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Additional Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background"
            rows={2}
            placeholder="Any special instructions?"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit || createBooking.isPending || !profile?.isVerified}
          className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {createBooking.isPending ? 'Creating Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
}
