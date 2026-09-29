import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { store } from '../lib/store';
import { Wallet, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface AuthProps {
  onAuth: () => void;
}

export default function Auth({ onAuth }: AuthProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));

    if (mode === 'login') {
      const result = store.login(email, password);
      if (result.success && result.user) {
        onAuth();
        if (result.user.role === 'SUPER_ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.error || 'Login failed');
      }
    } else {
      const result = store.register(email, phone, password, fullName);
      if (result.success) {
        // Auto-login after registration
        const loginResult = store.login(email, password);
        if (loginResult.success) {
          onAuth();
          navigate('/dashboard');
        }
      } else {
        setError(result.error || 'Registration failed');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center p-4 relative">
      {/* Particles */}
      <div className="particles-bg">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s` }} />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} />
          <span className="text-sm">Back to home</span>
        </Link>

        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <Wallet size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{mode === 'login' ? 'Welcome Back' : 'Join ChamaPay'}</h1>
              <p className="text-sm text-gray-400">{mode === 'login' ? 'Sign in to your account' : 'Create your account'}</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="input-field" placeholder="John Kamau" required />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" required />
            </div>
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="input-field" placeholder="254700000000" required />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="input-field pr-10" placeholder="••••••••" required minLength={8} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-50">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} className="text-emerald-400 hover:text-emerald-300 font-medium">
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-xs text-gray-500 mb-3 text-center">Demo Credentials (Development)</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-white/3">
                <span className="text-gray-400">Super Admin:</span>
                <button onClick={() => { setEmail('owner@example.test'); setPassword('Admin@2024!'); }} className="text-emerald-400 hover:text-emerald-300 font-mono">owner@example.test</button>
              </div>
              <div className="flex justify-between p-2 rounded bg-white/3">
                <span className="text-gray-400">Chama Admin:</span>
                <button onClick={() => { setEmail('admin.umoja@example.test'); setPassword('Admin@2024!'); }} className="text-emerald-400 hover:text-emerald-300 font-mono">admin.umoja@example.test</button>
              </div>
              <div className="flex justify-between p-2 rounded bg-white/3">
                <span className="text-gray-400">Member:</span>
                <button onClick={() => { setEmail('member01.umoja@example.test'); setPassword('Admin@2024!'); }} className="text-emerald-400 hover:text-emerald-300 font-mono">member01.umoja@example.test</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
