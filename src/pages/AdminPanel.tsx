import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { store } from '../lib/store';
import type { User, Chama } from '../lib/types';
import { LayoutDashboard, Users, CreditCard, Shield, FileText, LogOut, Menu, X, Search, AlertTriangle, CheckCircle, Clock, DollarSign, TrendingUp, Ban, Unlock, Plus, Download } from 'lucide-react';

interface AdminPanelProps { user: User; }

function formatKES(cents: number): string {
  return `KES ${(cents / 100).toLocaleString()}`;
}

export default function AdminPanel({ user }: AdminPanelProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setTick] = useState(0);

  const refresh = useCallback(() => setTick(t => t + 1), []);
  useEffect(() => {
    const unsub = store.subscribe(refresh);
    return () => { unsub(); };
  }, [refresh]);

  const handleLogout = () => {
    store.logout();
    navigate('/');
  };

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Overview' },
    { path: '/admin/chamas', icon: Users, label: 'Chamas' },
    { path: '/admin/payments', icon: CreditCard, label: 'Payments' },
    { path: '/admin/audit', icon: FileText, label: 'Audit Logs' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex">
      {/* Sidebar - Desktop */}
      <aside className="sidebar hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-30">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">ChamaPay</span>
              <p className="text-[10px] text-amber-400 font-medium tracking-wider">SUPER ADMIN</p>
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-xs text-white font-medium">
              {user.fullName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
              <p className="text-xs text-amber-400">Super Admin</p>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-item w-full text-red-400 hover:bg-red-500/10 hover:text-red-300">
            <LogOut size={18} /><span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0a0f1a]/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400"><Menu size={24} /></button>
          <span className="font-bold text-white flex items-center gap-2">
            <Shield size={16} className="text-amber-400" /> Admin
          </span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-xs text-white font-medium">
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
              <span className="font-bold text-white">Admin Panel</span>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400"><X size={20} /></button>
            </div>
            <nav className="space-y-1">
              {navItems.map(item => (
                <button key={item.path} onClick={() => { navigate(item.path); setSidebarOpen(false); }} className={`sidebar-item w-full ${location.pathname === item.path ? 'active' : ''}`}>
                  <item.icon size={18} /><span>{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/chamas" element={<AdminChamas user={user} />} />
            <Route path="/payments" element={<AdminPayments />} />
            <Route path="/audit" element={<AdminAudit />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// ============ ADMIN OVERVIEW ============
function AdminOverview() {
  const state = store.getState();
  const totalChamas = state.chamas.length;
  const totalUsers = state.users.filter(u => u.role !== 'SUPER_ADMIN').length;
  const activeSubs = state.chamas.filter(c => c.subscriptionStatus === 'ACTIVE').length;
  const trialSubs = state.chamas.filter(c => c.subscriptionStatus === 'TRIAL').length;
  const graceSubs = state.chamas.filter(c => c.subscriptionStatus === 'GRACE_PERIOD').length;
  const suspendedSubs = state.chamas.filter(c => c.subscriptionStatus === 'SUSPENDED').length;
  const cancelledSubs = state.chamas.filter(c => c.subscriptionStatus === 'CANCELLED').length;
  const successfulPayments = state.payments.filter(p => p.status === 'SUCCESS').length;
  const revenue = store.getRevenue();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">System overview and metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-emerald-400" />
            <span className="text-xs text-gray-500">Total Chamas</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalChamas}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-blue-400" />
            <span className="text-xs text-gray-500">Total Users</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalUsers}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-emerald-400" />
            <span className="text-xs text-gray-500">Active Subs</span>
          </div>
          <p className="text-2xl font-bold text-white">{activeSubs}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-amber-400" />
            <span className="text-xs text-gray-500">Revenue</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatKES(revenue)}</p>
        </div>
      </div>

      {/* Subscription Breakdown */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Subscription Status</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Active', count: activeSubs, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Trial', count: trialSubs, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Grace Period', count: graceSubs, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { label: 'Suspended', count: suspendedSubs, color: 'text-red-400', bg: 'bg-red-500/10' },
            { label: 'Cancelled', count: cancelledSubs, color: 'text-gray-400', bg: 'bg-gray-500/10' },
          ].map(item => (
            <div key={item.label} className={`${item.bg} rounded-xl p-4 text-center`}>
              <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
              <p className="text-xs text-gray-400 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Stats */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Summary</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/3">
            <p className="text-sm text-gray-400">Successful Payments</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">{successfulPayments}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/3">
            <p className="text-sm text-gray-400">Pending Payments</p>
            <p className="text-xl font-bold text-amber-400 mt-1">{state.payments.filter(p => p.status === 'PENDING').length}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/3">
            <p className="text-sm text-gray-400">Failed Payments</p>
            <p className="text-xl font-bold text-red-400 mt-1">{state.payments.filter(p => p.status === 'FAILED').length}</p>
          </div>
        </div>
      </div>

      {/* Recent Chamas */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">All Chamas</h3>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Plan</th>
                <th>Members</th>
                <th>Status</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              {state.chamas.map(c => {
                const plan = state.plans.find(p => p.id === c.planId);
                const memberCount = store.getActiveMemberCount(c.id);
                return (
                  <tr key={c.id}>
                    <td className="text-white font-medium">{c.name}</td>
                    <td className="text-gray-400">{plan?.name}</td>
                    <td className="text-gray-400">{memberCount}/{plan?.maxMembers}</td>
                    <td><StatusBadge status={c.subscriptionStatus} /></td>
                    <td className="text-gray-400 text-sm">{new Date(c.subscriptionEnd).toLocaleDateString()}</td>
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

// ============ ADMIN CHAMAS ============
function AdminChamas({ user }: { user: User }) {
  const state = store.getState();
  const [search, setSearch] = useState('');
  const [selectedChama, setSelectedChama] = useState<Chama | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [showSuspend, setShowSuspend] = useState(false);
  const [showExtend, setShowExtend] = useState(false);
  const [extendDays, setExtendDays] = useState('30');
  const [showManualPay, setShowManualPay] = useState(false);
  const [manualAmount, setManualAmount] = useState('');
  const [manualRef, setManualRef] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const filtered = state.chamas.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSuspend = () => {
    if (!selectedChama || !suspendReason) return;
    store.suspendChama(selectedChama.id, suspendReason, user.id);
    setShowSuspend(false);
    setSuspendReason('');
    setActionMessage(`${selectedChama.name} suspended successfully`);
    setSelectedChama(null);
  };

  const handleReactivate = () => {
    if (!selectedChama) return;
    store.reactivateChama(selectedChama.id, user.id);
    setActionMessage(`${selectedChama.name} reactivated successfully`);
    setSelectedChama(null);
  };

  const handleExtend = () => {
    if (!selectedChama) return;
    store.extendSubscription(selectedChama.id, parseInt(extendDays), user.id);
    setShowExtend(false);
    setActionMessage(`Subscription extended by ${extendDays} days`);
    setSelectedChama(null);
  };

  const handleManualPay = () => {
    if (!selectedChama || !manualAmount) return;
    store.recordManualPayment(selectedChama.id, parseFloat(manualAmount), 'MANUAL', manualRef || `MANUAL-${Date.now()}`, 'Manual payment recorded by admin', user.id);
    setShowManualPay(false);
    setManualAmount('');
    setManualRef('');
    setActionMessage(`Manual payment recorded for ${selectedChama.name}`);
    setSelectedChama(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Chama Management</h1>
        <p className="text-gray-400 text-sm mt-1">Manage all registered Chamas</p>
      </div>

      {actionMessage && (
        <div className="glass-card p-4 border-emerald-500/20 bg-emerald-500/5">
          <p className="text-sm text-emerald-400">{actionMessage}</p>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search Chamas..." />
      </div>

      {/* Chamas List */}
      <div className="space-y-3">
        {filtered.map(c => {
          const plan = state.plans.find(p => p.id === c.planId);
          const memberCount = store.getActiveMemberCount(c.id);
          return (
            <div key={c.id} className="glass-card p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">{c.name}</h3>
                    <StatusBadge status={c.subscriptionStatus} />
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{c.description}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                    <span>Plan: {plan?.name} (KES {plan?.priceKES})</span>
                    <span>Members: {memberCount}/{plan?.maxMembers}</span>
                    <span>Expires: {new Date(c.subscriptionEnd).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setSelectedChama(c); setShowExtend(true); }} className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20">
                    Extend
                  </button>
                  <button onClick={() => { setSelectedChama(c); setShowManualPay(true); }} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20">
                    Manual Pay
                  </button>
                  {c.subscriptionStatus !== 'SUSPENDED' ? (
                    <button onClick={() => { setSelectedChama(c); setShowSuspend(true); }} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20">
                      Suspend
                    </button>
                  ) : (
                    <button onClick={() => { setSelectedChama(c); handleReactivate(); }} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20">
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suspend Modal */}
      {showSuspend && (
        <div className="modal-overlay" onClick={() => setShowSuspend(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-4">Suspend Chama</h3>
            <p className="text-sm text-gray-400 mb-4">Suspend {selectedChama?.name}? All data will be preserved.</p>
            <textarea value={suspendReason} onChange={e => setSuspendReason(e.target.value)} className="input-field mb-4" placeholder="Reason for suspension..." rows={3} />
            <div className="flex gap-3">
              <button onClick={handleSuspend} className="btn-primary bg-red-600 hover:bg-red-700 flex-1 justify-center">Confirm Suspension</button>
              <button onClick={() => setShowSuspend(false)} className="btn-secondary flex-1 text-center">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Extend Modal */}
      {showExtend && (
        <div className="modal-overlay" onClick={() => setShowExtend(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-4">Extend Subscription</h3>
            <p className="text-sm text-gray-400 mb-4">Extend {selectedChama?.name}'s subscription</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {['7', '30', '60', '90'].map(d => (
                <button key={d} onClick={() => setExtendDays(d)} className={`p-3 rounded-xl border text-sm font-medium transition-all ${extendDays === d ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-white/10 text-gray-400 hover:border-white/20'}`}>
                  {d} days
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={handleExtend} className="btn-primary flex-1 justify-center">Extend</button>
              <button onClick={() => setShowExtend(false)} className="btn-secondary flex-1 text-center">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Payment Modal */}
      {showManualPay && (
        <div className="modal-overlay" onClick={() => setShowManualPay(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-4">Record Manual Payment</h3>
            <p className="text-sm text-gray-400 mb-4">Record payment for {selectedChama?.name}</p>
            <input type="number" value={manualAmount} onChange={e => setManualAmount(e.target.value)} className="input-field mb-3" placeholder="Amount (KES)" />
            <input type="text" value={manualRef} onChange={e => setManualRef(e.target.value)} className="input-field mb-4" placeholder="Reference (optional)" />
            <div className="flex gap-3">
              <button onClick={handleManualPay} className="btn-primary flex-1 justify-center">Record Payment</button>
              <button onClick={() => setShowManualPay(false)} className="btn-secondary flex-1 text-center">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ ADMIN PAYMENTS ============
function AdminPayments() {
  const state = store.getState();
  const payments = state.payments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const revenue = store.getRevenue();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payments</h1>
        <p className="text-gray-400 text-sm mt-1">All payment records • Revenue: {formatKES(revenue)}</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Chama</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Reference</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-gray-500 py-8">No payments recorded</td></tr>
              ) : payments.map(p => {
                const chama = state.chamas.find(c => c.id === p.chamaId);
                return (
                  <tr key={p.id}>
                    <td className="text-gray-400 text-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="text-white text-sm">{chama?.name || 'Unknown'}</td>
                    <td className="text-emerald-400 font-medium text-sm">{formatKES(p.amount)}</td>
                    <td className="text-gray-400 text-sm uppercase">{p.provider}</td>
                    <td className="text-gray-400 text-sm font-mono text-xs">{p.reference}</td>
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

// ============ ADMIN AUDIT ============
function AdminAudit() {
  const logs = store.getAuditLogs().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
        <p className="text-gray-400 text-sm mt-1">{logs.length} audit entries</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-500 py-8">No audit logs</td></tr>
              ) : logs.slice(0, 100).map(l => (
                <tr key={l.id}>
                  <td className="text-gray-400 text-xs">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="text-white text-sm">{l.actorName || l.actorId}</td>
                  <td><span className="badge badge-info text-[10px]">{l.action}</span></td>
                  <td className="text-gray-400 text-sm">{l.entityType}</td>
                  <td className="text-gray-500 text-xs max-w-[200px] truncate">{JSON.stringify(l.metadata).slice(0, 80)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ACTIVE: 'badge-success', TRIAL: 'badge-info', GRACE_PERIOD: 'badge-warning',
    SUSPENDED: 'badge-danger', CANCELLED: 'badge-danger', PAST_DUE: 'badge-warning',
    PENDING: 'badge-warning', SUCCESS: 'badge-success', FAILED: 'badge-danger',
    TIMEOUT: 'badge-warning',
  };
  return <span className={`badge ${colors[status] || 'badge-neutral'}`}>{status.replace('_', ' ')}</span>;
}
