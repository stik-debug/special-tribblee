import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { store } from '../lib/store';
import type { User, Chama, ChamaMember } from '../lib/types';
import { Home, Users, Wallet, TrendingUp, Calendar, MessageSquare, Settings, LogOut, Menu, X, Download, Plus, AlertTriangle, CheckCircle, DollarSign, CreditCard, Smartphone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface DashboardProps { user: User; }

function formatKES(cents: number): string {
  return `KES ${(cents / 100).toLocaleString()}`;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ACTIVE: 'badge-success', TRIAL: 'badge-info', GRACE_PERIOD: 'badge-warning',
    SUSPENDED: 'badge-danger', CANCELLED: 'badge-danger', PAST_DUE: 'badge-warning',
    PENDING: 'badge-warning', APPROVED: 'badge-info', DISBURSED: 'badge-success',
    REPAID: 'badge-success', REJECTED: 'badge-danger', COMPLETED: 'badge-success',
    SCHEDULED: 'badge-info', PAID: 'badge-success', PARTIAL: 'badge-warning',
    SUCCESS: 'badge-success', FAILED: 'badge-danger', TIMEOUT: 'badge-warning',
  };
  return <span className={`badge ${colors[status] || 'badge-neutral'}`}>{status.replace('_', ' ')}</span>;
}

export default function Dashboard({ user }: DashboardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setTick] = useState(0);

  const refresh = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    const unsub = store.subscribe(refresh);
    return () => { unsub(); };
  }, [refresh]);

  const state = store.getState();
  const chama = state.chamas.find(c => c.id === user.chamaId);
  const memberRecord = state.members.find(m => m.chamaId === user.chamaId && m.userId === user.id && m.isActive);

  const handleLogout = () => {
    store.logout();
    navigate('/');
  };

  if (!chama || !memberRecord) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md">
          <h2 className="text-xl font-bold text-white mb-4">No Chama Found</h2>
          <p className="text-gray-400 mb-6">You're not part of any Chama yet. Create one to get started.</p>
          <CreateChamaForm userId={user.id} />
        </div>
      </div>
    );
  }

  if (chama.subscriptionStatus === 'SUSPENDED') {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md">
          <AlertTriangle size={48} className="text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Chama Suspended</h2>
          <p className="text-gray-400 mb-2">Your subscription has been suspended.</p>
          <p className="text-sm text-gray-500 mb-4">Reason: {chama.suspensionReason || 'Payment not received'}</p>
          <p className="text-sm text-gray-400 mb-6">Contact your admin or make a payment to restore access. All your data is preserved.</p>
          <button onClick={handleLogout} className="btn-secondary">Sign Out</button>
        </div>
      </div>
    );
  }

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Overview' },
    { path: '/dashboard/members', icon: Users, label: 'Members' },
    { path: '/dashboard/contributions', icon: Wallet, label: 'Contributions' },
    { path: '/dashboard/loans', icon: TrendingUp, label: 'Loans' },
    { path: '/dashboard/fines', icon: AlertTriangle, label: 'Fines' },
    { path: '/dashboard/meetings', icon: Calendar, label: 'Meetings' },
    { path: '/dashboard/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/dashboard/payments', icon: CreditCard, label: 'Payments' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex">
      {/* Sidebar - Desktop */}
      <aside className="sidebar hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-30">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <Wallet size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">ChamaPay</span>
          </div>
        </div>
        <div className="px-4 mb-4">
          <div className="p-3 rounded-xl bg-white/3 border border-white/5">
            <p className="text-sm font-medium text-white truncate">{chama.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={chama.subscriptionStatus} />
              <span className="text-xs text-gray-500">{state.plans.find(p => p.id === chama.planId)?.name}</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)} className={`sidebar-item w-full ${location.pathname === item.path ? 'active' : ''}`}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-xs text-white font-medium">
              {user.fullName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
              <p className="text-xs text-gray-500">{memberRecord.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-item w-full text-red-400 hover:bg-red-500/10 hover:text-red-300">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0a0f1a]/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400">
            <Menu size={24} />
          </button>
          <span className="font-bold text-white">{chama.name}</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-xs text-white font-medium">
            {user.fullName.charAt(0)}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="sidebar absolute left-0 top-0 bottom-0 w-72 p-4">
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-white">ChamaPay</span>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400"><X size={20} /></button>
            </div>
            <nav className="space-y-1">
              {navItems.map(item => (
                <button key={item.path} onClick={() => { navigate(item.path); setSidebarOpen(false); }} className={`sidebar-item w-full ${location.pathname === item.path ? 'active' : ''}`}>
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="absolute bottom-4 left-4 right-4">
              <button onClick={handleLogout} className="sidebar-item w-full text-red-400 hover:bg-red-500/10">
                <LogOut size={18} /><span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 pb-16 lg:pb-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
          <Routes>
            <Route path="/" element={<OverviewPage user={user} chama={chama} />} />
            <Route path="/members" element={<MembersPage user={user} chama={chama} />} />
            <Route path="/contributions" element={<ContributionsPage user={user} chama={chama} />} />
            <Route path="/loans" element={<LoansPage user={user} chama={chama} />} />
            <Route path="/fines" element={<FinesPage user={user} chama={chama} />} />
            <Route path="/meetings" element={<MeetingsPage user={user} chama={chama} />} />
            <Route path="/messages" element={<MessagesPage user={user} chama={chama} />} />
            <Route path="/payments" element={<PaymentsPage user={user} chama={chama} />} />
            <Route path="/settings" element={<SettingsPage user={user} chama={chama} />} />
          </Routes>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0f1a]/95 backdrop-blur-xl border-t border-white/5">
        <div className="flex items-center justify-around py-2">
          {[
            { path: '/dashboard', icon: Home, label: 'Home' },
            { path: '/dashboard/contributions', icon: Wallet, label: 'Funds' },
            { path: '/dashboard/loans', icon: TrendingUp, label: 'Loans' },
            { path: '/dashboard/messages', icon: MessageSquare, label: 'Chat' },
            { path: '/dashboard/settings', icon: Settings, label: 'More' },
          ].map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                location.pathname === item.path ? 'text-emerald-400' : 'text-gray-500'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

// ============ OVERVIEW PAGE ============
function OverviewPage({ user, chama }: { user: User; chama: Chama }) {
  const state = store.getState();
  const totalSavings = store.getTotalSavings(chama.id);
  const outstandingLoans = store.getOutstandingLoans(chama.id);
  const outstandingFines = store.getOutstandingFines(chama.id);
  const memberCount = store.getActiveMemberCount(chama.id);
  const plan = state.plans.find(p => p.id === chama.planId);
  const contributions = store.getChamaContributions(chama.id);
  const recentContributions = contributions.slice(-5).reverse();
  const meetings = store.getChamaMeetings(chama.id).filter(m => m.status === 'SCHEDULED');
  const announcements = store.getChamaAnnouncements(chama.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back, {user.fullName}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={18} className="text-emerald-400" />
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Savings</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{formatKES(totalSavings)}</p>
          <p className="text-xs text-gray-500 mt-1">Total savings</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <Wallet size={18} className="text-blue-400" />
            <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">Monthly</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{formatKES(contributions.reduce((s, c) => s + c.amount, 0))}</p>
          <p className="text-xs text-gray-500 mt-1">Contributions</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={18} className="text-amber-400" />
            <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Loans</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{formatKES(outstandingLoans)}</p>
          <p className="text-xs text-gray-500 mt-1">Outstanding</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <Users size={18} className="text-purple-400" />
            <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">Members</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{memberCount}/{plan?.maxMembers}</p>
          <p className="text-xs text-gray-500 mt-1">Active members</p>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="glass-card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-400">Subscription</h3>
            <div className="flex items-center gap-3 mt-1">
              <StatusBadge status={chama.subscriptionStatus} />
              <span className="text-white font-medium">{plan?.name} Plan</span>
              <span className="text-gray-500 text-sm">• KES {plan?.priceKES.toLocaleString()}/month</span>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            <p>Renews: {new Date(chama.subscriptionEnd).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {contributions.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Contribution Trend</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={contributions.slice(-7).map((c, i) => ({
                  name: `Day ${i + 1}`,
                  amount: c.amount / 100,
                }))}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Financial Overview</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Savings', value: totalSavings / 100 },
                      { name: 'Loans Out', value: outstandingLoans / 100 },
                      { name: 'Fines', value: outstandingFines / 100 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-xs text-gray-400">Savings</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /><span className="text-xs text-gray-400">Loans</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /><span className="text-xs text-gray-400">Fines</span></div>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Contributions</h3>
          {recentContributions.length === 0 ? (
            <p className="text-gray-500 text-sm">No contributions yet</p>
          ) : (
            <div className="space-y-3">
              {recentContributions.map(c => {
                const member = state.members.find(m => m.id === c.memberId);
                const memberUser = member ? state.users.find(u => u.id === member.userId) : null;
                return (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-sm text-white">{memberUser?.fullName || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{new Date(c.date).toLocaleDateString()}</p>
                    </div>
                    <span className="text-sm font-medium text-emerald-400">{formatKES(c.amount)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Meetings & Announcements */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Upcoming Meetings</h3>
            {meetings.length === 0 ? (
              <p className="text-gray-500 text-sm">No upcoming meetings</p>
            ) : (
              <div className="space-y-3">
                {meetings.slice(0, 3).map(m => (
                  <div key={m.id} className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Calendar size={16} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white">{m.title}</p>
                      <p className="text-xs text-gray-500">{new Date(m.date).toLocaleDateString()} • {m.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Announcements</h3>
            {announcements.length === 0 ? (
              <p className="text-gray-500 text-sm">No announcements</p>
            ) : (
              <div className="space-y-3">
                {announcements.slice(0, 3).map(a => (
                  <div key={a.id} className="py-2 border-b border-white/5 last:border-0">
                    <p className="text-sm font-medium text-white">{a.title}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{a.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ MEMBERS PAGE ============
function MembersPage({ user, chama }: { user: User; chama: Chama }) {
  const state = store.getState();
  const members = store.getChamaMembers(chama.id);
  const plan = state.plans.find(p => p.id === chama.planId);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRole, setInviteRole] = useState<string>('MEMBER');
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');

  const isAdmin = user.role === 'CHAMA_ADMIN' || user.role === 'SUPER_ADMIN';
  const canAdd = store.canAddMember(chama.id);

  const handleInvite = () => {
    setInviteError('');
    setInviteSuccess('');
    const result = store.createInvite(chama.id, inviteEmail, invitePhone, inviteRole as any, user.id);
    if (result.success) {
      setInviteSuccess('Invitation sent!');
      setInviteEmail('');
      setInvitePhone('');
    } else {
      setInviteError(result.error || 'Failed to send invitation');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Members</h1>
          <p className="text-gray-400 text-sm mt-1">{members.length}/{plan?.maxMembers} members • {canAdd.allowed ? 'Can add more' : 'At capacity'}</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowInvite(!showInvite)} className="btn-primary" disabled={!canAdd.allowed}>
            <Plus size={16} /> Invite Member
          </button>
        )}
      </div>

      {!canAdd.allowed && (
        <div className="glass-card p-4 border-amber-500/20 bg-amber-500/5">
          <p className="text-sm text-amber-400">{canAdd.reason}</p>
        </div>
      )}

      {showInvite && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Invite New Member</h3>
          {inviteError && <p className="text-sm text-red-400 mb-3">{inviteError}</p>}
          {inviteSuccess && <p className="text-sm text-emerald-400 mb-3">{inviteSuccess}</p>}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="input-field" placeholder="Email" />
            <input type="tel" value={invitePhone} onChange={e => setInvitePhone(e.target.value)} className="input-field" placeholder="Phone (254...)" />
          </div>
          <div className="flex items-center gap-4">
            <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="input-field max-w-[200px]">
              <option value="MEMBER">Member</option>
              <option value="TREASURER">Treasurer</option>
              <option value="SECRETARY">Secretary</option>
            </select>
            <button onClick={handleInvite} className="btn-primary">Send Invite</button>
          </div>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => {
                const memberUser = state.users.find(u => u.id === m.userId);
                return (
                  <tr key={m.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-xs text-white font-medium">
                          {memberUser?.fullName?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-sm text-white">{memberUser?.fullName || 'Unknown User'}</p>
                          <p className="text-xs text-gray-500">{memberUser?.email || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-neutral">{m.role}</span></td>
                    <td className="text-gray-400 text-sm">{new Date(m.joinedAt).toLocaleDateString()}</td>
                    <td><StatusBadge status={m.isActive ? 'ACTIVE' : 'CANCELLED'} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ CONTRIBUTIONS PAGE ============
function ContributionsPage({ user, chama }: { user: User; chama: Chama }) {
  const state = store.getState();
  const contributions = store.getChamaContributions(chama.id);
  const members = store.getChamaMembers(chama.id);
  const [showForm, setShowForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('M-PESA');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const canRecord = ['CHAMA_ADMIN', 'TREASURER', 'SUPER_ADMIN'].includes(user.role);

  const handleRecord = () => {
    setError('');
    if (!selectedMember || !amount) { setError('Member and amount are required'); return; }
    const result = store.recordContribution(chama.id, selectedMember, parseFloat(amount), method, notes, user.id);
    if (result.success) {
      setShowForm(false);
      setSelectedMember('');
      setAmount('');
      setNotes('');
    } else {
      setError(result.error || 'Failed');
    }
  };

  const handleExport = () => {
    const csv = store.exportCSV('contributions', chama.id);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contributions-${chama.name}-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Contributions</h1>
          <p className="text-gray-400 text-sm mt-1">{contributions.length} total contributions</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-secondary"><Download size={16} /> Export</button>
          {canRecord && <button onClick={() => setShowForm(!showForm)} className="btn-primary"><Plus size={16} /> Record</button>}
        </div>
      </div>

      {showForm && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Record Contribution</h3>
          {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)} className="input-field">
              <option value="">Select member...</option>
              {members.map(m => {
                const u = state.users.find(usr => usr.id === m.userId);
                return <option key={m.id} value={m.id}>{u?.fullName || 'Unknown'}</option>;
              })}
            </select>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="input-field" placeholder="Amount (KES)" min="0" step="0.01" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <select value={method} onChange={e => setMethod(e.target.value)} className="input-field">
              <option value="M-PESA">M-PESA</option>
              <option value="BANK">Bank Transfer</option>
              <option value="CASH">Cash</option>
            </select>
            <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="input-field" placeholder="Notes" />
          </div>
          <button onClick={handleRecord} className="btn-primary">Record Contribution</button>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Member</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {contributions.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-500 py-8">No contributions recorded yet</td></tr>
              ) : contributions.slice().reverse().map(c => {
                const member = state.members.find(m => m.id === c.memberId);
                const memberUser = member ? state.users.find(u => u.id === member.userId) : null;
                return (
                  <tr key={c.id}>
                    <td className="text-gray-400 text-sm">{new Date(c.date).toLocaleDateString()}</td>
                    <td className="text-white text-sm">{memberUser?.fullName || 'Unknown'}</td>
                    <td className="text-emerald-400 font-medium text-sm">{formatKES(c.amount)}</td>
                    <td className="text-gray-400 text-sm">{c.paymentMethod}</td>
                    <td><StatusBadge status={c.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ LOANS PAGE ============
function LoansPage({ user, chama }: { user: User; chama: Chama }) {
  const state = store.getState();
  const loans = store.getChamaLoans(chama.id);
  const members = store.getChamaMembers(chama.id);
  const [showApply, setShowApply] = useState(false);
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('3');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState('');

  const canApprove = ['CHAMA_ADMIN', 'TREASURER', 'SUPER_ADMIN'].includes(user.role);
  const myMemberId = state.members.find(m => m.chamaId === chama.id && m.userId === user.id)?.id;

  const handleApply = () => {
    setError('');
    if (!amount || !purpose || !myMemberId) { setError('All fields required'); return; }
    const result = store.applyForLoan(chama.id, myMemberId, parseFloat(amount), parseInt(duration), purpose);
    if (result.success) {
      setShowApply(false);
      setAmount('');
      setPurpose('');
    } else {
      setError(result.error || 'Failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Loans</h1>
          <p className="text-gray-400 text-sm mt-1">{loans.length} total loans</p>
        </div>
        <button onClick={() => setShowApply(!showApply)} className="btn-primary"><Plus size={16} /> Apply for Loan</button>
      </div>

      {showApply && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Loan Application</h3>
          {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="input-field" placeholder="Amount (KES)" min="0" />
            <select value={duration} onChange={e => setDuration(e.target.value)} className="input-field">
              <option value="1">1 month</option>
              <option value="2">2 months</option>
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
            </select>
          </div>
          <input type="text" value={purpose} onChange={e => setPurpose(e.target.value)} className="input-field mb-4" placeholder="Purpose" />
          <button onClick={handleApply} className="btn-primary">Submit Application</button>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Amount</th>
                <th>Duration</th>
                <th>Purpose</th>
                <th>Status</th>
                {canApprove && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loans.length === 0 ? (
                <tr><td colSpan={canApprove ? 6 : 5} className="text-center text-gray-500 py-8">No loans yet</td></tr>
              ) : loans.map(l => {
                const member = state.members.find(m => m.id === l.memberId);
                const memberUser = member ? state.users.find(u => u.id === member.userId) : null;
                return (
                  <tr key={l.id}>
                    <td className="text-white text-sm">{memberUser?.fullName || 'Unknown'}</td>
                    <td className="text-white font-medium text-sm">{formatKES(l.amount)}</td>
                    <td className="text-gray-400 text-sm">{l.duration} months</td>
                    <td className="text-gray-400 text-sm max-w-[150px] truncate">{l.purpose}</td>
                    <td><StatusBadge status={l.status} /></td>
                    {canApprove && (
                      <td>
                        {l.status === 'PENDING' && (
                          <button onClick={() => store.approveLoan(chama.id, l.id, user.id)} className="text-xs text-emerald-400 hover:text-emerald-300">Approve</button>
                        )}
                        {l.status === 'APPROVED' && (
                          <button onClick={() => store.disburseLoan(chama.id, l.id, user.id)} className="text-xs text-blue-400 hover:text-blue-300">Disburse</button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ FINES PAGE ============
function FinesPage({ user, chama }: { user: User; chama: Chama }) {
  const state = store.getState();
  const fines = store.getChamaFines(chama.id);
  const members = store.getChamaMembers(chama.id);
  const [showForm, setShowForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const canCreate = ['CHAMA_ADMIN', 'SECRETARY', 'SUPER_ADMIN'].includes(user.role);

  const handleCreate = () => {
    setError('');
    if (!selectedMember || !amount || !reason) { setError('All fields required'); return; }
    const result = store.createFine(chama.id, selectedMember, parseFloat(amount), reason, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], user.id);
    if (result.success) {
      setShowForm(false);
      setSelectedMember('');
      setAmount('');
      setReason('');
    } else {
      setError(result.error || 'Failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Fines</h1>
          <p className="text-gray-400 text-sm mt-1">{fines.length} total fines</p>
        </div>
        {canCreate && <button onClick={() => setShowForm(!showForm)} className="btn-primary"><Plus size={16} /> Create Fine</button>}
      </div>

      {showForm && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Create Fine</h3>
          {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)} className="input-field">
              <option value="">Select member...</option>
              {members.map(m => {
                const u = state.users.find(usr => usr.id === m.userId);
                return <option key={m.id} value={m.id}>{u?.fullName || 'Unknown'}</option>;
              })}
            </select>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="input-field" placeholder="Amount (KES)" min="0" />
          </div>
          <input type="text" value={reason} onChange={e => setReason(e.target.value)} className="input-field mb-4" placeholder="Reason" />
          <button onClick={handleCreate} className="btn-primary">Create Fine</button>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Amount</th>
                <th>Reason</th>
                <th>Paid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {fines.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-500 py-8">No fines</td></tr>
              ) : fines.map(f => {
                const member = state.members.find(m => m.id === f.memberId);
                const memberUser = member ? state.users.find(u => u.id === member.userId) : null;
                return (
                  <tr key={f.id}>
                    <td className="text-white text-sm">{memberUser?.fullName || 'Unknown'}</td>
                    <td className="text-white font-medium text-sm">{formatKES(f.amount)}</td>
                    <td className="text-gray-400 text-sm">{f.reason}</td>
                    <td className="text-emerald-400 text-sm">{formatKES(f.paidAmount)}</td>
                    <td><StatusBadge status={f.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ MEETINGS PAGE ============
function MeetingsPage({ user, chama }: { user: User; chama: Chama }) {
  const state = store.getState();
  const meetings = store.getChamaMeetings(chama.id);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [agenda, setAgenda] = useState('');

  const canCreate = ['CHAMA_ADMIN', 'SECRETARY', 'SUPER_ADMIN'].includes(user.role);

  const handleCreate = () => {
    if (!title || !date || !location) return;
    store.createMeeting(chama.id, title, date, location, agenda, user.id);
    setShowForm(false);
    setTitle(''); setDate(''); setLocation(''); setAgenda('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Meetings</h1>
          <p className="text-gray-400 text-sm mt-1">{meetings.length} meetings</p>
        </div>
        {canCreate && <button onClick={() => setShowForm(!showForm)} className="btn-primary"><Plus size={16} /> Schedule Meeting</button>}
      </div>

      {showForm && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Schedule Meeting</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="input-field" placeholder="Meeting title" />
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
          </div>
          <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="input-field mb-4" placeholder="Location" />
          <textarea value={agenda} onChange={e => setAgenda(e.target.value)} className="input-field mb-4" placeholder="Agenda" rows={3} />
          <button onClick={handleCreate} className="btn-primary">Create Meeting</button>
        </div>
      )}

      <div className="grid gap-4">
        {meetings.length === 0 ? (
          <div className="glass-card p-8 text-center text-gray-500">No meetings scheduled</div>
        ) : meetings.map(m => (
          <div key={m.id} className="glass-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{m.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{new Date(m.date).toLocaleDateString()} • {m.location}</p>
                {m.agenda && <p className="text-sm text-gray-500 mt-2 whitespace-pre-line">{m.agenda}</p>}
              </div>
              <StatusBadge status={m.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ MESSAGES PAGE ============
function MessagesPage({ user, chama }: { user: User; chama: Chama }) {
  const state = store.getState();
  const messages = store.getChamaMessages(chama.id);
  const [newMessage, setNewMessage] = useState('');
  const unreadCount = store.getUnreadCount(user.id, chama.id);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    store.sendMessage(chama.id, user.id, newMessage.trim());
    setNewMessage('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="text-gray-400 text-sm mt-1">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
      </div>

      <div className="glass-card flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">No messages yet. Start the conversation!</div>
          ) : messages.map(msg => {
            const sender = state.users.find(u => u.id === msg.senderId);
            const isMe = msg.senderId === user.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe ? 'bg-emerald-600/20 border border-emerald-500/20' : 'bg-white/5 border border-white/5'}`}>
                  {!isMe && <p className="text-xs text-emerald-400 font-medium mb-1">{sender?.fullName || 'Unknown'}</p>}
                  <p className="text-sm text-white">{msg.content}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-4 border-t border-white/5">
          <div className="flex gap-2">
            <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} className="input-field flex-1" placeholder="Type a message..." />
            <button onClick={handleSend} className="btn-primary !px-4">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ SETTINGS PAGE ============
function SettingsPage({ user, chama }: { user: User; chama: Chama }) {
  const state = store.getState();
  const plan = state.plans.find(p => p.id === chama.planId);
  const memberCount = store.getActiveMemberCount(chama.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Chama Profile</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">Name</span>
            <span className="text-white">{chama.name}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">Description</span>
            <span className="text-white">{chama.description}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">Created</span>
            <span className="text-white">{new Date(chama.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Subscription</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">Plan</span>
            <span className="text-white">{plan?.name} — KES {plan?.priceKES.toLocaleString()}/month</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">Status</span>
            <StatusBadge status={chama.subscriptionStatus} />
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">Members</span>
            <span className="text-white">{memberCount}/{plan?.maxMembers}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">Renewal Date</span>
            <span className="text-white">{new Date(chama.subscriptionEnd).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Your Profile</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">Name</span>
            <span className="text-white">{user.fullName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">Email</span>
            <span className="text-white">{user.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">Role</span>
            <span className="text-white">{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ PAYMENTS PAGE ============
function PaymentsPage({ user, chama }: { user: User; chama: Chama }) {
  const state = store.getState();
  const plans = state.plans.filter(p => p.isActive);
  const currentPlan = state.plans.find(p => p.id === chama.planId);
  const payments = store.getChamaPayments(chama.id);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [phone, setPhone] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; message: string } | null>(null);
  const [paymentId, setPaymentId] = useState('');
  const canManage = ['CHAMA_ADMIN', 'TREASURER', 'SUPER_ADMIN'].includes(user.role);

  const handleInitiatePayment = async () => {
    if (!selectedPlan || !phone) return;
    setProcessing(true);
    setPaymentResult(null);

    const result = store.initiatePayment(chama.id, selectedPlan, phone);
    if (!result.success || !result.payment) {
      setPaymentResult({ success: false, message: result.error || 'Failed to initiate payment' });
      setProcessing(false);
      return;
    }

    setPaymentId(result.payment.id);

    // Simulate M-Pesa STK push processing
    await new Promise(r => setTimeout(r, 2000));

    // Simulate successful payment (in production, this comes from M-Pesa callback)
    store.simulatePaymentResult(result.payment.id, 'SUCCESS');
    setPaymentResult({ success: true, message: 'Payment verified successfully! Subscription activated.' });
    setProcessing(false);
  };

  const handleSimulateFail = async () => {
    if (!paymentId) return;
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    store.simulatePaymentResult(paymentId, 'FAILED');
    setPaymentResult({ success: false, message: 'Payment failed. Please try again.' });
    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Subscription & Payments</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your ChamaPay subscription</p>
      </div>

      {/* Current Subscription */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-400">Current Plan</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xl font-bold text-white">{currentPlan?.name}</span>
              <StatusBadge status={chama.subscriptionStatus} />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              KES {currentPlan?.priceKES.toLocaleString()}/month • Up to {currentPlan?.maxMembers} members
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Expires: {new Date(chama.subscriptionEnd).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Pricing is per Chama, not per member</p>
          </div>
        </div>
      </div>

      {/* Payment Flow */}
      {canManage && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {paymentResult ? 'Payment Result' : 'Renew / Change Plan'}
          </h3>

          {paymentResult ? (
            <div className={`p-4 rounded-xl ${paymentResult.success ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              <div className="flex items-center gap-3">
                {paymentResult.success ? (
                  <CheckCircle size={24} className="text-emerald-400" />
                ) : (
                  <AlertTriangle size={24} className="text-red-400" />
                )}
                <p className={`text-sm font-medium ${paymentResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                  {paymentResult.message}
                </p>
              </div>
              <button onClick={() => { setPaymentResult(null); setPaymentId(''); }} className="mt-3 text-sm text-gray-400 hover:text-white">
                ← Back to plans
              </button>
            </div>
          ) : (
            <>
              {/* Plan Selection */}
              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                {plans.map(plan => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedPlan === plan.id
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <p className="text-sm font-bold text-emerald-400">{plan.name}</p>
                    <p className="text-xl font-bold text-white mt-1">KES {plan.priceKES.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Up to {plan.maxMembers} members</p>
                    {chama.planId === plan.id && (
                      <span className="text-[10px] text-emerald-400 mt-2 inline-block">Current plan</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Phone Number */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">M-Pesa Phone Number</label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10">
                    <Smartphone size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">+254</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="input-field flex-1"
                    placeholder="7XXXXXXXX"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleInitiatePayment}
                  disabled={!selectedPlan || !phone || processing}
                  className="btn-primary disabled:opacity-50"
                >
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing STK Push...
                    </span>
                  ) : (
                    <>Pay with M-Pesa</>
                  )}
                </button>
                {paymentId && (
                  <button onClick={handleSimulateFail} className="btn-secondary text-red-400 border-red-500/20">
                    Simulate Failure
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-4">
                You will receive an STK push on your phone. Enter your M-Pesa PIN to confirm payment.
                Payment is verified server-side before subscription activation.
              </p>
            </>
          )}
        </div>
      )}

      {/* Payment History */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">Payment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Plan</th>
                <th>Reference</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-500 py-8">No payment history</td></tr>
              ) : payments.slice().reverse().map(p => {
                const plan = state.plans.find(pl => pl.id === p.planId);
                return (
                  <tr key={p.id}>
                    <td className="text-gray-400 text-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="text-emerald-400 font-medium text-sm">{formatKES(p.amount)}</td>
                    <td className="text-gray-400 text-sm">{plan?.name || '-'}</td>
                    <td className="text-gray-400 text-xs font-mono">{p.reference}</td>
                    <td><StatusBadge status={p.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ CREATE CHAMA FORM ============
function CreateChamaForm({ userId }: { userId: string }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    setError('');
    const result = store.createChama(name, description, userId);
    if (!result.success) {
      setError(result.error || 'Failed to create Chama');
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-400">{error}</p>}
      <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="Chama name" />
      <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="input-field" placeholder="Description" />
      <button onClick={handleCreate} className="btn-primary w-full justify-center">Create Chama</button>
    </div>
  );
}
