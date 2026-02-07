import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Home, Calendar, Package, Users, Settings, LogOut, Wrench, FileText, CreditCard, Phone, LayoutDashboard } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { clear, identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const isCustomer = profile?.appRole === 'customer';
  const isStaff = profile?.appRole === 'staff';
  const isAdmin = profile?.appRole === 'admin';

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/assets/generated/servicehub-logo.dim_512x512.png" 
                alt="ServiceHub" 
                className="h-10 w-10"
              />
              <span className="text-xl font-bold">ServiceHub</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              {isCustomer && (
                <>
                  <Link 
                    to="/customer/catalog" 
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Services
                  </Link>
                  <Link 
                    to="/customer/bookings" 
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    My Bookings
                  </Link>
                  <Link 
                    to="/customer/subscriptions" 
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Subscriptions
                  </Link>
                  <Link 
                    to="/customer/support" 
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Support
                  </Link>
                </>
              )}
              
              {isStaff && (
                <>
                  <Link 
                    to="/staff/jobs" 
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    My Jobs
                  </Link>
                  <Link 
                    to="/staff/schedule" 
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Schedule
                  </Link>
                </>
              )}
              
              {isAdmin && (
                <>
                  <Link 
                    to="/" 
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin/users" 
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Users
                  </Link>
                  <Link 
                    to="/admin/allocation" 
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Allocation
                  </Link>
                  <Link 
                    to="/admin/services" 
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Services
                  </Link>
                  <Link 
                    to="/admin/payments" 
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Payments
                  </Link>
                  <Link 
                    to="/admin/support" 
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Support
                  </Link>
                  <Link 
                    to="/admin/ivr-settings" 
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    IVR
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {profile?.name || 'User'}
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {children}
      </main>

      <footer className="border-t mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          © 2026. Built with ❤️ using{' '}
          <a 
            href="https://caffeine.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
