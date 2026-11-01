import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Dot,
} from 'recharts'

const DATA = [
  { amount: 100,   meals: 5,   people: 5,   label: '₹100'    },
  { amount: 250,   meals: 12,  people: 12,  label: '₹250'    },
  { amount: 500,   meals: 25,  people: 25,  label: '₹500'    },
  { amount: 750,   meals: 37,  people: 37,  label: '₹750'    },
  { amount: 1000,  meals: 50,  people: 50,  label: '₹1,000'  },
  { amount: 2000,  meals: 100, people: 100, label: '₹2,000'  },
  { amount: 3000,  meals: 150, people: 150, label: '₹3,000'  },
  { amount: 5000,  meals: 250, people: 250, label: '₹5,000'  },
  { amount: 7500,  meals: 375, people: 375, label: '₹7,500'  },
  { amount: 10000, meals: 500, people: 500, label: '₹10,000' },
]

const IMPACT_MODES = [
  { key: 'meals',  label: '🍱 Meals Funded',  color: '#3b82f6', glow: 'rgba(59,130,246,0.3)'  },
  { key: 'people', label: '👥 People Served', color: '#818cf8', glow: 'rgba(129,140,248,0.3)' },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div style={{
      background: 'rgba(6,12,26,0.96)', backdropFilter: 'blur(20px)',
      border: '1px solid rgba(59,130,246,0.3)', borderRadius: 12,
      padding: '12px 16px', boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
      minWidth: 160,
    }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#e8efff', marginBottom: 8 }}>
        {d?.label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span style={{ fontSize: 12, color: '#8ba3cc' }}>🍱 Meals Funded</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#3b82f6' }}>{d?.meals}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span style={{ fontSize: 12, color: '#8ba3cc' }}>👥 People Served</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#818cf8' }}>{d?.people}</span>
        </div>
        <div style={{
          marginTop: 6, paddingTop: 8, borderTop: '1px solid rgba(59,130,246,0.15)',
          fontSize: 11, color: '#3b82f6', fontWeight: 700,
        }}>₹20 = 1 meal</div>
      </div>
    </div>
  )
}

// Clean active dot for the chart
const ActiveDot = (props) => {
  const { cx, cy, stroke, payload, activeAmount } = props;
  if (payload?.amount !== activeAmount) return null;
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={6} 
      fill={stroke} 
      stroke="#060c1a" 
      strokeWidth={2} 
      style={{ filter: 'drop-shadow(0 0 5px rgba(59,130,246,0.5))' }}
    />
  );
};

export default function ImpactGraph({ donationAmount = 500 }) {
  const [mode, setMode] = useState('meals')
  const activeMode = IMPACT_MODES.find(m => m.key === mode)

  // Find closest data point to donation
  const closest = DATA.reduce((prev, curr) =>
    Math.abs(curr.amount - donationAmount) < Math.abs(prev.amount - donationAmount) ? curr : prev
  )

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>📈 Impact per Rupee</div>
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>
            See how every rupee translates into real-world change
          </div>
        </div>

        {/* Mode Toggle */}
        <div style={{
          display: 'flex', gap: 3, background: 'rgba(59,130,246,0.07)',
          padding: 4, borderRadius: 10, border: '1px solid rgba(59,130,246,0.12)',
        }}>
          {IMPACT_MODES.map(m => (
            <button key={m.key} onClick={() => setMode(m.key)} style={{
              padding: '6px 13px', borderRadius: 8, border: 'none',
              background: mode === m.key ? 'rgba(59,130,246,0.18)' : 'transparent',
              color: mode === m.key ? '#e8efff' : '#3d5280',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}>{m.label}</button>
          ))}
        </div>
      </div>

      {/* Key Insight Badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
        borderRadius: 10, padding: '7px 14px', marginBottom: 18,
      }}>
        <span style={{ fontSize: 18 }}>💡</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#60a5fa' }}>₹20 = 1 meal</span>
        <span style={{ fontSize: 12, color: '#8ba3cc' }}>· ₹{donationAmount.toLocaleString()} funds</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#22c55e' }}>{closest[mode]} {mode}</span>
      </div>

      {/* Chart */}
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="impactGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={activeMode.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={activeMode.color} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.06)" vertical={false} />

            <XAxis
              dataKey="label"
              axisLine={false} tickLine={false}
              tick={{ fill: '#3d5280', fontSize: 11 }}
            />
            <YAxis
              axisLine={false} tickLine={false}
              tick={{ fill: '#3d5280', fontSize: 11 }}
              width={36}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Reference line at current donation */}
            <ReferenceLine
              x={closest.label}
              stroke={activeMode.color}
              strokeDasharray="5 4"
              strokeWidth={1.5}
              label={{
                value: `Your ₹${donationAmount.toLocaleString()}`,
                fill: activeMode.color,
                fontSize: 11,
                fontWeight: 700,
                position: 'insideTopLeft',
              }}
            />

            <Area
              type="monotone"
              dataKey={mode}
              stroke={activeMode.color}
              strokeWidth={3}
              fill="url(#impactGrad)"
              dot={false}
              activeDot={<ActiveDot activeAmount={closest.amount} />}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Scale Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginTop: 18 }}>
        {[
          { amt: 100,  meals: 5,   emoji: '🍱' },
          { amt: 500,  meals: 25,  emoji: '🍛' },
          { amt: 1000, meals: 50,  emoji: '🍽️' },
          { amt: 5000, meals: 250, emoji: '🏠' },
          { amt: 10000, meals: 500, emoji: '🌍' },
        ].map(s => (
          <div key={s.amt} style={{
            background: donationAmount === s.amt
              ? 'rgba(59,130,246,0.15)'
              : 'rgba(59,130,246,0.04)',
            border: `1px solid ${donationAmount === s.amt ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.1)'}`,
            borderRadius: 10, padding: '10px 8px', textAlign: 'center',
            transition: 'all 0.3s',
            boxShadow: donationAmount === s.amt ? '0 0 16px rgba(59,130,246,0.2)' : 'none',
          }}>
            <div style={{ fontSize: 16, marginBottom: 4 }}>{s.emoji}</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#e8efff' }}>₹{s.amt.toLocaleString()}</div>
            <div style={{ fontSize: 10, color: '#8ba3cc', marginTop: 2 }}>{s.meals} meals</div>
          </div>
        ))}
      </div>
    </div>
  )
}
