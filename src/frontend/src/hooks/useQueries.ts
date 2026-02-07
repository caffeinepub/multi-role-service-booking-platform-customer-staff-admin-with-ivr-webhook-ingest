import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
  UserProfile, 
  BookingRequest, 
  Booking, 
  ServiceCategory, 
  SubscriptionPlan,
  SupportTicket,
  Feedback,
  Payment,
  IVRTask,
  BookingStatus,
  AppRole,
  VerificationRequest,
  MobileVerificationStatus
} from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useStartVerification() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (mobileNumber: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.startVerification(mobileNumber);
    },
  });
}

export function useCompleteVerification() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: VerificationRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeVerification(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetServiceCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<ServiceCategory[]>({
    queryKey: ['serviceCategories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.viewServiceCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSubscriptionPlans() {
  const { actor, isFetching } = useActor();

  return useQuery<SubscriptionPlan[]>({
    queryKey: ['subscriptionPlans'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSubscriptionPlans();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: BookingRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBooking(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
    },
  });
}

export function useGetMyBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['myBookings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['allBookings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: bigint; status: BookingStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBookingStatus(bookingId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
    },
  });
}

export function useAssignStaffToBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, staffPrincipal }: { bookingId: bigint; staffPrincipal: Principal }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignStaffToBooking(bookingId, staffPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
    },
  });
}

export function useCreateServiceCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createServiceCategory(name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceCategories'] });
    },
  });
}

export function useCreateSubscriptionPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, price }: { name: string; price: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSubscriptionPlan(name, price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptionPlans'] });
    },
  });
}

export function useCreateSupportTicket() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSupportTicket(message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySupportTickets'] });
      queryClient.invalidateQueries({ queryKey: ['allSupportTickets'] });
    },
  });
}

export function useGetMySupportTickets() {
  const { actor, isFetching } = useActor();

  return useQuery<SupportTicket[]>({
    queryKey: ['mySupportTickets'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMySupportTickets();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllSupportTickets() {
  const { actor, isFetching } = useActor();

  return useQuery<SupportTicket[]>({
    queryKey: ['allSupportTickets'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSupportTickets();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, rating, comments }: { bookingId: bigint; rating: bigint; comments: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitFeedback(bookingId, rating, comments);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allFeedback'] });
    },
  });
}

export function useGetAllFeedback() {
  const { actor, isFetching } = useActor();

  return useQuery<Feedback[]>({
    queryKey: ['allFeedback'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFeedback();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllPayments() {
  const { actor, isFetching } = useActor();

  return useQuery<Payment[]>({
    queryKey: ['allPayments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPayments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecordPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, method, amount }: { bookingId: bigint; method: string; amount: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordPayment(bookingId, method, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPayments'] });
    },
  });
}

export function useUpdatePaymentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paymentId, status }: { paymentId: bigint; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePaymentStatus(paymentId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPayments'] });
    },
  });
}

export function useGetIVRTasks() {
  const { actor, isFetching } = useActor();

  return useQuery<IVRTask[]>({
    queryKey: ['ivrTasks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getIVRTasks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateIVRTaskStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, status }: { taskId: bigint; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateIVRTaskStatus(taskId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ivrTasks'] });
    },
  });
}

export function useSetUserAppRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: AppRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setUserAppRole(user, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
