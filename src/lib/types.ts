// ChamaPay Type Definitions

export type UserRole = 'SUPER_ADMIN' | 'CHAMA_ADMIN' | 'TREASURER' | 'SECRETARY' | 'MEMBER';
export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'GRACE_PERIOD' | 'SUSPENDED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'TIMEOUT';
export type LoanStatus = 'PENDING' | 'APPROVED' | 'DISBURSED' | 'REPAID' | 'REJECTED' | 'DEFAULTED';
export type FineStatus = 'PENDING' | 'PARTIAL' | 'PAID';
export type MeetingStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  phone: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  chamaId: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  isActive: boolean;
}

export interface Chama {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  adminId: string;
  planId: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionStart: string;
  subscriptionEnd: string;
  gracePeriodEnd: string | null;
  suspensionReason: string | null;
  isTestChama: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceKES: number;
  maxMembers: number;
  features: string[];
  isActive: boolean;
}

export interface ChamaMember {
  id: string;
  chamaId: string;
  userId: string;
  role: UserRole;
  joinedAt: string;
  isActive: boolean;
  leftAt: string | null;
}

export interface Contribution {
  id: string;
  chamaId: string;
  memberId: string;
  amount: number; // stored in cents
  date: string;
  paymentMethod: string;
  reference: string;
  status: string;
  notes: string;
  createdBy: string;
  createdAt: string;
}

export interface LedgerTransaction {
  id: string;
  chamaId: string;
  type: 'CONTRIBUTION' | 'LOAN_DISBURSEMENT' | 'LOAN_REPAYMENT' | 'FINE' | 'FINE_PAYMENT' | 'EXPENSE' | 'OTHER_INCOME';
  amount: number;
  debit: number;
  credit: number;
  reference: string;
  description: string;
  memberId: string | null;
  createdAt: string;
}

export interface Loan {
  id: string;
  chamaId: string;
  memberId: string;
  amount: number;
  interestRate: number;
  duration: number; // months
  purpose: string;
  status: LoanStatus;
  appliedAt: string;
  approvedAt: string | null;
  disbursedAt: string | null;
  approvedBy: string | null;
  notes: string;
}

export interface LoanRepayment {
  id: string;
  chamaId: string;
  loanId: string;
  memberId: string;
  amount: number;
  date: string;
  reference: string;
  createdAt: string;
}

export interface Fine {
  id: string;
  chamaId: string;
  memberId: string;
  amount: number;
  reason: string;
  dueDate: string;
  status: FineStatus;
  paidAmount: number;
  createdBy: string;
  createdAt: string;
}

export interface Meeting {
  id: string;
  chamaId: string;
  title: string;
  date: string;
  location: string;
  agenda: string;
  status: MeetingStatus;
  createdBy: string;
  createdAt: string;
}

export interface MeetingAttendance {
  id: string;
  meetingId: string;
  memberId: string;
  chamaId: string;
  attended: boolean;
  recordedAt: string;
}

export interface Announcement {
  id: string;
  chamaId: string;
  title: string;
  content: string;
  publishedBy: string;
  publishedAt: string;
  isPublished: boolean;
}

export interface Message {
  id: string;
  chamaId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface MessageRead {
  id: string;
  messageId: string;
  userId: string;
  readAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  chamaId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Payment {
  id: string;
  chamaId: string;
  planId: string;
  amount: number;
  phoneNumber: string;
  status: PaymentStatus;
  providerTransactionId: string | null;
  provider: string;
  reference: string;
  notes: string;
  createdAt: string;
  verifiedAt: string | null;
  isDuplicate: boolean;
}

export interface Invite {
  id: string;
  chamaId: string;
  email: string;
  phone: string;
  role: UserRole;
  token: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
  acceptedAt: string | null;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId: string;
  chamaId: string | null;
  metadata: Record<string, any>;
  createdAt: string;
}

export interface AppState {
  users: User[];
  chamas: Chama[];
  plans: SubscriptionPlan[];
  members: ChamaMember[];
  contributions: Contribution[];
  ledger: LedgerTransaction[];
  loans: Loan[];
  loanRepayments: LoanRepayment[];
  fines: Fine[];
  meetings: Meeting[];
  attendance: MeetingAttendance[];
  announcements: Announcement[];
  messages: Message[];
  messageReads: MessageRead[];
  notifications: Notification[];
  payments: Payment[];
  invites: Invite[];
  auditLogs: AuditLog[];
}
