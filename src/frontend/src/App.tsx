import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import AppShell from './components/layout/AppShell';
import LoginPage from './pages/shared/LoginPage';
import ProfileSetupPage from './pages/shared/ProfileSetupPage';
import AccessDeniedScreen from './components/auth/AccessDeniedScreen';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CatalogPage from './pages/customer/CatalogPage';
import BookServicePage from './pages/customer/BookServicePage';
import BookingConfirmationPage from './pages/customer/BookingConfirmationPage';
import MyBookingsPage from './pages/customer/MyBookingsPage';
import BookingDetailsPage from './pages/customer/BookingDetailsPage';
import SupportPage from './pages/customer/SupportPage';
import SubscriptionsPage from './pages/customer/SubscriptionsPage';
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffJobsPage from './pages/staff/StaffJobsPage';
import StaffSchedulePage from './pages/staff/StaffSchedulePage';
import JobDetailsPage from './pages/staff/JobDetailsPage';
import AdminDashboard from './pages/admin/AdminDashboardPage';
import UsersPage from './pages/admin/UsersPage';
import BookingAllocationPage from './pages/admin/BookingAllocationPage';
import ManageServicesPage from './pages/admin/ManageServicesPage';
import PaymentsPage from './pages/admin/PaymentsPage';
import SupportAndFeedbackPage from './pages/admin/SupportAndFeedbackPage';
import IVRSettingsPage from './pages/admin/IVRSettingsPage';
import IVRTasksPage from './pages/admin/IVRTasksPage';

function RootComponent() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading, isFetched } = useGetCallerUserProfile();

  if (!identity) {
    return <LoginPage />;
  }

  if (isLoading || !isFetched) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <ProfileSetupPage />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

function IndexComponent() {
  const { data: profile } = useGetCallerUserProfile();
  
  if (!profile) return null;

  if (profile.appRole === 'admin') {
    return <AdminDashboard />;
  } else if (profile.appRole === 'staff') {
    return <StaffDashboard />;
  } else {
    return <CustomerDashboard />;
  }
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexComponent,
});

const customerCatalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/catalog',
  component: CatalogPage,
});

const customerBookRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/book',
  component: BookServicePage,
});

const customerBookingConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/booking-confirmation/$bookingId',
  component: BookingConfirmationPage,
});

const customerBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/bookings',
  component: MyBookingsPage,
});

const customerBookingDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/bookings/$bookingId',
  component: BookingDetailsPage,
});

const customerSupportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/support',
  component: SupportPage,
});

const customerSubscriptionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/subscriptions',
  component: SubscriptionsPage,
});

const staffJobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff/jobs',
  component: StaffJobsPage,
});

const staffScheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff/schedule',
  component: StaffSchedulePage,
});

const staffJobDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff/jobs/$bookingId',
  component: JobDetailsPage,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: UsersPage,
});

const adminAllocationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/allocation',
  component: BookingAllocationPage,
});

const adminServicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/services',
  component: ManageServicesPage,
});

const adminPaymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/payments',
  component: PaymentsPage,
});

const adminSupportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/support',
  component: SupportAndFeedbackPage,
});

const adminIVRSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/ivr-settings',
  component: IVRSettingsPage,
});

const adminIVRTasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/ivr-tasks',
  component: IVRTasksPage,
});

const accessDeniedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/access-denied',
  component: AccessDeniedScreen,
});

const profileSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile-setup',
  component: ProfileSetupPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  customerCatalogRoute,
  customerBookRoute,
  customerBookingConfirmationRoute,
  customerBookingsRoute,
  customerBookingDetailsRoute,
  customerSupportRoute,
  customerSubscriptionsRoute,
  staffJobsRoute,
  staffScheduleRoute,
  staffJobDetailsRoute,
  adminUsersRoute,
  adminAllocationRoute,
  adminServicesRoute,
  adminPaymentsRoute,
  adminSupportRoute,
  adminIVRSettingsRoute,
  adminIVRTasksRoute,
  accessDeniedRoute,
  profileSetupRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
