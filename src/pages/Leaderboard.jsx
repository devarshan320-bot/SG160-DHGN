import { useMemo } from 'react'
import { mockLeaderboard } from '../mockData'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

const RANK_COLORS = ['#f59e0b', '#9ca3af', '#b45309']
const RANK_LABELS = ['🥇 Gold', '🥈 Silver', '🥉 Bronze']

function RankBadge({ rank }) {
  return (
    <div className={`rank-badge rank-${rank <= 3 ? rank : 'n'}`}>
      {rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : `#${rank}`}
    </div>
  )
}

export default function Leaderboard({ donations }) {
  // Merge mock leaderboard with any dynamic donations
  const leaderboard = useMemo(() => {
    const copy = [...mockLeaderboard]
    donations.filter(d => d.isLive && d.hotelName).forEach(d => {
      const idx = copy.findIndex(h => h.hotelName === d.hotelName)
      if (idx >= 0) {
        copy[idx] = { ...copy[idx], credits: copy[idx].credits + 10, meals: copy[idx].meals + d.quantity }
      } else {
        copy.push({ id: Date.now(), hotelName: d.hotelName, emoji: d.emoji, credits: 10, meals: d.quantity, badge: '', since: 'Today' })
      }
    })
    return copy.sort((a, b) => b.credits - a.credits)
  }, [donations])

  const max = leaderboard[0]?.credits || 1

  const radarData = leaderboard.slice(0, 5).map(h => ({
    hotel: h.hotelName.split(' ')[0],
    credits: h.credits,
    meals: Math.round(h.meals / 10),
  }))

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">🏆 Wall of Fame</h1>
        <p className="page-sub">Recognizing our top food rescue champions — updated in real-time</p>
      </div>

      {/* Top 3 podium */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 16, marginBottom: 32 }}>
        {/* Silver (2nd) */}
        <div style={{ marginTop: 40, background: 'rgba(156,163,175,0.08)', border: '1px solid rgba(156,163,175,0.25)', borderRadius: 16, padding: '24px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>{leaderboard[1]?.emoji}</div>
          <div style={{ fontSize: 28, marginBottom: 4 }}>🥈</div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>{leaderboard[1]?.hotelName}</div>
          <div style={{ color: '#9ca3af', fontWeight: 700, fontSize: 22, marginTop: 8 }}>{leaderboard[1]?.credits.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>credits</div>
        </div>
        {/* Gold (1st) */}
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 16, padding: '28px 20px', textAlign: 'center', boxShadow: '0 0 40px rgba(245,158,11,0.1)' }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>{leaderboard[0]?.emoji}</div>
          <div style={{ fontSize: 32, marginBottom: 4 }}>🏆</div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{leaderboard[0]?.hotelName}</div>
          <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: 28, marginTop: 8 }}>{leaderboard[0]?.credits.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>credits · Top Rescue Champion</div>
        </div>
        {/* Bronze (3rd) */}
        <div style={{ marginTop: 40, background: 'rgba(180,83,9,0.08)', border: '1px solid rgba(180,83,9,0.25)', borderRadius: 16, padding: '24px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>{leaderboard[2]?.emoji}</div>
          <div style={{ fontSize: 28, marginBottom: 4 }}>🥉</div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>{leaderboard[2]?.hotelName}</div>
          <div style={{ color: '#d97706', fontWeight: 700, fontSize: 22, marginTop: 8 }}>{leaderboard[2]?.credits.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>credits</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Full List */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 20 }}>📋 Full Rankings</div>
          {leaderboard.map((h, i) => (
            <div key={h.id} className={`leaderboard-row ${i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : ''}`}>
              <RankBadge rank={i + 1} />
              <div className="hotel-avatar" style={{ background: i < 3 ? ['rgba(245,158,11,0.12)','rgba(156,163,175,0.12)','rgba(180,83,9,0.12)'][i] : 'var(--surface2)' }}>
                {h.emoji}
              </div>
              <div className="credits-bar" style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{h.hotelName}</span>
                  <span style={{ fontWeight: 800, color: i < 3 ? RANK_COLORS[i] : 'var(--accent)', fontSize: 16 }}>{h.credits.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>{h.meals.toLocaleString()} meals · since {h.since}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>⭐ pts</span>
                </div>
                <div className="credits-bar-track" style={{ marginTop: 8 }}>
                  <div className="credits-bar-fill" style={{
                    width: `${(h.credits / max) * 100}%`,
                    background: i === 0 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : i === 1 ? 'linear-gradient(90deg,#9ca3af,#d1d5db)' : i === 2 ? 'linear-gradient(90deg,#b45309,#d97706)' : 'var(--accent)'
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Radar Chart */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 20 }}>📡 Top 5 Comparison</div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.07)" />
                <PolarAngleAxis dataKey="hotel" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }} />
                <Radar name="Credits" dataKey="credits" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
                <Radar name="Meals (×10)" dataKey="meals" stroke="#22d3a5" fill="#22d3a5" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* How credits work */}
          <div style={{ background: 'var(--surface2)', borderRadius: 12, padding: '16px 18px', marginTop: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>🎯 How Credits Work</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { action: 'Food donation listed', pts: '+10' },
                { action: 'Donation claimed by NGO', pts: '+25' },
                { action: 'Urgent rescue completed', pts: '+50' },
                { action: 'Monthly top donor', pts: '+200' },
              ].map(c => (
                <div key={c.action} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--muted)' }}>{c.action}</span>
                  <span style={{ color: 'var(--green)', fontWeight: 700 }}>{c.pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
