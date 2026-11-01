import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DEMO_USERS = [
  { label: '🏨 Hotel Manager', email: 'hotel@example.com', password: 'hotel123' },
  { label: '🏠 NGO Officer',   email: 'ngo@example.com',   password: 'ngo123'   },
  { label: '👤 Individual',    email: 'user@example.com',  password: 'user123'  },
  { label: '🔑 System Admin',  email: 'admin@foodrescue.com', password: 'admin123' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) navigate('/');
    else setError(result.message);
  };

  const fillDemo = (u) => { setEmail(u.email); setPassword(u.password); };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#060c1a',
      backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,130,246,0.15), transparent), radial-gradient(ellipse 40% 40% at 90% 90%, rgba(129,140,248,0.1), transparent)',
      padding: 24,
    }}>
      <div className="auth-card">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, margin: '0 auto 14px',
            boxShadow: '0 0 32px rgba(59,130,246,0.4)',
          }}>🌿</div>
          <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: -0.5, marginBottom: 4 }}>
            FeedLink<span style={{ color: '#3b82f6' }}>AI</span>
          </div>
          <div style={{ color: '#8ba3cc', fontSize: 13 }}>Sign in to your account</div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '10px 14px', color: '#f87171', fontSize: 13, marginBottom: 18 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="submit-btn" style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? '⏳ Signing in...' : '→ Sign In'}
          </button>
        </form>

        {/* Demo quick-fill */}
        <div style={{ marginTop: 24, borderTop: '1px solid rgba(59,130,246,0.1)', paddingTop: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3d5280', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>Demo Access</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DEMO_USERS.map(u => (
              <button key={u.email} onClick={() => fillDemo(u)} style={{
                background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)',
                borderRadius: 10, padding: '9px 14px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.06)'}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: '#e8efff' }}>{u.label}</span>
                <span style={{ fontSize: 11, color: '#3d5280' }}>Click to fill</span>
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#3d5280' }}>
          No account?{' '}
          <Link to="/signup" style={{ color: '#3b82f6', fontWeight: 700, textDecoration: 'none' }}>Create one →</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;