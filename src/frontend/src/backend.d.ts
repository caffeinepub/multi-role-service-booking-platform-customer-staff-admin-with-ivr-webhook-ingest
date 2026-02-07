import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type MobileNumber = string;
export interface VerificationRequest {
    verificationCode: string;
    mobileNumber: MobileNumber;
}
export interface MobileVerificationStatus {
    verified: boolean;
}
export type Time = bigint;
export interface SupportTicket {
    id: SupportTicketId;
    status: string;
    message: string;
    customerId: Principal;
}
export interface IVRBookingRequest {
    serviceCategory: ServiceCategoryId;
    address: string;
    mobile: MobileNumber;
    timeSlot: string;
}
export interface Feedback {
    id: FeedbackId;
    bookingId: BookingId;
    rating: bigint;
    comments: string;
}
export interface BookingRequest {
    serviceCategory: ServiceCategoryId;
    address: string;
    preferredTime: Time;
    timeSlot: string;
}
export type BookingId = bigint;
export type ServiceCategoryId = bigint;
export interface Payment {
    id: PaymentId;
    status: string;
    method: string;
    bookingId: BookingId;
    amount: bigint;
}
export type IVRTaskId = bigint;
export interface IVRTask {
    id: IVRTaskId;
    status: string;
    bookingId: BookingId;
    taskType: string;
}
export type SupportTicketId = bigint;
export type PaymentId = bigint;
export interface SubscriptionPlan {
    id: SubscriptionPlanId;
    name: string;
    price: bigint;
}
export interface Booking {
    id: BookingId;
    status: BookingStatus;
    address: string;
    preferredTime: Time;
    assignedStaff?: Principal;
    category: ServiceCategoryId;
    customerId: Principal;
    timeSlot: string;
}
export interface BookingResponse {
    message: string;
}
export type SubscriptionPlanId = bigint;
export type FeedbackId = bigint;
export interface UserProfile {
    appRole: AppRole;
    name: string;
    zone: string;
    mobileNumber: string;
    isVerified: boolean;
}
export interface ServiceCategory {
    id: ServiceCategoryId;
    name: string;
    description: string;
}
export enum AppRole {
    admin = "admin",
    customer = "customer",
    staff = "staff"
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignStaffToBooking(bookingId: BookingId, staffPrincipal: Principal): Promise<void>;
    completeVerification(request: VerificationRequest): Promise<MobileVerificationStatus>;
    createBooking(request: BookingRequest): Promise<BookingResponse>;
    createIvrVerification(request: IVRBookingRequest): Promise<void>;
    createServiceCategory(name: string, description: string): Promise<ServiceCategoryId>;
    createSubscriptionPlan(name: string, price: bigint): Promise<SubscriptionPlanId>;
    createSupportTicket(message: string): Promise<SupportTicketId>;
    demoBookingsWithLocations(): Promise<Array<Booking>>;
    getAllBookings(): Promise<Array<Booking>>;
    getAllFeedback(): Promise<Array<Feedback>>;
    getAllPayments(): Promise<Array<Payment>>;
    getAllSupportTickets(): Promise<Array<SupportTicket>>;
    getAvailableTimeSlots(arg0: ServiceCategoryId): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getIVRTasks(): Promise<Array<IVRTask>>;
    getMyBookings(): Promise<Array<Booking>>;
    getMySupportTickets(): Promise<Array<SupportTicket>>;
    getSubscriptionPlans(): Promise<Array<SubscriptionPlan>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordPayment(bookingId: BookingId, method: string, amount: bigint): Promise<PaymentId>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setUserAppRole(user: Principal, newRole: AppRole): Promise<void>;
    startVerification(mobileNumber: string): Promise<MobileVerificationStatus>;
    submitFeedback(bookingId: BookingId, rating: bigint, comments: string): Promise<void>;
    updateBookingStatus(bookingId: BookingId, newStatus: BookingStatus): Promise<void>;
    updateIVRTaskStatus(taskId: IVRTaskId, newStatus: string): Promise<void>;
    updatePaymentStatus(paymentId: PaymentId, newStatus: string): Promise<void>;
    viewServiceCategories(): Promise<Array<ServiceCategory>>;
}
