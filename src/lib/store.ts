import { v4 as uuidv4 } from 'uuid';
import type { AppState, User, Chama, ChamaMember, SubscriptionPlan, Contribution, LedgerTransaction, Loan, LoanRepayment, Fine, Meeting, MeetingAttendance, Announcement, Message, MessageRead, Notification, Payment, Invite, AuditLog, UserRole, SubscriptionStatus, PaymentStatus, LoanStatus } from './types';

const STORAGE_KEY = 'chamapay_data';
const SESSION_KEY = 'chamapay_session';

// Simple hash for demo (in production, use bcrypt server-side)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'h_' + Math.abs(hash).toString(36) + '_' + str.length;
}

function verifyPassword(password: string, hash: string): boolean {
  return simpleHash(password) === hash;
}

// Default subscription plans
const defaultPlans: SubscriptionPlan[] = [
  { id: 'plan-starter', name: 'STARTER', priceKES: 500, maxMembers: 15, features: ['Up to 15 members', 'Contributions tracking', 'Loan management', 'Meeting scheduling', 'Basic reports'], isActive: true },
  { id: 'plan-growth', name: 'GROWTH', priceKES: 1500, maxMembers: 70, features: ['Up to 70 members', 'All Starter features', 'Advanced reports', 'SMS notifications', 'CSV export', 'Priority support'], isActive: true },
  { id: 'plan-business', name: 'BUSINESS', priceKES: 2000, maxMembers: 100, features: ['Up to 100 members', 'All Growth features', 'Custom branding', 'API access', 'Dedicated support', 'White-label option'], isActive: true },
];

function getDefaultState(): AppState {
  const now = new Date().toISOString();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

  // Create users
  const superAdmin: User = { id: 'user-super-admin', email: 'owner@example.test', phone: '254700000001', passwordHash: simpleHash('Admin@2024!'), fullName: 'System Owner', role: 'SUPER_ADMIN', chamaId: null, createdAt: sevenDaysAgo, lastLoginAt: null, isActive: true };
  const chamaAdmin: User = { id: 'user-chama-admin', email: 'admin.umoja@example.test', phone: '254700000002', passwordHash: simpleHash('Admin@2024!'), fullName: 'Jane Wanjiku', role: 'CHAMA_ADMIN', chamaId: 'chama-umoja', createdAt: sevenDaysAgo, lastLoginAt: null, isActive: true };
  const treasurer: User = { id: 'user-treasurer', email: 'treasurer.umoja@example.test', phone: '254700000003', passwordHash: simpleHash('Admin@2024!'), fullName: 'Peter Kamau', role: 'TREASURER', chamaId: 'chama-umoja', createdAt: sevenDaysAgo, lastLoginAt: null, isActive: true };
  const secretary: User = { id: 'user-secretary', email: 'secretary.umoja@example.test', phone: '254700000004', passwordHash: simpleHash('Admin@2024!'), fullName: 'Mary Akinyi', role: 'SECRETARY', chamaId: 'chama-umoja', createdAt: sevenDaysAgo, lastLoginAt: null, isActive: true };
  const member1: User = { id: 'user-member01', email: 'member01.umoja@example.test', phone: '254700000005', passwordHash: simpleHash('Admin@2024!'), fullName: 'John Ochieng', role: 'MEMBER', chamaId: 'chama-umoja', createdAt: sevenDaysAgo, lastLoginAt: null, isActive: true };

  // Create chamas
  const chamaUmoja: Chama = { id: 'chama-umoja', name: 'TEST-UMOJA', description: 'A united savings group for community development', createdAt: sevenDaysAgo, adminId: 'user-chama-admin', planId: 'plan-starter', subscriptionStatus: 'ACTIVE', subscriptionStart: sevenDaysAgo, subscriptionEnd: thirtyDaysFromNow, gracePeriodEnd: null, suspensionReason: null, isTestChama: true };
  const chamaTumaini: Chama = { id: 'chama-tumaini', name: 'TEST-TUMAINI', description: 'Hope savings group', createdAt: sevenDaysAgo, adminId: 'user-member01', planId: 'plan-starter', subscriptionStatus: 'TRIAL', subscriptionStart: threeDaysAgo, subscriptionEnd: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), gracePeriodEnd: null, suspensionReason: null, isTestChama: true };
  const chamaPamoja: Chama = { id: 'chama-pamoja', name: 'TEST-PAMOJA', description: 'Together we save', createdAt: sevenDaysAgo, adminId: 'user-treasurer', planId: 'plan-growth', subscriptionStatus: 'GRACE_PERIOD', subscriptionStart: sevenDaysAgo, subscriptionEnd: threeDaysAgo, gracePeriodEnd: sevenDaysFromNow, suspensionReason: null, isTestChama: true };
  const chamaHarambee: Chama = { id: 'chama-harambee', name: 'TEST-HARAMBEE', description: 'Pulling together', createdAt: sevenDaysAgo, adminId: 'user-secretary', planId: 'plan-business', subscriptionStatus: 'SUSPENDED', subscriptionStart: sevenDaysAgo, subscriptionEnd: threeDaysAgo, gracePeriodEnd: threeDaysAgo, suspensionReason: 'Payment not received after grace period', isTestChama: true };
  const chamaFuture: Chama = { id: 'chama-future', name: 'TEST-FUTURE', description: 'Future savings', createdAt: sevenDaysAgo, adminId: 'user-member01', planId: 'plan-starter', subscriptionStatus: 'CANCELLED', subscriptionStart: sevenDaysAgo, subscriptionEnd: sevenDaysAgo, gracePeriodEnd: null, suspensionReason: null, isTestChama: true };

  // Create members for TEST-UMOJA (15 members - at limit)
  const umojaMembers: ChamaMember[] = [
    { id: 'mem-1', chamaId: 'chama-umoja', userId: 'user-chama-admin', role: 'CHAMA_ADMIN', joinedAt: sevenDaysAgo, isActive: true, leftAt: null },
    { id: 'mem-2', chamaId: 'chama-umoja', userId: 'user-treasurer', role: 'TREASURER', joinedAt: sevenDaysAgo, isActive: true, leftAt: null },
    { id: 'mem-3', chamaId: 'chama-umoja', userId: 'user-secretary', role: 'SECRETARY', joinedAt: sevenDaysAgo, isActive: true, leftAt: null },
    { id: 'mem-4', chamaId: 'chama-umoja', userId: 'user-member01', role: 'MEMBER', joinedAt: sevenDaysAgo, isActive: true, leftAt: null },
  ];
  // Add 11 more members to reach 15
  for (let i = 5; i <= 15; i++) {
    umojaMembers.push({ id: `mem-${i}`, chamaId: 'chama-umoja', userId: `user-extra-${i}`, role: 'MEMBER', joinedAt: sevenDaysAgo, isActive: true, leftAt: null });
  }

  // Create test contributions
  const contributions: Contribution[] = [];
  for (let i = 1; i <= 10; i++) {
    contributions.push({ id: `contrib-${i}`, chamaId: 'chama-umoja', memberId: `mem-${i}`, amount: 100000, date: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toISOString(), paymentMethod: 'M-PESA', reference: `TEST-REF-${i}`, status: 'COMPLETED', notes: `Monthly contribution ${i}`, createdBy: 'user-chama-admin', createdAt: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toISOString() });
  }

  // Create test loans
  const loans: Loan[] = [
    { id: 'loan-1', chamaId: 'chama-umoja', memberId: 'mem-1', amount: 1000000, interestRate: 10, duration: 3, purpose: 'Business expansion', status: 'DISBURSED', appliedAt: sevenDaysAgo, approvedAt: sevenDaysAgo, disbursedAt: sevenDaysAgo, approvedBy: 'user-chama-admin', notes: 'Approved for business' },
    { id: 'loan-2', chamaId: 'chama-umoja', memberId: 'mem-2', amount: 500000, interestRate: 10, duration: 2, purpose: 'School fees', status: 'PENDING', appliedAt: now, approvedAt: null, disbursedAt: null, approvedBy: null, notes: '' },
  ];

  // Create test fines
  const fines: Fine[] = [
    { id: 'fine-1', chamaId: 'chama-umoja', memberId: 'mem-3', amount: 20000, reason: 'Late arrival to meeting', dueDate: sevenDaysFromNow, status: 'PENDING', paidAmount: 0, createdBy: 'user-chama-admin', createdAt: now },
  ];

  // Create test meetings
  const meetings: Meeting[] = [
    { id: 'meeting-1', chamaId: 'chama-umoja', title: 'Monthly General Meeting', date: sevenDaysFromNow, location: 'Community Hall, Nairobi', agenda: '1. Review contributions\n2. Loan applications\n3. New member proposals', status: 'SCHEDULED', createdBy: 'user-chama-admin', createdAt: now },
  ];

  // Create test announcements
  const announcements: Announcement[] = [
    { id: 'ann-1', chamaId: 'chama-umoja', title: 'Welcome to ChamaPay!', content: 'We are now using ChamaPay to manage our savings group. Please download the app and register.', publishedBy: 'user-chama-admin', publishedAt: now, isPublished: true },
  ];

  // Create test payments
  const payments: Payment[] = [
    { id: 'pay-1', chamaId: 'chama-umoja', planId: 'plan-starter', amount: 50000, phoneNumber: '254700000002', status: 'SUCCESS', providerTransactionId: 'TEST-PAYMENT-000001', provider: 'test', reference: 'SUB-UMOJA-001', notes: 'Starter plan subscription', createdAt: sevenDaysAgo, verifiedAt: sevenDaysAgo, isDuplicate: false },
  ];

  // Create ledger entries
  const ledger: LedgerTransaction[] = [
    { id: 'led-1', chamaId: 'chama-umoja', type: 'CONTRIBUTION', amount: 100000, debit: 0, credit: 100000, reference: 'TEST-REF-1', description: 'Monthly contribution', memberId: 'mem-1', createdAt: now },
    { id: 'led-2', chamaId: 'chama-umoja', type: 'LOAN_DISBURSEMENT', amount: 1000000, debit: 1000000, credit: 0, reference: 'LOAN-1', description: 'Loan disbursement', memberId: 'mem-1', createdAt: now },
  ];

  return {
    users: [superAdmin, chamaAdmin, treasurer, secretary, member1],
    chamas: [chamaUmoja, chamaTumaini, chamaPamoja, chamaHarambee, chamaFuture],
    plans: defaultPlans,
    members: umojaMembers,
    contributions,
    ledger,
    loans,
    loanRepayments: [],
    fines,
    meetings,
    attendance: [],
    announcements,
    messages: [],
    messageReads: [],
    notifications: [],
    payments,
    invites: [],
    auditLogs: [],
  };
}

// Store class
class ChamaPayStore {
  private state: AppState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): AppState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load state:', e);
    }
    const defaultState = getDefaultState();
    this.saveState(defaultState);
    return defaultState;
  }

  private saveState(state?: AppState) {
    const s = state || this.state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  private notify() {
    this.saveState();
    this.listeners.forEach(l => l());
  }

  getState(): AppState {
    return this.state;
  }

  // Reset to defaults
  resetToDefaults() {
    this.state = getDefaultState();
    this.notify();
  }

  // ============ AUTHENTICATION ============
  
  register(email: string, phone: string, password: string, fullName: string): { success: boolean; error?: string; user?: User } {
    if (!email || !phone || !password || !fullName) {
      return { success: false, error: 'All fields are required' };
    }
    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters' };
    }
    if (this.state.users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email already registered' };
    }
    if (this.state.users.find(u => u.phone === phone)) {
      return { success: false, error: 'Phone number already registered' };
    }

    const user: User = {
      id: uuidv4(),
      email: email.toLowerCase(),
      phone,
      passwordHash: simpleHash(password),
      fullName,
      role: 'MEMBER',
      chamaId: null,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
      isActive: true,
    };

    this.state.users.push(user);
    this.addAuditLog(user.id, user.fullName, 'USER_REGISTER', 'user', user.id, null, { email });
    this.notify();
    return { success: true, user };
  }

  login(email: string, password: string): { success: boolean; error?: string; user?: User } {
    const user = this.state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }
    if (!verifyPassword(password, user.passwordHash)) {
      return { success: false, error: 'Invalid email or password' };
    }
    if (!user.isActive) {
      return { success: false, error: 'Account is deactivated' };
    }

    user.lastLoginAt = new Date().toISOString();
    localStorage.setItem(SESSION_KEY, user.id);
    this.addAuditLog(user.id, user.fullName, 'USER_LOGIN', 'user', user.id, user.chamaId, {});
    this.notify();
    return { success: true, user };
  }

  logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  getCurrentUser(): User | null {
    const userId = localStorage.getItem(SESSION_KEY);
    if (!userId) return null;
    return this.state.users.find(u => u.id === userId) || null;
  }

  // ============ CHAMA MANAGEMENT ============

  createChama(name: string, description: string, adminUserId: string): { success: boolean; error?: string; chama?: Chama } {
    if (!name || !description) {
      return { success: false, error: 'Name and description are required' };
    }
    if (this.state.chamas.find(c => c.name === name)) {
      return { success: false, error: 'Chama name already exists' };
    }

    const chama: Chama = {
      id: uuidv4(),
      name,
      description,
      createdAt: new Date().toISOString(),
      adminId: adminUserId,
      planId: 'plan-starter',
      subscriptionStatus: 'TRIAL',
      subscriptionStart: new Date().toISOString(),
      subscriptionEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      gracePeriodEnd: null,
      suspensionReason: null,
      isTestChama: false,
    };

    this.state.chamas.push(chama);

    // Add admin as member
    const member: ChamaMember = {
      id: uuidv4(),
      chamaId: chama.id,
      userId: adminUserId,
      role: 'CHAMA_ADMIN',
      joinedAt: new Date().toISOString(),
      isActive: true,
      leftAt: null,
    };
    this.state.members.push(member);

    // Update user's chamaId
    const user = this.state.users.find(u => u.id === adminUserId);
    if (user) user.chamaId = chama.id;

    this.addAuditLog(adminUserId, user?.fullName || '', 'CHAMA_CREATED', 'chama', chama.id, chama.id, { name });
    this.notify();
    return { success: true, chama };
  }

  getChamaMembers(chamaId: string): ChamaMember[] {
    return this.state.members.filter(m => m.chamaId === chamaId && m.isActive);
  }

  getActiveMemberCount(chamaId: string): number {
    return this.state.members.filter(m => m.chamaId === chamaId && m.isActive).length;
  }

  canAddMember(chamaId: string): { allowed: boolean; reason?: string } {
    const chama = this.state.chamas.find(c => c.id === chamaId);
    if (!chama) return { allowed: false, reason: 'Chama not found' };
    if (chama.subscriptionStatus === 'SUSPENDED') return { allowed: false, reason: 'Chama is suspended' };
    if (chama.subscriptionStatus === 'CANCELLED') return { allowed: false, reason: 'Chama subscription is cancelled' };

    const plan = this.state.plans.find(p => p.id === chama.planId);
    if (!plan) return { allowed: false, reason: 'Plan not found' };

    const currentCount = this.getActiveMemberCount(chamaId);
    if (currentCount >= plan.maxMembers) {
      return { allowed: false, reason: `Maximum ${plan.maxMembers} members reached. Upgrade your plan to add more members.` };
    }
    return { allowed: true };
  }

  addMember(chamaId: string, userId: string, role: UserRole = 'MEMBER'): { success: boolean; error?: string } {
    const check = this.canAddMember(chamaId);
    if (!check.allowed) return { success: false, error: check.reason };

    const existing = this.state.members.find(m => m.chamaId === chamaId && m.userId === userId && m.isActive);
    if (existing) return { success: false, error: 'User is already a member' };

    const member: ChamaMember = {
      id: uuidv4(),
      chamaId,
      userId,
      role,
      joinedAt: new Date().toISOString(),
      isActive: true,
      leftAt: null,
    };
    this.state.members.push(member);

    const user = this.state.users.find(u => u.id === userId);
    if (user) user.chamaId = chamaId;

    this.addAuditLog(userId, user?.fullName || '', 'MEMBER_ADDED', 'member', member.id, chamaId, { role });
    this.notify();
    return { success: true };
  }

  removeMember(chamaId: string, userId: string): { success: boolean; error?: string } {
    const member = this.state.members.find(m => m.chamaId === chamaId && m.userId === userId && m.isActive);
    if (!member) return { success: false, error: 'Member not found' };

    // Don't remove the admin
    const chama = this.state.chamas.find(c => c.id === chamaId);
    if (chama && chama.adminId === userId) return { success: false, error: 'Cannot remove the Chama admin' };

    member.isActive = false;
    member.leftAt = new Date().toISOString();

    const user = this.state.users.find(u => u.id === userId);
    if (user) user.chamaId = null;

    // Preserve all financial records - do NOT delete contributions, loans, etc.
    this.addAuditLog(userId, user?.fullName || '', 'MEMBER_REMOVED', 'member', member.id, chamaId, {});
    this.notify();
    return { success: true };
  }

  // ============ CONTRIBUTIONS ============

  recordContribution(chamaId: string, memberId: string, amount: number, paymentMethod: string, notes: string, createdBy: string): { success: boolean; error?: string } {
    if (amount <= 0) return { success: false, error: 'Amount must be positive' };

    const contribution: Contribution = {
      id: uuidv4(),
      chamaId,
      memberId,
      amount: Math.round(amount * 100), // Store in cents
      date: new Date().toISOString(),
      paymentMethod,
      reference: `CONTRIB-${Date.now()}`,
      status: 'COMPLETED',
      notes,
      createdBy,
      createdAt: new Date().toISOString(),
    };
    this.state.contributions.push(contribution);

    // Create ledger entry
    const ledger: LedgerTransaction = {
      id: uuidv4(),
      chamaId,
      type: 'CONTRIBUTION',
      amount: contribution.amount,
      debit: 0,
      credit: contribution.amount,
      reference: contribution.reference,
      description: notes || 'Member contribution',
      memberId,
      createdAt: new Date().toISOString(),
    };
    this.state.ledger.push(ledger);

    this.addAuditLog(createdBy, '', 'CONTRIBUTION_RECORDED', 'contribution', contribution.id, chamaId, { amount: contribution.amount, memberId });
    this.notify();
    return { success: true };
  }

  // ============ LOANS ============

  applyForLoan(chamaId: string, memberId: string, amount: number, duration: number, purpose: string): { success: boolean; error?: string; loan?: Loan } {
    if (amount <= 0) return { success: false, error: 'Amount must be positive' };
    if (duration <= 0) return { success: false, error: 'Duration must be positive' };

    const loan: Loan = {
      id: uuidv4(),
      chamaId,
      memberId,
      amount: Math.round(amount * 100),
      interestRate: 10,
      duration,
      purpose,
      status: 'PENDING',
      appliedAt: new Date().toISOString(),
      approvedAt: null,
      disbursedAt: null,
      approvedBy: null,
      notes: '',
    };
    this.state.loans.push(loan);
    this.notify();
    return { success: true, loan };
  }

  approveLoan(chamaId: string, loanId: string, approvedBy: string): { success: boolean; error?: string } {
    const loan = this.state.loans.find(l => l.id === loanId && l.chamaId === chamaId);
    if (!loan) return { success: false, error: 'Loan not found' };
    if (loan.status !== 'PENDING') return { success: false, error: 'Loan is not pending' };

    loan.status = 'APPROVED';
    loan.approvedAt = new Date().toISOString();
    loan.approvedBy = approvedBy;
    this.addAuditLog(approvedBy, '', 'LOAN_APPROVED', 'loan', loan.id, chamaId, { amount: loan.amount });
    this.notify();
    return { success: true };
  }

  disburseLoan(chamaId: string, loanId: string, approvedBy: string): { success: boolean; error?: string } {
    const loan = this.state.loans.find(l => l.id === loanId && l.chamaId === chamaId);
    if (!loan) return { success: false, error: 'Loan not found' };
    if (loan.status !== 'APPROVED') return { success: false, error: 'Loan must be approved first' };

    loan.status = 'DISBURSED';
    loan.disbursedAt = new Date().toISOString();

    // Create ledger entry for disbursement
    const ledger: LedgerTransaction = {
      id: uuidv4(),
      chamaId,
      type: 'LOAN_DISBURSEMENT',
      amount: loan.amount,
      debit: loan.amount,
      credit: 0,
      reference: `LOAN-${loan.id}`,
      description: `Loan disbursement - ${loan.purpose}`,
      memberId: loan.memberId,
      createdAt: new Date().toISOString(),
    };
    this.state.ledger.push(ledger);

    this.addAuditLog(approvedBy, '', 'LOAN_DISBURSED', 'loan', loan.id, chamaId, { amount: loan.amount });
    this.notify();
    return { success: true };
  }

  repayLoan(chamaId: string, loanId: string, memberId: string, amount: number): { success: boolean; error?: string } {
    const loan = this.state.loans.find(l => l.id === loanId && l.chamaId === chamaId);
    if (!loan) return { success: false, error: 'Loan not found' };
    if (loan.status !== 'DISBURSED') return { success: false, error: 'Loan is not active' };
    if (amount <= 0) return { success: false, error: 'Amount must be positive' };

    const amountCents = Math.round(amount * 100);
    const totalRepaid = this.state.loanRepayments
      .filter(r => r.loanId === loanId)
      .reduce((sum, r) => sum + r.amount, 0);
    const totalOwed = loan.amount + Math.round(loan.amount * loan.interestRate / 100);
    
    if (totalRepaid + amountCents > totalOwed) {
      return { success: false, error: 'Payment exceeds outstanding balance' };
    }

    const repayment: LoanRepayment = {
      id: uuidv4(),
      chamaId,
      loanId,
      memberId,
      amount: amountCents,
      date: new Date().toISOString(),
      reference: `REPAY-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.state.loanRepayments.push(repayment);

    // Create ledger entry
    const ledger: LedgerTransaction = {
      id: uuidv4(),
      chamaId,
      type: 'LOAN_REPAYMENT',
      amount: amountCents,
      debit: 0,
      credit: amountCents,
      reference: repayment.reference,
      description: 'Loan repayment',
      memberId,
      createdAt: new Date().toISOString(),
    };
    this.state.ledger.push(ledger);

    // Check if fully repaid
    const newTotalRepaid = totalRepaid + amountCents;
    if (newTotalRepaid >= totalOwed) {
      loan.status = 'REPAID';
    }

    this.notify();
    return { success: true };
  }

  getLoanBalance(loanId: string): number {
    const loan = this.state.loans.find(l => l.id === loanId);
    if (!loan) return 0;
    const totalOwed = loan.amount + Math.round(loan.amount * loan.interestRate / 100);
    const totalRepaid = this.state.loanRepayments.filter(r => r.loanId === loanId).reduce((sum, r) => sum + r.amount, 0);
    return totalOwed - totalRepaid;
  }

  // ============ FINES ============

  createFine(chamaId: string, memberId: string, amount: number, reason: string, dueDate: string, createdBy: string): { success: boolean; error?: string } {
    if (amount <= 0) return { success: false, error: 'Amount must be positive' };

    const fine: Fine = {
      id: uuidv4(),
      chamaId,
      memberId,
      amount: Math.round(amount * 100),
      reason,
      dueDate,
      status: 'PENDING',
      paidAmount: 0,
      createdBy,
      createdAt: new Date().toISOString(),
    };
    this.state.fines.push(fine);
    this.addAuditLog(createdBy, '', 'FINE_CREATED', 'fine', fine.id, chamaId, { amount: fine.amount, memberId });
    this.notify();
    return { success: true };
  }

  payFine(chamaId: string, fineId: string, amount: number): { success: boolean; error?: string } {
    const fine = this.state.fines.find(f => f.id === fineId && f.chamaId === chamaId);
    if (!fine) return { success: false, error: 'Fine not found' };
    if (amount <= 0) return { success: false, error: 'Amount must be positive' };

    const amountCents = Math.round(amount * 100);
    const newPaid = fine.paidAmount + amountCents;
    if (newPaid > fine.amount) return { success: false, error: 'Payment exceeds fine amount' };

    fine.paidAmount = newPaid;
    fine.status = newPaid >= fine.amount ? 'PAID' : 'PARTIAL';

    const ledger: LedgerTransaction = {
      id: uuidv4(),
      chamaId,
      type: 'FINE_PAYMENT',
      amount: amountCents,
      debit: 0,
      credit: amountCents,
      reference: `FINE-PAY-${Date.now()}`,
      description: `Fine payment: ${fine.reason}`,
      memberId: fine.memberId,
      createdAt: new Date().toISOString(),
    };
    this.state.ledger.push(ledger);
    this.notify();
    return { success: true };
  }

  // ============ MEETINGS ============

  createMeeting(chamaId: string, title: string, date: string, location: string, agenda: string, createdBy: string): { success: boolean; error?: string } {
    const meeting: Meeting = {
      id: uuidv4(),
      chamaId,
      title,
      date,
      location,
      agenda,
      status: 'SCHEDULED',
      createdBy,
      createdAt: new Date().toISOString(),
    };
    this.state.meetings.push(meeting);
    this.notify();
    return { success: true };
  }

  recordAttendance(meetingId: string, chamaId: string, memberId: string, attended: boolean): { success: boolean; error?: string } {
    const existing = this.state.attendance.find(a => a.meetingId === meetingId && a.memberId === memberId);
    if (existing) {
      existing.attended = attended;
      existing.recordedAt = new Date().toISOString();
    } else {
      this.state.attendance.push({
        id: uuidv4(),
        meetingId,
        memberId,
        chamaId,
        attended,
        recordedAt: new Date().toISOString(),
      });
    }
    this.notify();
    return { success: true };
  }

  // ============ ANNOUNCEMENTS ============

  createAnnouncement(chamaId: string, title: string, content: string, publishedBy: string): { success: boolean; error?: string } {
    const announcement: Announcement = {
      id: uuidv4(),
      chamaId,
      title,
      content,
      publishedBy,
      publishedAt: new Date().toISOString(),
      isPublished: true,
    };
    this.state.announcements.push(announcement);
    this.notify();
    return { success: true };
  }

  // ============ MESSAGING ============

  sendMessage(chamaId: string, senderId: string, content: string): { success: boolean; error?: string } {
    // Verify sender belongs to this chama
    const senderMember = this.state.members.find(m => m.chamaId === chamaId && m.userId === senderId && m.isActive);
    if (!senderMember) return { success: false, error: 'Unauthorized: sender is not a member of this Chama' };

    const message: Message = {
      id: uuidv4(),
      chamaId,
      senderId,
      content,
      createdAt: new Date().toISOString(),
    };
    this.state.messages.push(message);
    this.notify();
    return { success: true };
  }

  markMessageRead(messageId: string, userId: string) {
    const existing = this.state.messageReads.find(r => r.messageId === messageId && r.userId === userId);
    if (!existing) {
      this.state.messageReads.push({ id: uuidv4(), messageId, userId, readAt: new Date().toISOString() });
      this.notify();
    }
  }

  getUnreadCount(userId: string, chamaId: string): number {
    const chamaMessages = this.state.messages.filter(m => m.chamaId === chamaId);
    const readIds = new Set(this.state.messageReads.filter(r => r.userId === userId).map(r => r.messageId));
    return chamaMessages.filter(m => !readIds.has(m.id) && m.senderId !== userId).length;
  }

  // ============ SUBSCRIPTIONS & PAYMENTS ============

  initiatePayment(chamaId: string, planId: string, phoneNumber: string): { success: boolean; error?: string; payment?: Payment } {
    const chama = this.state.chamas.find(c => c.id === chamaId);
    if (!chama) return { success: false, error: 'Chama not found' };
    const plan = this.state.plans.find(p => p.id === planId);
    if (!plan) return { success: false, error: 'Plan not found' };

    const payment: Payment = {
      id: uuidv4(),
      chamaId,
      planId,
      amount: plan.priceKES * 100, // Store in cents
      phoneNumber,
      status: 'PENDING',
      providerTransactionId: null,
      provider: 'test',
      reference: `PAY-${Date.now()}`,
      notes: `${plan.name} plan subscription`,
      createdAt: new Date().toISOString(),
      verifiedAt: null,
      isDuplicate: false,
    };
    this.state.payments.push(payment);
    this.notify();
    return { success: true, payment };
  }

  // Simulate payment verification (in production, this comes from M-Pesa callback)
  verifyPayment(paymentId: string, providerTransactionId: string): { success: boolean; error?: string } {
    const payment = this.state.payments.find(p => p.id === paymentId);
    if (!payment) return { success: false, error: 'Payment not found' };

    // Check for duplicate
    if (providerTransactionId && this.state.payments.find(p => p.providerTransactionId === providerTransactionId && p.status === 'SUCCESS')) {
      payment.isDuplicate = true;
      this.notify();
      return { success: false, error: 'Duplicate transaction detected' };
    }

    payment.status = 'SUCCESS';
    payment.providerTransactionId = providerTransactionId;
    payment.verifiedAt = new Date().toISOString();

    // Update subscription
    const chama = this.state.chamas.find(c => c.id === payment.chamaId);
    if (chama) {
      chama.planId = payment.planId;
      chama.subscriptionStatus = 'ACTIVE';
      chama.subscriptionStart = new Date().toISOString();
      chama.subscriptionEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      chama.gracePeriodEnd = null;
      chama.suspensionReason = null;
    }

    this.addAuditLog('system', 'System', 'PAYMENT_VERIFIED', 'payment', payment.id, payment.chamaId, { amount: payment.amount, transactionId: providerTransactionId });
    this.notify();
    return { success: true };
  }

  simulatePaymentResult(paymentId: string, result: 'SUCCESS' | 'FAILED' | 'TIMEOUT') {
    const payment = this.state.payments.find(p => p.id === paymentId);
    if (!payment) return;

    if (result === 'SUCCESS') {
      this.verifyPayment(paymentId, `TEST-PAYMENT-${Date.now()}`);
    } else if (result === 'FAILED') {
      payment.status = 'FAILED';
      this.notify();
    } else if (result === 'TIMEOUT') {
      payment.status = 'TIMEOUT';
      this.notify();
    }
  }

  // SUPER_ADMIN functions
  suspendChama(chamaId: string, reason: string, adminId: string): { success: boolean; error?: string } {
    const chama = this.state.chamas.find(c => c.id === chamaId);
    if (!chama) return { success: false, error: 'Chama not found' };
    chama.subscriptionStatus = 'SUSPENDED';
    chama.suspensionReason = reason;
    this.addAuditLog(adminId, '', 'CHAMA_SUSPENDED', 'chama', chamaId, chamaId, { reason });
    this.notify();
    return { success: true };
  }

  reactivateChama(chamaId: string, adminId: string): { success: boolean; error?: string } {
    const chama = this.state.chamas.find(c => c.id === chamaId);
    if (!chama) return { success: false, error: 'Chama not found' };
    chama.subscriptionStatus = 'ACTIVE';
    chama.subscriptionEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    chama.suspensionReason = null;
    this.addAuditLog(adminId, '', 'CHAMA_REACTIVATED', 'chama', chamaId, chamaId, {});
    this.notify();
    return { success: true };
  }

  extendSubscription(chamaId: string, days: number, adminId: string): { success: boolean; error?: string } {
    const chama = this.state.chamas.find(c => c.id === chamaId);
    if (!chama) return { success: false, error: 'Chama not found' };
    const currentEnd = new Date(chama.subscriptionEnd);
    chama.subscriptionEnd = new Date(currentEnd.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
    if (chama.subscriptionStatus === 'SUSPENDED' || chama.subscriptionStatus === 'GRACE_PERIOD') {
      chama.subscriptionStatus = 'ACTIVE';
    }
    this.addAuditLog(adminId, '', 'SUBSCRIPTION_EXTENDED', 'chama', chamaId, chamaId, { days });
    this.notify();
    return { success: true };
  }

  recordManualPayment(chamaId: string, amount: number, method: string, reference: string, notes: string, adminId: string): { success: boolean; error?: string } {
    const chama = this.state.chamas.find(c => c.id === chamaId);
    if (!chama) return { success: false, error: 'Chama not found' };

    const payment: Payment = {
      id: uuidv4(),
      chamaId,
      planId: chama.planId,
      amount: Math.round(amount * 100),
      phoneNumber: '',
      status: 'SUCCESS',
      providerTransactionId: `MANUAL-${Date.now()}`,
      provider: 'manual',
      reference,
      notes,
      createdAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
      isDuplicate: false,
    };
    this.state.payments.push(payment);

    // Extend subscription
    chama.subscriptionStatus = 'ACTIVE';
    chama.subscriptionEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    chama.suspensionReason = null;

    this.addAuditLog(adminId, '', 'MANUAL_PAYMENT_RECORDED', 'payment', payment.id, chamaId, { amount, method, reference });
    this.notify();
    return { success: true };
  }

  getRevenue(): number {
    return this.state.payments
      .filter(p => p.status === 'SUCCESS')
      .reduce((sum, p) => sum + p.amount, 0);
  }

  // ============ INVITATIONS ============

  createInvite(chamaId: string, email: string, phone: string, role: UserRole, invitedBy: string): { success: boolean; error?: string; invite?: Invite } {
    const check = this.canAddMember(chamaId);
    if (!check.allowed) return { success: false, error: check.reason };

    const invite: Invite = {
      id: uuidv4(),
      chamaId,
      email,
      phone,
      role,
      token: uuidv4() + '-' + Date.now().toString(36),
      status: 'PENDING',
      invitedBy,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      acceptedAt: null,
    };
    this.state.invites.push(invite);
    this.notify();
    return { success: true, invite };
  }

  acceptInvite(token: string, userId: string): { success: boolean; error?: string } {
    const invite = this.state.invites.find(i => i.token === token && i.status === 'PENDING');
    if (!invite) return { success: false, error: 'Invalid or expired invitation' };
    if (new Date(invite.expiresAt) < new Date()) {
      invite.status = 'EXPIRED';
      this.notify();
      return { success: false, error: 'Invitation has expired' };
    }

    invite.status = 'ACCEPTED';
    invite.acceptedAt = new Date().toISOString();
    this.addMember(invite.chamaId, userId, invite.role);
    return { success: true };
  }

  // ============ AUDIT ============

  private addAuditLog(actorId: string, actorName: string, action: string, entityType: string, entityId: string, chamaId: string | null, metadata: Record<string, any>) {
    this.state.auditLogs.push({
      id: uuidv4(),
      actorId,
      actorName,
      action,
      entityType,
      entityId,
      chamaId,
      metadata,
      createdAt: new Date().toISOString(),
    });
  }

  getAuditLogs(chamaId?: string): AuditLog[] {
    if (chamaId) return this.state.auditLogs.filter(l => l.chamaId === chamaId);
    return this.state.auditLogs;
  }

  // ============ QUERIES ============

  getChamaContributions(chamaId: string): Contribution[] {
    return this.state.contributions.filter(c => c.chamaId === chamaId);
  }

  getChamaLoans(chamaId: string): Loan[] {
    return this.state.loans.filter(l => l.chamaId === chamaId);
  }

  getChamaFines(chamaId: string): Fine[] {
    return this.state.fines.filter(f => f.chamaId === chamaId);
  }

  getChamaMeetings(chamaId: string): Meeting[] {
    return this.state.meetings.filter(m => m.chamaId === chamaId);
  }

  getChamaAnnouncements(chamaId: string): Announcement[] {
    return this.state.announcements.filter(a => a.chamaId === chamaId && a.isPublished);
  }

  getChamaMessages(chamaId: string): Message[] {
    return this.state.messages.filter(m => m.chamaId === chamaId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  getChamaLedger(chamaId: string): LedgerTransaction[] {
    return this.state.ledger.filter(l => l.chamaId === chamaId);
  }

  getChamaPayments(chamaId: string): Payment[] {
    return this.state.payments.filter(p => p.chamaId === chamaId);
  }

  getTotalSavings(chamaId: string): number {
    const contributions = this.state.contributions.filter(c => c.chamaId === chamaId).reduce((sum, c) => sum + c.amount, 0);
    const repayments = this.state.ledger.filter(l => l.chamaId === chamaId && l.type === 'LOAN_REPAYMENT').reduce((sum, l) => sum + l.credit, 0);
    return contributions + repayments;
  }

  getOutstandingLoans(chamaId: string): number {
    return this.state.loans
      .filter(l => l.chamaId === chamaId && (l.status === 'DISBURSED'))
      .reduce((sum, l) => sum + this.getLoanBalance(l.id), 0);
  }

  getOutstandingFines(chamaId: string): number {
    return this.state.fines
      .filter(f => f.chamaId === chamaId && f.status !== 'PAID')
      .reduce((sum, f) => sum + (f.amount - f.paidAmount), 0);
  }

  getUserNotifications(userId: string): Notification[] {
    return this.state.notifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // ============ CSV EXPORT ============

  exportCSV(type: string, chamaId: string): string {
    switch (type) {
      case 'contributions': {
        const contribs = this.getChamaContributions(chamaId);
        const header = 'Date,Member,Amount,Method,Reference,Status,Notes\n';
        const rows = contribs.map(c => {
          const member = this.state.members.find(m => m.id === c.memberId);
          const user = member ? this.state.users.find(u => u.id === member.userId) : null;
          return `${c.date},${user?.fullName || 'Unknown'},${(c.amount / 100).toFixed(2)},${c.paymentMethod},${c.reference},${c.status},"${c.notes}"`;
        }).join('\n');
        return header + rows;
      }
      case 'loans': {
        const loans = this.getChamaLoans(chamaId);
        const header = 'Applied,Member,Amount,Interest,Duration,Purpose,Status\n';
        const rows = loans.map(l => {
          const member = this.state.members.find(m => m.id === l.memberId);
          const user = member ? this.state.users.find(u => u.id === member.userId) : null;
          return `${l.appliedAt},${user?.fullName || 'Unknown'},${(l.amount / 100).toFixed(2)},${l.interestRate}%,${l.duration} months,"${l.purpose}",${l.status}`;
        }).join('\n');
        return header + rows;
      }
      case 'ledger': {
        const entries = this.getChamaLedger(chamaId);
        const header = 'Date,Type,Amount,Debit,Credit,Reference,Description\n';
        const rows = entries.map(l => `${l.createdAt},${l.type},${(l.amount / 100).toFixed(2)},${(l.debit / 100).toFixed(2)},${(l.credit / 100).toFixed(2)},${l.reference},"${l.description}"`).join('\n');
        return header + rows;
      }
      default:
        return '';
    }
  }
}

export const store = new ChamaPayStore();
