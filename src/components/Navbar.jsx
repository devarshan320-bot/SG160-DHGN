import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LINKS = [
  { to: '/',             label: 'Home'         },
  { to: '/add-food',     label: 'Donate Food'  },
  { to: '/donate-money', label: 'Donate Money' },
  { to: '/dashboard',    label: 'Dashboard'    },
  { to: '/leaderboard',  label: 'Leaderboard'  },
  { to: '/crisis',       label: 'Crisis Data'  },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="navbar-logo">🌿</div>
        <span>FeedLink<span style={{ color: 'var(--accent)', marginLeft: 2 }}>AI</span></span>
      </Link>

      <div className="navbar-links">
        {LINKS.map(({ to, label }) => (
          <Link key={to} to={to} className={`navbar-link ${pathname === to ? 'active' : ''}`}>
            {label}
          </Link>
        ))}
      </div>

      <div className="navbar-right">
        <div className="live-badge">
          <span className="live-dot" style={{ background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.6)' }} />
          LIVE
        </div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 14, color: '#fff',
              boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
            }}>
              {(user.name || user.email || 'U')[0].toUpperCase()}
            </div>
            {user.role === 'admin' && (
              <span style={{
                fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 99,
                background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
                color: '#f59e0b', letterSpacing: '0.5px',
              }}>ADMIN</span>
            )}
            <button
              onClick={() => { logout(); navigate('/login'); }}
              style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                color: '#f87171', borderRadius: 9, padding: '6px 14px',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.2)'}
              onMouseLeave={e => e.target.style.background = 'rgba(239,68,68,0.1)'}
            >Sign Out</button>
          </div>
        ) : (
          <Link to="/login" style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            color: '#fff', borderRadius: 10, padding: '7px 18px',
            fontSize: 13, fontWeight: 800, textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
          }}>Sign In</Link>
        )}
      </div>
    </nav>
  );
}