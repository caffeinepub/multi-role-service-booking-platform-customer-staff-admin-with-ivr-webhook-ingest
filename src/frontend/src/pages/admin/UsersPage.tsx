import { useGetAllBookings } from '../../hooks/useQueries';
import { User } from 'lucide-react';

export default function UsersPage() {
  const { data: bookings = [] } = useGetAllBookings();

  // Extract unique customers and staff
  const customers = Array.from(new Set(bookings.map(b => b.customerId.toString())));
  const staff = Array.from(new Set(bookings.filter(b => b.assignedStaff).map(b => b.assignedStaff!.toString())));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">User Management</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Customers</h2>
          </div>
          <p className="text-3xl font-bold mb-4">{customers.length}</p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {customers.map((customerId) => (
              <div key={customerId} className="p-3 bg-accent/10 rounded-md">
                <p className="text-sm font-mono">{customerId.slice(0, 20)}...</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Staff Members</h2>
          </div>
          <p className="text-3xl font-bold mb-4">{staff.length}</p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {staff.map((staffId) => (
              <div key={staffId} className="p-3 bg-accent/10 rounded-md">
                <p className="text-sm font-mono">{staffId.slice(0, 20)}...</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
