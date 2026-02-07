import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Char "mo:core/Char";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type UserRole = AccessControl.UserRole;
  type AccessControlState = AccessControl.AccessControlState;

  type MobileNumber = Text;

  type ProfileId = Nat;
  type BookingId = Nat;
  type FeedbackId = Nat;
  type PaymentId = Nat;
  type VerificationCode = Text;
  type ServiceCategoryId = Nat;
  type SubscriptionPlanId = Nat;
  type SupportTicketId = Nat;
  type IVRTaskId = Nat;
  type BookingStatus = { #pending; #confirmed; #inProgress; #completed; #cancelled };

  type ServiceCategory = {
    id : ServiceCategoryId;
    name : Text;
    description : Text;
  };

  type SubscriptionPlan = {
    id : SubscriptionPlanId;
    name : Text;
    price : Nat;
  };

  type Booking = {
    id : BookingId;
    customerId : Principal;
    category : ServiceCategoryId;
    address : Text;
    timeSlot : Text;
    preferredTime : Time.Time;
    status : BookingStatus;
    assignedStaff : ?Principal;
  };

  type Payment = {
    id : PaymentId;
    bookingId : BookingId;
    method : Text;
    amount : Nat;
    status : Text;
  };

  type Feedback = {
    id : FeedbackId;
    bookingId : BookingId;
    rating : Nat;
    comments : Text;
  };

  type SupportTicket = {
    id : SupportTicketId;
    customerId : Principal;
    message : Text;
    status : Text;
  };

  type IVRTask = {
    id : IVRTaskId;
    bookingId : BookingId;
    taskType : Text;
    status : Text;
  };

  type AppRole = { #customer; #staff; #admin };

  type UserProfile = {
    name : Text;
    mobileNumber : Text;
    isVerified : Bool;
    appRole : AppRole;
    zone : Text;
  };

  type MobileVerificationData = {
    expectedCode : VerificationCode;
    creationTime : Time.Time;
  };

  type IvrVerification = {
    customerId : Principal;
    categoryId : ServiceCategoryId;
    address : Text;
    timeSlot : Text;
  };

  func generateRandom4DigitCode() : Text {
    let randomNumber = 1234;
    randomNumber.toText();
  };

  var nextServiceCategoryId : ServiceCategoryId = 0;
  var nextBookingId : BookingId = 0;
  var nextFeedbackId : FeedbackId = 0;
  var nextPaymentId : PaymentId = 0;
  var nextSupportTicketId : SupportTicketId = 0;
  var nextIVRTaskId : IVRTaskId = 0;
  var nextSubscriptionPlanId : SubscriptionPlanId = 0;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let bookings = Map.empty<BookingId, Booking>();
  let feedbackEntries = Map.empty<FeedbackId, Feedback>();
  let payments = Map.empty<PaymentId, Payment>();
  let serviceCategories = Map.empty<ServiceCategoryId, ServiceCategory>();
  let supportTickets = Map.empty<SupportTicketId, SupportTicket>();
  let mobileVerifications = Map.empty<MobileNumber, MobileVerificationData>();
  let verifiedMobileNumbers = Map.empty<MobileNumber, Principal>();
  let subscriptionPlans = Map.empty<SubscriptionPlanId, SubscriptionPlan>();
  let ivrTasks = Map.empty<IVRTaskId, IVRTask>();
  let ivrVerifications = Map.empty<MobileNumber, IvrVerification>();

  public type BookingRequest = {
    serviceCategory : ServiceCategoryId;
    address : Text;
    timeSlot : Text;
    preferredTime : Time.Time;
  };

  public type IVRBookingRequest = {
    mobile : MobileNumber;
    serviceCategory : ServiceCategoryId;
    address : Text;
    timeSlot : Text;
  };

  public type BookingResponse = {
    message : Text;
  };

  public type BookingResponse_ = {
    bookingId : BookingId;
    message : Text;
  };

  public type MobileVerificationStatus = {
    verified : Bool;
  };

  public type VerificationRequest = {
    mobileNumber : MobileNumber;
    verificationCode : Text;
  };

  public type PaginatedResponse<T> = {
    data : [T];
    total : Nat;
    currentPage : Nat;
    pageSize : Nat;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Required user profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Helper function to check if user has verified mobile
  func hasVerifiedMobile(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) { profile.isVerified };
    };
  };

  // Helper function to check app role
  func hasAppRole(caller : Principal, requiredRole : AppRole) : Bool {
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        switch (requiredRole, profile.appRole) {
          case (#admin, #admin) { true };
          case (#staff, #staff or #admin) { true };
          case (#customer, _) { true };
          case (_, _) { false };
        };
      };
    };
  };

  public shared ({ caller }) func startVerification(mobileNumber : Text) : async MobileVerificationStatus {
    // Any authenticated user can start verification
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can start verification");
    };

    if (mobileNumber.size() != 10) {
      Runtime.trap("Invalid mobile number length. Must be 10 digits.");
    };

    let isValid = mobileNumber.chars().all(func(c) { c.isDigit() });
    if (not isValid) {
      Runtime.trap("Invalid mobile number format. Must contain only digits.");
    };

    switch (verifiedMobileNumbers.containsKey(mobileNumber)) {
      case (true) { Runtime.trap("Mobile number already verified") };
      case (false) {
        let verificationCode = generateRandom4DigitCode();
        let verificationData = {
          expectedCode = verificationCode;
          creationTime = Time.now();
        };
        mobileVerifications.add(mobileNumber, verificationData);
        let response : MobileVerificationStatus = { verified = false };
        response;
      };
    };
  };

  func isMobileVerificationExpired(verificationData : MobileVerificationData) : Bool {
    let currentTime = Time.now();
    let timeDiff = currentTime - verificationData.creationTime;
    let expiryThresholdNs = 10 * 60 * 1_000_000_000;
    timeDiff >= expiryThresholdNs;
  };

  public shared ({ caller }) func completeVerification(request : VerificationRequest) : async MobileVerificationStatus {
    // Any authenticated user can complete verification
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can complete verification");
    };

    switch (verifiedMobileNumbers.containsKey(request.mobileNumber)) {
      case (true) { return { verified = true } };
      case (false) {
        switch (mobileVerifications.get(request.mobileNumber)) {
          case (null) { return { verified = false } };
          case (?verificationData) {
            if (isMobileVerificationExpired(verificationData)) {
              mobileVerifications.remove(request.mobileNumber);
              return { verified = false };
            };
            if (verificationData.expectedCode == request.verificationCode) {
              mobileVerifications.remove(request.mobileNumber);
              verifiedMobileNumbers.add(request.mobileNumber, caller);

              // Update user profile with verified mobile
              switch (userProfiles.get(caller)) {
                case (null) {
                  let newProfile : UserProfile = {
                    name = "";
                    mobileNumber = request.mobileNumber;
                    isVerified = true;
                    appRole = #customer;
                    zone = "";
                  };
                  userProfiles.add(caller, newProfile);
                };
                case (?existingProfile) {
                  let updatedProfile : UserProfile = {
                    name = existingProfile.name;
                    mobileNumber = request.mobileNumber;
                    isVerified = true;
                    appRole = existingProfile.appRole;
                    zone = existingProfile.zone;
                  };
                  userProfiles.add(caller, updatedProfile);
                };
              };

              { verified = true };
            } else {
              { verified = false };
            };
          };
        };
      };
    };
  };

  public query ({ caller }) func viewServiceCategories() : async [ServiceCategory] {
    // Any user (including guests) can view service categories
    serviceCategories.values().toArray();
  };

  public query ({ caller }) func getAvailableTimeSlots(_ : ServiceCategoryId) : async [Text] {
    // Any user (including guests) can view available time slots
    [
      "10:00 AM - 11:00 AM",
      "12:00 PM - 01:00 PM",
      "03:00 PM - 04:00 PM",
    ];
  };

  func validateMobileAndCategory(mobileNumber : MobileNumber, categoryId : ServiceCategoryId) {
    if (not verifiedMobileNumbers.containsKey(mobileNumber)) {
      Runtime.trap("Mobile number not verified. Please verify your mobile number first.");
    };
    switch (serviceCategories.containsKey(categoryId)) {
      case (false) { Runtime.trap("Invalid service category. Please choose a valid category.") };
      case (true) {};
    };
  };

  public shared ({ caller }) func createIvrVerification(request : IVRBookingRequest) : async () {
    // IVR endpoints require admin authorization (external system integration)
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create IVR verifications");
    };

    validateMobileAndCategory(request.mobile, request.serviceCategory);

    switch (verifiedMobileNumbers.get(request.mobile)) {
      case (null) {
        Runtime.trap("Mobile number not associated with any customer");
      };
      case (?customerId) {
        let newIvrVerification : IvrVerification = {
          customerId = customerId;
          categoryId = request.serviceCategory;
          address = request.address;
          timeSlot = request.timeSlot;
        };
        ivrVerifications.add(request.mobile, newIvrVerification);
      };
    };
  };

  public shared ({ caller }) func createBooking(request : BookingRequest) : async BookingResponse {
    // Only authenticated users with verified mobile can create bookings
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create bookings");
    };

    if (not hasVerifiedMobile(caller)) {
      Runtime.trap("Mobile number must be verified before booking services");
    };

    if (request.address == "" or request.address.size() > 100) {
      Runtime.trap("Address must be non-empty and no longer than 100 characters.");
    };
    if (request.timeSlot.size() < 4 or request.timeSlot.size() > 20) {
      Runtime.trap("Time slot must be between 4 and 20 characters long.");
    };
    if (not (serviceCategories.containsKey(request.serviceCategory))) {
      Runtime.trap("Selected service category does not exist.");
    };

    let newBooking : Booking = {
      id = nextBookingId;
      customerId = caller;
      category = request.serviceCategory;
      address = request.address;
      timeSlot = request.timeSlot;
      preferredTime = request.preferredTime;
      status = #pending;
      assignedStaff = null;
    };
    bookings.add(nextBookingId, newBooking);

    // Create IVR task for the booking
    let newTask : IVRTask = {
      id = nextIVRTaskId;
      bookingId = nextBookingId;
      taskType = "booking_confirmation";
      status = "pending";
    };
    ivrTasks.add(nextIVRTaskId, newTask);
    nextIVRTaskId += 1;

    nextBookingId += 1;
    { message = "Booking created successfully!" };
  };

  public query ({ caller }) func getMyBookings() : async [Booking] {
    // Users can view their own bookings
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view bookings");
    };

    bookings.values().filter(func(b) { b.customerId == caller }).toArray();
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    // Only staff and admin can view all bookings
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view bookings");
    };

    if (not (hasAppRole(caller, #staff) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only staff and admin can view all bookings");
    };

    bookings.values().toArray();
  };

  public shared ({ caller }) func updateBookingStatus(bookingId : BookingId, newStatus : BookingStatus) : async () {
    // Only staff and admin can update booking status
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update bookings");
    };

    if (not (hasAppRole(caller, #staff) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only staff and admin can update booking status");
    };

    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking : Booking = {
          id = booking.id;
          customerId = booking.customerId;
          category = booking.category;
          address = booking.address;
          timeSlot = booking.timeSlot;
          preferredTime = booking.preferredTime;
          status = newStatus;
          assignedStaff = booking.assignedStaff;
        };
        bookings.add(bookingId, updatedBooking);
      };
    };
  };

  public shared ({ caller }) func assignStaffToBooking(bookingId : BookingId, staffPrincipal : Principal) : async () {
    // Only admin can assign staff to bookings
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can assign staff to bookings");
    };

    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking : Booking = {
          id = booking.id;
          customerId = booking.customerId;
          category = booking.category;
          address = booking.address;
          timeSlot = booking.timeSlot;
          preferredTime = booking.preferredTime;
          status = booking.status;
          assignedStaff = ?staffPrincipal;
        };
        bookings.add(bookingId, updatedBooking);
      };
    };
  };

  public shared ({ caller }) func createServiceCategory(name : Text, description : Text) : async ServiceCategoryId {
    // Only admin can create service categories
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create service categories");
    };

    let newCategory : ServiceCategory = {
      id = nextServiceCategoryId;
      name = name;
      description = description;
    };
    serviceCategories.add(nextServiceCategoryId, newCategory);
    let categoryId = nextServiceCategoryId;
    nextServiceCategoryId += 1;
    categoryId;
  };

  public shared ({ caller }) func createSubscriptionPlan(name : Text, price : Nat) : async SubscriptionPlanId {
    // Only admin can create subscription plans
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create subscription plans");
    };

    let newPlan : SubscriptionPlan = {
      id = nextSubscriptionPlanId;
      name = name;
      price = price;
    };
    subscriptionPlans.add(nextSubscriptionPlanId, newPlan);
    let planId = nextSubscriptionPlanId;
    nextSubscriptionPlanId += 1;
    planId;
  };

  public query ({ caller }) func getSubscriptionPlans() : async [SubscriptionPlan] {
    // Any user can view subscription plans
    subscriptionPlans.values().toArray();
  };

  public shared ({ caller }) func submitFeedback(bookingId : BookingId, rating : Nat, comments : Text) : async () {
    // Only authenticated users can submit feedback
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit feedback");
    };

    // Verify the booking belongs to the caller
    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        if (booking.customerId != caller) {
          Runtime.trap("Unauthorized: Can only submit feedback for your own bookings");
        };

        if (rating < 1 or rating > 5) {
          Runtime.trap("Rating must be between 1 and 5");
        };

        let newFeedback : Feedback = {
          id = nextFeedbackId;
          bookingId = bookingId;
          rating = rating;
          comments = comments;
        };
        feedbackEntries.add(nextFeedbackId, newFeedback);
        nextFeedbackId += 1;
      };
    };
  };

  public query ({ caller }) func getAllFeedback() : async [Feedback] {
    // Only admin can view all feedback
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all feedback");
    };

    feedbackEntries.values().toArray();
  };

  public shared ({ caller }) func createSupportTicket(message : Text) : async SupportTicketId {
    // Only authenticated users can create support tickets
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create support tickets");
    };

    if (message.size() == 0 or message.size() > 500) {
      Runtime.trap("Message must be between 1 and 500 characters");
    };

    let newTicket : SupportTicket = {
      id = nextSupportTicketId;
      customerId = caller;
      message = message;
      status = "open";
    };
    supportTickets.add(nextSupportTicketId, newTicket);
    let ticketId = nextSupportTicketId;
    nextSupportTicketId += 1;
    ticketId;
  };

  public query ({ caller }) func getMySupportTickets() : async [SupportTicket] {
    // Users can view their own support tickets
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view support tickets");
    };

    supportTickets.values().filter(func(t) { t.customerId == caller }).toArray();
  };

  public query ({ caller }) func getAllSupportTickets() : async [SupportTicket] {
    // Only admin can view all support tickets
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all support tickets");
    };

    supportTickets.values().toArray();
  };

  public shared ({ caller }) func recordPayment(bookingId : BookingId, method : Text, amount : Nat) : async PaymentId {
    // Only admin can record payments
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can record payments");
    };

    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?_) {
        let newPayment : Payment = {
          id = nextPaymentId;
          bookingId = bookingId;
          method = method;
          amount = amount;
          status = "pending";
        };
        payments.add(nextPaymentId, newPayment);
        let paymentId = nextPaymentId;
        nextPaymentId += 1;
        paymentId;
      };
    };
  };

  public shared ({ caller }) func updatePaymentStatus(paymentId : PaymentId, newStatus : Text) : async () {
    // Only admin can update payment status
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update payment status");
    };

    switch (payments.get(paymentId)) {
      case (null) { Runtime.trap("Payment not found") };
      case (?payment) {
        let updatedPayment : Payment = {
          id = payment.id;
          bookingId = payment.bookingId;
          method = payment.method;
          amount = payment.amount;
          status = newStatus;
        };
        payments.add(paymentId, updatedPayment);
      };
    };
  };

  public query ({ caller }) func getAllPayments() : async [Payment] {
    // Only admin can view all payments
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all payments");
    };

    payments.values().toArray();
  };

  public query ({ caller }) func getIVRTasks() : async [IVRTask] {
    // Only admin can view IVR tasks
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view IVR tasks");
    };

    ivrTasks.values().toArray();
  };

  public shared ({ caller }) func updateIVRTaskStatus(taskId : IVRTaskId, newStatus : Text) : async () {
    // Only admin can update IVR task status
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update IVR task status");
    };

    switch (ivrTasks.get(taskId)) {
      case (null) { Runtime.trap("IVR task not found") };
      case (?task) {
        let updatedTask : IVRTask = {
          id = task.id;
          bookingId = task.bookingId;
          taskType = task.taskType;
          status = newStatus;
        };
        ivrTasks.add(taskId, updatedTask);
      };
    };
  };

  public shared ({ caller }) func setUserAppRole(user : Principal, newRole : AppRole) : async () {
    // Only admin can set user app roles
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can set user roles");
    };

    switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        let updatedProfile : UserProfile = {
          name = profile.name;
          mobileNumber = profile.mobileNumber;
          isVerified = profile.isVerified;
          appRole = newRole;
          zone = profile.zone;
        };
        userProfiles.add(user, updatedProfile);
      };
    };
  };

  public query ({ caller }) func demoBookingsWithLocations() : async [Booking] {
    // Only admin can view demo data
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view demo data");
    };

    bookings.values().toArray();
  };
};
