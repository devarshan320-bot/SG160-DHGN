import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadialBarChart, RadialBar,
  LineChart, Line, ReferenceLine,
} from 'recharts'
import { LiveHungerCounter, RegionalComparison, KarnatakaComparison } from './HungerExtras'

// ── Data ──────────────────────────────────────────────────────────
const worldData = [
  { name: 'Hungry / Undernourished', value: 9.1, color: '#ef4444' },
  { name: 'Adequately Nourished', value: 90.9, color: '#22d3a5' },
]

const indiaIndicators = [
  { indicator: 'Child Stunting', india: 32.9, global: 22.3 },
  { indicator: 'Child Wasting', india: 18.7, global: 6.8 },
  { indicator: 'Underweight', india: 32.1, global: 13.5 },
  { indicator: 'Undernourishment', india: 12.0, global: 9.1 },
  { indicator: 'Child Anaemia', india: 67.1, global: 39.8 },
]

const statesData = [
  { state: 'Meghalaya', stunting: 46.5, underweight: 26.6 },
  { state: 'Bihar', stunting: 42.9, underweight: 41.0 },
  { state: 'UP', stunting: 39.7, underweight: 32.1 },
  { state: 'Jharkhand', stunting: 39.6, underweight: 39.4 },
  { state: 'Gujarat', stunting: 39.0, underweight: 39.7 },
  { state: 'MP', stunting: 35.7, underweight: 33.0 },
  { state: 'Karnataka', stunting: 35.0, underweight: 33.0 },
  { state: 'India Avg', stunting: 32.9, underweight: 32.1 },
].reverse()

const radialData = [
  { name: 'Child Anaemia', value: 67.1, fill: '#ef4444' },
  { name: 'Stunting', value: 35.0, fill: '#f97316' },
  { name: 'Underweight', value: 33.0, fill: '#f59e0b' },
  { name: 'Wasting', value: 18.7, fill: '#a78bfa' },
]

const trendData = [
  { year: '2006', index: 38.8 },
  { year: '2010', index: 35.1 },
  { year: '2014', index: 29.0 },
  { year: '2018', index: 31.1 },
  { year: '2022', index: 29.1 },
  { year: '2024', index: 27.3 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
        {label && <p style={{ color: 'var(--muted)', marginBottom: 4, fontSize: 12 }}>{label}</p>}
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || p.fill || 'var(--accent)', fontWeight: 700 }}>
            {p.name}: <span style={{ color: 'var(--text)' }}>{p.value}%</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

const RADIAN = Math.PI / 180
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }) => {
  if (percent < 0.05) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={700}>
      {value}%
    </text>
  )
}

// ── Stat Pill ─────────────────────────────────────────────────────
function Pill({ label, value, color, sub }) {
  return (
    <div style={{
      background: `rgba(${color},0.08)`, border: `1px solid rgba(${color},0.2)`,
      borderRadius: 12, padding: '14px 18px',
    }}>
      <div style={{ fontSize: 26, fontWeight: 800, color: `rgb(${color})` }}>{value}</div>
      <div style={{ fontWeight: 600, fontSize: 13, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

export default function HungerCrisis() {
  return (
    <div className="page">

      {/* ── Header ── */}
      <div className="page-header" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 99, border: '1px solid rgba(239,68,68,0.3)', textTransform: 'uppercase', letterSpacing: 1 }}>
            ⚠ Crisis Data
          </span>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>Sources: NFHS-5, FAO, Global Hunger Index 2024</span>
        </div>
        <h1 className="page-title" style={{ fontSize: 34 }}>🌍 The Hunger Crisis We're Solving</h1>
        <p className="page-sub" style={{ fontSize: 16, maxWidth: 680 }}>
          Real data on global and Indian hunger — showing exactly <strong style={{ color: 'var(--accent)' }}>why Smart Food Rescue exists</strong> and the scale of impact we can create.
        </p>
      </div>

      {/* ── Live Hunger Counter ── */}
      <LiveHungerCounter />

      {/* ── Hero story ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(249,115,22,0.05))',
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: 20, padding: '28px 32px', marginBottom: 28,
        display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center',
      }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontSize: 13, color: 'var(--danger)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>The Problem</div>
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.4, marginBottom: 12 }}>
            While hotels discard tonnes of food daily, <span style={{ color: 'var(--danger)' }}>733 million people</span> go to bed hungry.
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.6 }}>
            India alone wastes <strong style={{ color: 'var(--text)' }}>67 million tonnes</strong> of food annually — enough to feed every hungry person in the country multiple times over. Smart Food Rescue bridges this gap in real-time.
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, minWidth: 340 }}>
          <Pill label="World Hungry" value="733M" color="239,68,68" sub="9.1% of global population" />
          <Pill label="India Undernourished" value="12%+" color="249,115,22" sub="~194 million people" />
          <Pill label="Indian Children Stunted" value="32.9%" color="245,158,11" sub="NFHS-5 national average" />
          <Pill label="Food Wasted in India" value="67MT" color="167,139,250" sub="Per year — enough to feed all" />
        </div>
      </div>

      {/* ── Row 1: World + India trend ── */}
      <div className="grid-2" style={{ marginBottom: 20 }}>

        {/* World Hunger Pie */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div className="section-title">🌍 Global Hunger Split</div>
              <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>World population share · FAO 2024</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--danger)' }}>9.1%</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>of 8 billion people</div>
            </div>
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={worldData}
                  cx="50%" cy="50%"
                  outerRadius={95}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {worldData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={10} formatter={(v) => <span style={{ color: 'var(--muted)', fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, padding: '10px 14px', marginTop: 12, fontSize: 13, color: 'var(--muted)' }}>
            🔴 Every <strong style={{ color: 'var(--text)' }}>1 in 11 people</strong> worldwide is undernourished — that's the scale we're tackling.
          </div>
        </div>

        {/* India GHI trend */}
        <div className="card">
          <div style={{ marginBottom: 20 }}>
            <div className="section-title">📉 India Global Hunger Index Trend</div>
            <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>Lower score = less hunger · GHI 2006–2024</div>
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <defs>
                  <linearGradient id="ghiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3a5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22d3a5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis domain={[24, 42]} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={30} stroke="rgba(239,68,68,0.3)" strokeDasharray="4 4" label={{ value: 'Serious', fill: '#ef4444', fontSize: 11 }} />
                <Line type="monotone" dataKey="index" name="GHI Score" stroke="#22d3a5" strokeWidth={2.5} dot={{ fill: '#22d3a5', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <div style={{ flex: 1, background: 'rgba(34,211,165,0.08)', border: '1px solid rgba(34,211,165,0.15)', borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
              <div style={{ fontWeight: 800, color: 'var(--accent)', fontSize: 20 }}>38.8</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Score in 2006</div>
            </div>
            <div style={{ flex: 1, background: 'rgba(34,211,165,0.08)', border: '1px solid rgba(34,211,165,0.15)', borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
              <div style={{ fontWeight: 800, color: 'var(--green)', fontSize: 20 }}>27.3</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Score in 2024</div>
            </div>
            <div style={{ flex: 1, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
              <div style={{ fontWeight: 800, color: 'var(--danger)', fontSize: 20 }}>#105</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>of 127 nations</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: India indicators + radial ── */}
      <div className="grid-2" style={{ marginBottom: 20 }}>

        {/* India vs Global Bar */}
        <div className="card">
          <div style={{ marginBottom: 20 }}>
            <div className="section-title">🇮🇳 India vs Global Malnutrition Indicators</div>
            <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>India is 2–3× worse than global average · NFHS-5</div>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={indiaIndicators} layout="vertical" barSize={11}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" domain={[0, 75]} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="indicator" axisLine={false} tickLine={false} tick={{ fill: '#d1d5db', fontSize: 12 }} width={110} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="global" name="Global Avg" fill="#1a2235" radius={[0, 4, 4, 0]} />
                <Bar dataKey="india" name="India" fill="#ef4444" radius={[0, 4, 4, 0]} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: 'var(--muted)', fontSize: 12 }}>{v}</span>} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Karnataka Radial */}
        <div className="card">
          <div style={{ marginBottom: 20 }}>
            <div className="section-title">🏙️ Karnataka / Bangalore Hunger Indicators</div>
            <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>Why Bangalore is a priority rescue zone · NFHS-5</div>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius={28} outerRadius={95} data={radialData} startAngle={90} endAngle={-270}>
                <RadialBar minAngle={8} background={{ fill: 'rgba(255,255,255,0.03)' }} dataKey="value" cornerRadius={4} label={{ position: 'insideStart', fill: '#fff', fontSize: 10, fontWeight: 700 }} />
                <Tooltip content={<CustomTooltip />} formatter={(v) => [`${v}%`]} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: 'var(--muted)', fontSize: 11 }}>{v}</span>} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 10, padding: '12px 14px', marginTop: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, color: 'var(--accent2)' }}>📍 Why Bangalore?</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              Bangalore generates <strong style={{ color: 'var(--text)' }}>948 tonnes of food waste daily</strong> while Karnataka has <strong style={{ color: 'var(--text)' }}>35% child stunting</strong>. Our platform directly connects this surplus to hungry families within the city.
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: States horizontal bar (full width) ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <div className="section-title">📊 Worst-Hit Indian States — Child Malnutrition Rankings</div>
            <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>NFHS-5 data · % of children under 5 · Stunting vs Underweight</div>
          </div>
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '8px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--danger)' }}>8 States</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>above 35% stunting</div>
          </div>
        </div>
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statesData} layout="vertical" barSize={12} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" domain={[0, 55]} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="state" axisLine={false} tickLine={false} tick={{ fill: '#d1d5db', fontSize: 13, fontWeight: 600 }} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={32.9} stroke="rgba(249,115,22,0.5)" strokeDasharray="5 5" label={{ value: 'India Avg', fill: '#f97316', fontSize: 10, position: 'top' }} />
              <Bar dataKey="stunting" name="Stunting %" fill="#ef4444" radius={[0, 5, 5, 0]} />
              <Bar dataKey="underweight" name="Underweight %" fill="#a78bfa" radius={[0, 5, 5, 0]} />
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: 'var(--muted)', fontSize: 12 }}>{v}</span>} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Row 3b: Regional Comparison + Karnataka vs India ── */}
      <RegionalComparison />
      <KarnatakaComparison />

      {/* ── Row 4: Solution call-to-action ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(34,211,165,0.08), rgba(14,165,233,0.05))',
        border: '1px solid rgba(34,211,165,0.2)',
        borderRadius: 20, padding: '28px 32px',
        display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'center',
      }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Our Answer</div>
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.4, marginBottom: 14 }}>
            Smart Food Rescue — bridging the gap between <span style={{ color: 'var(--accent)' }}>surplus</span> and <span style={{ color: 'var(--danger)' }}>starvation</span>
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7 }}>
            By redistributing hotel surplus food to high-need zones in real-time, we directly attack child stunting, wasting, and undernourishment in urban and peri-urban areas like Bangalore — where the data shows the gap is greatest.
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, minWidth: 300 }}>
          {[
            { icon: '⚡', stat: '< 30 min', label: 'Avg food pickup time' },
            { icon: '🍱', stat: '0 ₹', label: 'Cost to NGO / beneficiary' },
            { icon: '🏆', stat: '24 NGOs', label: 'Currently active network' },
            { icon: '🌱', stat: '67MT', label: 'Annual waste we can reclaim' },
          ].map(s => (
            <div key={s.stat} style={{ background: 'rgba(34,211,165,0.07)', border: '1px solid rgba(34,211,165,0.15)', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>{s.stat}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
