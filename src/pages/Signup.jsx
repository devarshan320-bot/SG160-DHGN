import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register(name, email, password, role);
    setLoading(false);
    if (result.success) navigate('/');
    else setError(result.message);
  };

  const ROLES = [
    { value: 'user',  label: '🏠 Individual / NGO',      desc: 'Claim and receive food donations' },
    { value: 'hotel', label: '🏨 Hotel / Restaurant',     desc: 'List surplus food for rescue'     },
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#060c1a',
      backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,130,246,0.15), transparent), radial-gradient(ellipse 40% 40% at 10% 90%, rgba(129,140,248,0.1), transparent)',
      padding: 24,
    }}>
      <div className="auth-card" style={{ maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 15,
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, margin: '0 auto 12px',
            boxShadow: '0 0 28px rgba(59,130,246,0.4)',
          }}>🌿</div>
          <div style={{ fontWeight: 900, fontSize: 21, letterSpacing: -0.5, marginBottom: 4 }}>
            Join FeedLink<span style={{ color: '#3b82f6' }}>AI</span>
          </div>
          <div style={{ color: '#8ba3cc', fontSize: 13 }}>Create your rescue network account</div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '10px 14px', color: '#f87171', fontSize: 13, marginBottom: 18 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} />
          </div>

          {/* Role Picker */}
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {ROLES.map(r => (
                <div key={r.value} onClick={() => setRole(r.value)} style={{
                  flex: 1, padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
                  border: `1px solid ${role === r.value ? 'rgba(59,130,246,0.5)' : 'rgba(59,130,246,0.12)'}`,
                  background: role === r.value ? 'rgba(59,130,246,0.14)' : 'rgba(59,130,246,0.04)',
                  transition: 'all 0.2s',
                  boxShadow: role === r.value ? '0 0 16px rgba(59,130,246,0.15)' : 'none',
                }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: role === r.value ? '#e8efff' : '#8ba3cc', marginBottom: 3 }}>{r.label}</div>
                  <div style={{ fontSize: 11, color: '#3d5280' }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn" style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1, marginTop: 4 }} disabled={loading}>
            {loading ? '⏳ Creating account...' : '✓ Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#3d5280' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#3b82f6', fontWeight: 700, textDecoration: 'none' }}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;