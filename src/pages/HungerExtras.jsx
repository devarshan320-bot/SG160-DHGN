import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts'

// Your exact JSON data
const comparisonData = [
  { region: 'World Hungry', value: 9.1, color: '#ef4444' },
  { region: 'India Stunting', value: 32.9, color: '#f97316' },
  { region: 'India Wasting', value: 18.7, color: '#f59e0b' },
  { region: 'Karnataka Stunting', value: 35, color: '#a78bfa' },
  { region: 'Bihar Stunting', value: 42.9, color: '#ec4899' },
  { region: 'Meghalaya Stunting', value: 46.5, color: '#ef4444' },
]

const karnatakaVsIndia = [
  { indicator: 'Child Stunting', karnataka: 35.0, india: 32.9 },
  { indicator: 'Underweight', karnataka: 33.0, india: 32.1 },
  { indicator: 'Child Anaemia', karnataka: 66.0, india: 67.1 },
  { indicator: 'Wasting', karnataka: 19.5, india: 18.7 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
        {label && <p style={{ color: 'var(--muted)', marginBottom: 4, fontSize: 12 }}>{label}</p>}
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || p.fill, fontWeight: 700 }}>{p.name}: {p.value}%</p>
        ))}
      </div>
    )
  }
  return null
}

// Live hunger counter - someone goes hungry every 3.6 seconds globally
export function LiveHungerCounter() {
  const [count, setCount] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000
      setSeconds(Math.floor(elapsed))
      // ~24,000 people die from hunger daily = ~1000/hr = ~0.28/sec
      setCount(Math.floor(elapsed * 0.28))
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(249,115,22,0.06))',
      border: '1px solid rgba(239,68,68,0.25)', borderRadius: 16,
      padding: '20px 24px', marginBottom: 20,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
    }}>
      <div>
        <div style={{ fontSize: 12, color: 'var(--danger)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
          <span className="live-dot" /> Since You Opened This Page
        </div>
        <div style={{ fontSize: 14, color: 'var(--muted)' }}>
          Approximately <strong style={{ color: 'var(--text)' }}>{count}</strong> people have lost their lives to hunger-related causes
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--danger)', fontVariantNumeric: 'tabular-nums' }}>{count}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>lives lost</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent2)', fontVariantNumeric: 'tabular-nums' }}>{seconds}s</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>elapsed</div>
        </div>
      </div>
    </div>
  )
}

// Regional comparison bar chart using your exact JSON
export function RegionalComparison() {
  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <div className="section-title">📊 Regional Hunger Comparison</div>
        <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>Key indicators across world, India, and worst states</div>
      </div>
      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{ fill: '#d1d5db', fontSize: 11 }} />
            <YAxis domain={[0, 55]} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={v => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" name="%" radius={[6, 6, 0, 0]}>
              {comparisonData.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Karnataka vs India grouped bar
export function KarnatakaComparison() {
  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <div className="section-title">🏙️ Karnataka vs India Average</div>
        <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>Bangalore is an urban hotspot requiring redistribution</div>
      </div>
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={karnatakaVsIndia} barSize={14} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="indicator" axisLine={false} tickLine={false} tick={{ fill: '#d1d5db', fontSize: 11 }} />
            <YAxis domain={[0, 75]} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={v => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="india" name="India Avg" fill="#1a2235" radius={[4, 4, 0, 0]} />
            <Bar dataKey="karnataka" name="Karnataka" fill="#a78bfa" radius={[4, 4, 0, 0]} />
            <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ color: 'var(--muted)', fontSize: 12 }}>{v}</span>} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 10, padding: '10px 14px', marginTop: 12, fontSize: 13, color: 'var(--muted)' }}>
        📍 Karnataka consistently matches or exceeds India's averages — Bangalore's food surplus can directly address this gap.
      </div>
    </div>
  )
}
