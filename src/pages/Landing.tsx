import { Link } from 'react-router-dom';
import { Shield, Users, Wallet, MessageSquare, Calendar, TrendingUp, ChevronRight, Star, CheckCircle, ArrowRight } from 'lucide-react';

function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    size: `${2 + Math.random() * 4}px`,
    opacity: 0.1 + Math.random() * 0.3,
  }));
  return (
    <div className="particles-bg">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{ left: p.left, top: p.top, animationDelay: p.delay, width: p.size, height: p.size, opacity: p.opacity }} />
      ))}
    </div>
  );
}

function FloatingCoins() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-[15%] left-[10%] animate-float" style={{ animationDelay: '0s' }}>
        <div className="coin-3d" style={{ width: 48, height: 48, fontSize: '0.9rem' }}>KSh</div>
      </div>
      <div className="absolute top-[25%] right-[15%] animate-float" style={{ animationDelay: '2s' }}>
        <div className="coin-3d" style={{ width: 56, height: 56, fontSize: '1rem' }}>KSh</div>
      </div>
      <div className="absolute bottom-[30%] left-[20%] animate-float" style={{ animationDelay: '4s' }}>
        <div className="coin-3d" style={{ width: 40, height: 40, fontSize: '0.8rem' }}>KSh</div>
      </div>
      <div className="absolute top-[60%] right-[10%] animate-float-slow" style={{ animationDelay: '1s' }}>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 border border-emerald-500/20 flex items-center justify-center backdrop-blur-sm">
          <TrendingUp size={20} className="text-emerald-400" />
        </div>
      </div>
      <div className="absolute top-[40%] left-[5%] animate-float-slow" style={{ animationDelay: '3s' }}>
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/20 flex items-center justify-center backdrop-blur-sm">
          <Star size={16} className="text-amber-400" />
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0f1a]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                <Wallet size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">ChamaPay</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">Pricing</a>
              <a href="#faq" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">FAQ</a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/auth" className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-2">Sign In</Link>
              <Link to="/auth?mode=register" className="btn-primary text-sm !py-2 !px-4">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-bg relative min-h-screen flex items-center pt-16">
        <Particles />
        <FloatingCoins />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Built for Kenyan Chamas
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-white">Manage Your Chama.</span>
              <br />
              <span className="gradient-text">Save Together. Grow Together.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl leading-relaxed">
              The modern platform for Kenyan savings groups. Manage members, track contributions, 
              process loans, handle fines, schedule meetings, and accept M-Pesa payments — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth?mode=register" className="btn-primary text-base justify-center">
                Start Your Chama <ArrowRight size={18} />
              </Link>
              <a href="#features" className="btn-secondary text-base text-center justify-center">
                Explore ChamaPay
              </a>
            </div>
            <div className="mt-12 flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> Free 7-day trial</div>
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> M-Pesa integrated</div>
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> No per-member fees</div>
            </div>
          </div>

          {/* 3D Preview Card */}
          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2">
            <div className="card-3d">
              <div className="card-3d-inner glass-card p-6 w-80">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Total Savings</p>
                    <p className="text-2xl font-bold text-white mt-1">KES 245,000</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center">
                    <TrendingUp size={24} className="text-emerald-400" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Members</span>
                    <span className="text-white font-medium">15/15</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '100%' }} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Monthly Contributions</span>
                    <span className="text-emerald-400 font-medium">KES 15,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Active Loans</span>
                    <span className="text-amber-400 font-medium">KES 10,000</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 border-2 border-[#0a0f1a] flex items-center justify-center text-[10px] text-white font-medium">
                          {['J','M','P','A'][i-1]}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">+11 members active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How ChamaPay Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Get your Chama up and running in minutes</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Your Chama', desc: 'Register your savings group and invite members. Choose a plan that fits your group size.' },
              { step: '02', title: 'Manage Finances', desc: 'Track contributions, process loans, manage fines, and maintain a complete financial ledger.' },
              { step: '03', title: 'Grow Together', desc: 'Use M-Pesa payments, get reports, hold meetings, and watch your Chama thrive.' },
            ].map(item => (
              <div key={item.step} className="glass-card p-8 text-center">
                <div className="text-4xl font-bold gradient-text mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything Your Chama Needs</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">A complete platform designed for Kenyan savings groups</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: 'Member Management', desc: 'Invite, manage, and track all your Chama members with role-based access.' },
              { icon: Wallet, title: 'Contributions & Ledger', desc: 'Record contributions, maintain a double-entry ledger, and track every shilling.' },
              { icon: TrendingUp, title: 'Loan Management', desc: 'Process loan applications, approvals, disbursements, and repayments.' },
              { icon: Shield, title: 'Fines & Penalties', desc: 'Create, assign, and track fines with flexible payment options.' },
              { icon: Calendar, title: 'Meetings & Attendance', desc: 'Schedule meetings, set agendas, and record attendance digitally.' },
              { icon: MessageSquare, title: 'Messaging & Alerts', desc: 'Send announcements, chat with members, and get real-time notifications.' },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-6 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 border border-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon size={22} className="text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              <span className="text-emerald-400 font-semibold">Per Chama, not per member.</span> One price for your entire group.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'STARTER', price: '500', members: '15', features: ['Up to 15 members', 'Contributions tracking', 'Loan management', 'Meeting scheduling', 'Basic reports'], featured: false },
              { name: 'GROWTH', price: '1,500', members: '70', features: ['Up to 70 members', 'All Starter features', 'Advanced reports', 'SMS notifications', 'CSV export', 'Priority support'], featured: true },
              { name: 'BUSINESS', price: '2,000', members: '100', features: ['Up to 100 members', 'All Growth features', 'Custom branding', 'API access', 'Dedicated support', 'White-label option'], featured: false },
            ].map((plan, i) => (
              <div key={i} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
                {plan.featured && (
                  <div className="absolute top-4 right-4">
                    <span className="badge badge-success">Popular</span>
                  </div>
                )}
                <h3 className="text-sm font-bold text-emerald-400 tracking-wider mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-sm text-gray-400">KES</span>
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">per Chama / month</p>
                <p className="text-sm text-emerald-400 mb-6 font-medium">Up to {plan.members} members</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/auth?mode=register" className={`w-full py-3 rounded-xl font-semibold text-center block transition-all ${plan.featured ? 'btn-primary justify-center' : 'btn-secondary justify-center'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 sm:p-12 text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 border border-emerald-500/10 flex items-center justify-center mx-auto mb-6">
              <Shield size={32} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Bank-Grade Security</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your Chama's financial data is protected with enterprise-grade security. 
              Encrypted transactions, role-based access control, multi-tenant isolation, 
              and complete audit trails ensure your money and data are always safe.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {['Encrypted Data', 'Role-Based Access', 'Audit Trails', 'M-Pesa Verified', 'Tenant Isolation'].map(item => (
                <span key={item} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Is pricing per member or per Chama?', a: 'Pricing is per Chama per month, regardless of how many members you have (up to your plan limit).' },
              { q: 'How does M-Pesa payment work?', a: 'Enter your M-Pesa phone number, receive an STK push, confirm with your PIN. Payment is verified server-side before activation.' },
              { q: 'What happens if I miss a payment?', a: 'You get a 3-day grace period. After that, your Chama is suspended but all data is preserved. Pay to reactivate instantly.' },
              { q: 'Can I upgrade or downgrade my plan?', a: 'Yes. Upgrades take effect immediately. Downgrades are blocked if you have more members than the lower plan allows.' },
              { q: 'Is my financial data secure?', a: 'Absolutely. We use encryption, role-based access, tenant isolation, and maintain complete audit logs for all financial transactions.' },
            ].map((faq, i) => (
              <div key={i} className="glass-card p-6">
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Transform Your Chama?</h2>
          <p className="text-gray-400 mb-8 text-lg">Join hundreds of Kenyan savings groups already using ChamaPay.</p>
          <Link to="/auth?mode=register" className="btn-primary text-lg justify-center inline-flex">
            Start Your Free Trial <ChevronRight size={20} />
          </Link>
          <p className="text-sm text-gray-500 mt-4">7-day free trial • No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                <Wallet size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white">ChamaPay</span>
            </div>
            <p className="text-sm text-gray-500">© 2024 ChamaPay. Built for Kenyan Chamas. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
