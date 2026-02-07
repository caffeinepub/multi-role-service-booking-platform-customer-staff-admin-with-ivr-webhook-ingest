import { useState } from 'react';
import { useGetAllPayments, useUpdatePaymentStatus, useRecordPayment, useGetAllBookings } from '../../hooks/useQueries';

export default function PaymentsPage() {
  const { data: payments = [] } = useGetAllPayments();
  const { data: bookings = [] } = useGetAllBookings();
  const updateStatus = useUpdatePaymentStatus();
  const recordPayment = useRecordPayment();

  const [showRecordForm, setShowRecordForm] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [method, setMethod] = useState('UPI');
  const [amount, setAmount] = useState('');

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await recordPayment.mutateAsync({
        bookingId: BigInt(bookingId),
        method,
        amount: BigInt(amount),
      });
      setBookingId('');
      setAmount('');
      setShowRecordForm(false);
      alert('Payment recorded successfully!');
    } catch (error: any) {
      alert('Failed to record payment: ' + error.message);
    }
  };

  const handleUpdateStatus = async (paymentId: bigint, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ paymentId, status: newStatus });
    } catch (error: any) {
      alert('Failed to update status: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Payment Management</h1>
        <button
          onClick={() => setShowRecordForm(!showRecordForm)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Record Payment
        </button>
      </div>

      {showRecordForm && (
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Record New Payment</h2>
          <form onSubmit={handleRecordPayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Booking ID</label>
              <input
                type="number"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Wallet">Wallet</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
                required
              />
            </div>
            <button
              type="submit"
              disabled={recordPayment.isPending}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {recordPayment.isPending ? 'Recording...' : 'Record Payment'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-card border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Payment ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Booking ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Method</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {payments.map((payment) => (
              <tr key={payment.id.toString()} className="hover:bg-accent/5">
                <td className="px-6 py-4 text-sm">#{payment.id.toString()}</td>
                <td className="px-6 py-4 text-sm">#{payment.bookingId.toString()}</td>
                <td className="px-6 py-4 text-sm">{payment.method}</td>
                <td className="px-6 py-4 text-sm font-medium">₹{payment.amount.toString()}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary capitalize">
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={payment.status}
                    onChange={(e) => handleUpdateStatus(payment.id, e.target.value)}
                    className="text-sm px-2 py-1 border rounded bg-background"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
