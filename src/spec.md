# Specification

## Summary
**Goal:** Build a role-based service booking web app (Customer, Staff, Admin) with Internet Identity auth, demo OTP mobile verification, bookings, subscriptions/services management, staff allocation, feedback/support, payment tracking, and IVR webhook ingestion + call-task tracking.

**Planned changes:**
- Add a single React UI with guarded navigation for three areas: Customer, Staff, Admin.
- Implement Internet Identity sign-in and per-user profiles (mobile number + role), requiring verified mobile number before booking.
- Add demo/dev OTP verification: backend-generated OTP with expiry/attempt limits, shown in UI only in a clearly labeled Demo OTP area.
- Create CRUD models and UIs for service categories and subscription plans (admin-managed; disabled items not selectable).
- Implement customer booking creation (category, name, address, preferred time slot, notes) with booking ID, initial status, and confirmation view.
- Add customer booking lists (Upcoming/History) and booking details with status timeline and assigned staff (if any).
- Implement Staff module: assigned jobs list, schedule view, job details (customer contact/address/history), and status updates with allowed transitions.
- Implement Admin panel: manage customer/staff profiles, manage services/subscriptions, assign/unassign staff to bookings, and view booking pipeline counts/filters.
- Add backend staff suggestion helper based on zone text match + availability, surfaced in admin assignment UI.
- Add support tickets and post-completion ratings/feedback; admin can review and export lists.
- Add payment tracking records for bookings/subscriptions (method, amount, status, timestamps) with admin reconciliation notes; subscription records include renewal date/status (admin can manually advance in demo mode).
- Add IVR webhook endpoint(s) to create/update bookings from IVR fields, authenticated via stored webhook token; reject unregistered/unverified mobile numbers; store IVR source metadata.
- Add backend call-task queue creation on booking events; admin IVR settings page; admin call-task management; show read-only IVR updates in booking details for customers/staff.
- Apply a coherent English-only visual theme (avoiding blue/purple dominance) via Tailwind and existing UI components.
- Implement backend security: role checks on mutations, basic input validation/normalization, stable-compatible storage, and OTP secrecy except in demo OTP flow.

**User-visible outcome:** Users can sign in with Internet Identity, verify a mobile number via demo OTP, browse services/plans, and create/manage bookings; staff can manage assigned jobs and update statuses; admins can manage data, allocate work with suggestions, track payments/subscriptions, handle feedback/support, and ingest IVR bookings plus monitor IVR call tasks—all in an English, themed UI.
