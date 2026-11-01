import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts'
import { io } from 'socket.io-client'
import { stats, mockWeekData } from '../mockData'
import { API_BASE, SOCKET_URL } from '../config'
import LiveFeedMap from '../components/LiveFeedMap'

function AnimatedNumber({ value, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const end = typeof value === 'number' ? value : parseInt(value)
    const duration = 1200
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setDisplay(end); clearInterval(timer) }
      else setDisplay(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [value])
  return <>{prefix}{display.toLocaleString()}{suffix}</>
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(7,11,18,0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(59,130,246,0.3)',
        borderRadius: 12, padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        <p style={{ color: 'var(--text2)', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || '#3b82f6', fontWeight: 700, fontSize: 14 }}>
            {p.name}: <span style={{ color: 'var(--text)' }}>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard({ donations }) {
  const [analytics, setAnalytics] = useState({
    totalMeals: 15420,
    totalDonations: 342,
    totalMoney: 125000,
    timelineData: mockWeekData,
    distributionData: [
      { category: 'Cooked Meals', meals: 8500, color: '#22d3a5' },
      { category: 'Raw Ingredients', meals: 3200, color: '#a78bfa' },
      { category: 'Bakery Items', meals: 2100, color: '#f97316' },
      { category: 'Fresh Produce', meals: 1620, color: '#ef4444' }
    ]
  });

  useEffect(() => {
    // Fetch initial analytics
    fetch(`${API_BASE}/api/dashboard/analytics`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.message) {
          setAnalytics(prev => ({ ...prev, ...data }));
        }
      })
      .catch(err => console.error('Failed to fetch analytics:', err));

    // Connect to socket for real-time updates
    const socket = io(SOCKET_URL);

    socket.on('dashboard_update', (update) => {
      if (update.type === 'analytics_update') {
        setAnalytics(prev => ({
          ...prev,
          ...update.data
        }));
      }
    });

    return () => socket.disconnect();
  }, []);

  const available = donations.filter(d => d.status === 'available').length
  const urgent = donations.filter(d => d.status === 'urgent').length
  const claimed = donations.filter(d => d.status === 'claimed').length
  const totalMeals = donations.reduce((s, d) => s + d.quantity, 0)

  return (
    <div className="page">
      {/* ── Hero Section ───────────────────────────────────────── */}
      <div className="hero" style={{ marginBottom: 40, position: 'relative', padding: '40px 0 20px' }}>
        <div style={{
          position: 'absolute', top: -100, right: -100, width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        }} className="animate-float" />
        <div style={{
          position: 'absolute', bottom: -60, left: -60, width: 360, height: 360,
          background: 'radial-gradient(circle, rgba(129,140,248,0.09) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0, animationDelay: '1.5s'
        }} className="animate-float" />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span className="live-badge">
                <span className="live-dot" style={{ margin: 0 }} /> LIVE NETWORK
              </span>
              <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700, letterSpacing: 1 }}>BENGALURU CITY</span>
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 16 }}>
              Fighting Hunger, <br />
              <span style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                One Meal at a Time.
              </span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text2)', maxWidth: 500, lineHeight: 1.6 }}>
              Smart Food Rescue redistributes high-quality surplus food from premium hotels to verified NGOs — instantly, safely, and transparently.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="/add-food" className="submit-btn" style={{ textDecoration: 'none' }}>
              Donate Surplus Food
            </a>
            <a href="/donate-money" className="submit-btn" style={{ background: 'rgba(59,130,246,0.12)', color: 'var(--text)', border: '1px solid rgba(59,130,246,0.25)', boxShadow: 'none', textDecoration: 'none' }}>
              Support Logistics
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon blue">🍽️</div>
          <div className="stat-value blue animate-count"><AnimatedNumber value={analytics.totalMeals} /></div>
          <div className="stat-label">Total Meals Rescued</div>
          <div className="stat-change">↑ 18% this week</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-icon cyan">📦</div>
          <div className="stat-value cyan"><AnimatedNumber value={analytics.totalDonations} /></div>
          <div className="stat-label">Total Donations</div>
          <div className="stat-change">↑ 12% this month</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon purple">💳</div>
          <div className="stat-value purple"><AnimatedNumber value={analytics.totalMoney} prefix="₹" /></div>
          <div className="stat-label">Funds Raised</div>
          <div className="stat-change">↑ 31% this month</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green">🏨</div>
          <div className="stat-value green"><AnimatedNumber value={stats.totalDonors} /></div>
          <div className="stat-label">Hotel Partners</div>
          <div className="stat-change">+12 new this month</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="section-header">
            <div className="section-title">📈 Rescue Momentum</div>
            <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>↑ 18% this week</span>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.timelineData || []}>
                <defs>
                  <linearGradient id="mealsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.06)" vertical={false} />
                <XAxis dataKey={analytics.timelineData[0]?.day ? 'day' : 'date'} axisLine={false} tickLine={false} tick={{ fill: '#3d5280', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#3d5280', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="meals" name="Meals" stroke="#3b82f6" strokeWidth={2.5} fill="url(#mealsGrad)" dot={false} activeDot={{ r: 6, fill: '#3b82f6', stroke: '#060c1a', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="section-header">
            <div className="section-title">📊 Meals Distribution</div>
          </div>
          <div style={{ height: 220, flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.distributionData || []} barSize={26}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.06)" vertical={false} />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#3d5280', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#3d5280', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="meals" name="Meals" radius={[6, 6, 0, 0]}>
                  {analytics.distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6','#818cf8','#06b6d4','#a78bfa'][index % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <LiveFeedMap />

      {/* ── Global Impact CTA ─────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(6,182,212,0.05))',
        border: '1px solid rgba(59,130,246,0.2)', borderRadius: 20, padding: '28px 32px',
        marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20
      }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Global Context</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>The Crisis We're Solving</div>
          <div style={{ color: 'var(--text2)', fontSize: 15, maxWidth: 500 }}>
            Discover the real data behind child stunting, global undernourishment, and why smart food rescue is critical.
          </div>
        </div>
        <a href="/crisis" className="submit-btn" style={{ background: 'rgba(59,130,246,0.12)', color: 'var(--text)', border: '1px solid rgba(59,130,246,0.25)', boxShadow: 'none', textDecoration: 'none' }}>
          Explore Hunger Insights →
        </a>
      </div>

    </div>
  )
}
