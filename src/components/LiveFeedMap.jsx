import { useState, useEffect, useRef } from 'react'

const EVENTS = [
  { icon: '📡', msg: 'Rescue network online — monitoring 12 zones', badge: 'SYSTEM',   color: '#3b82f6', time: 0 },
  { icon: '🍛', msg: '120 meals rescued from Grand Hyatt Bangalore', badge: 'RESCUED',  color: '#06b6d4', time: 3500 },
  { icon: '🚚', msg: 'Delivery dispatched → Helping Hands NGO',       badge: 'DISPATCH', color: '#818cf8', time: 7000 },
  { icon: '🏥', msg: 'Zero Hunger Trust received 85 kg produce',       badge: 'RECEIVED', color: '#22c55e', time: 10500 },
  { icon: '⚡', msg: 'URGENT: Taj Palace — bread expires in 1 hr',     badge: 'URGENT',   color: '#ef4444', time: 14000 },
  { icon: '💰', msg: 'Rahul Mehta donated ₹5,000 for logistics',       badge: 'DONATED',  color: '#f59e0b', time: 17500 },
  { icon: '✅', msg: '300 meals delivered to Annadaan Society',         badge: 'IMPACT',   color: '#22c55e', time: 21000 },
]

const MAP_PINS = [
  { top: '28%', left: '22%', type: 'available', label: 'Grand Hyatt — 120 meals'     },
  { top: '42%', left: '58%', type: 'available', label: 'Marriott — 85 kg veggies'    },
  { top: '18%', left: '44%', type: 'urgent',    label: 'Taj Palace — URGENT 1hr left'},
  { top: '62%', left: '28%', type: 'available', label: 'Radisson — 300 meals'        },
  { top: '52%', left: '72%', type: 'urgent',    label: 'Le Méridien — salads 1hr'    },
  { top: '38%', left: '16%', type: 'ngo',       label: 'Helping Hands NGO'           },
  { top: '68%', left: '52%', type: 'ngo',       label: 'Zero Hunger Trust'           },
  { top: '22%', left: '68%', type: 'ngo',       label: 'Annadaan Society'            },
]

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 10) return 'just now'
  if (s < 60) return `${s}s ago`
  return `${Math.floor(s / 60)}m ago`
}

export default function LiveFeedMap() {
  const [feed, setFeed] = useState([])
  const [tooltip, setTooltip] = useState(null)
  const [pulse, setPulse] = useState(null)

  useEffect(() => {
    const initial = [{ icon: '📡', msg: 'Network online — scanning city zones', badge: 'SYSTEM', color: '#3b82f6', ts: Date.now() }]
    setFeed(initial)
    const timers = EVENTS.map(({ icon, msg, badge, color, time }) =>
      setTimeout(() => setFeed(p => [{ icon, msg, badge, color, ts: Date.now() }, ...p.slice(0, 7)]), time)
    )
    const cycle = setInterval(() => {
      const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)]
      setFeed(p => [{ ...ev, ts: Date.now() }, ...p.slice(0, 7)])
      const pin = Math.floor(Math.random() * MAP_PINS.length)
      setPulse(pin)
      setTimeout(() => setPulse(null), 700)
    }, 5500)
    return () => { timers.forEach(clearTimeout); clearInterval(cycle) }
  }, [])

  return (
    <div className="grid-2" style={{ gap: 18, marginBottom: 24 }}>

      {/* ── Live Feed ─────────────────── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '16px 20px 13px',
          borderBottom: '1px solid rgba(59,130,246,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(59,130,246,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px rgba(34,197,94,0.6)' }} />
            <span style={{ fontWeight: 700, fontSize: 15 }}>Live Rescue Feed</span>
          </div>
          <span style={{
            fontSize: 10, fontWeight: 800, letterSpacing: '0.8px',
            padding: '3px 8px', borderRadius: 99,
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
            color: '#22c55e',
          }}>LIVE</span>
        </div>

        <div style={{ maxHeight: 316, overflowY: 'auto', padding: '8px 0' }}>
          {feed.map((item, i) => (
            <div key={item.ts + i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '10px 18px',
              borderBottom: '1px solid rgba(59,130,246,0.06)',
              animation: 'slideUp 0.4s cubic-bezier(.16,1,.3,1) both',
              animationDelay: `${i * 0.04}s`,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: `${item.color}15`, border: `1px solid ${item.color}28`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>{item.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 800, letterSpacing: '0.8px',
                    padding: '2px 7px', borderRadius: 99,
                    background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}28`,
                  }}>{item.badge}</span>
                  <span style={{ fontSize: 10, color: 'var(--muted)' }}>{timeAgo(item.ts)}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.4, margin: 0 }}>{item.msg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Map ───────────────────────── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '16px 20px 13px',
          borderBottom: '1px solid rgba(59,130,246,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(59,130,246,0.04)',
        }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>📍 Rescue Map — Bangalore</span>
          <div style={{ display: 'flex', gap: 12 }}>
            {[['var(--accent)','Donors'],['var(--danger)','Urgent'],['var(--accent3)','NGOs']].map(([c, l]) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--text2)', fontWeight: 600 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, display: 'inline-block', boxShadow: `0 0 6px ${c}` }} />
                {l}
              </span>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', height: 304, background: 'rgba(6,12,26,0.9)' }}>
          {/* Grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }} />
          {/* Watermark */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            color: 'rgba(59,130,246,0.04)', fontSize: 72, fontWeight: 900,
            userSelect: 'none', pointerEvents: 'none',
          }}>BLR</div>

          {/* Pins */}
          {MAP_PINS.map((pin, i) => {
            const col = pin.type === 'available' ? '#3b82f6' : pin.type === 'urgent' ? '#ef4444' : '#818cf8'
            return (
              <div key={i} style={{ position: 'absolute', top: pin.top, left: pin.left, transform: 'translate(-50%,-50%)', cursor: 'pointer', zIndex: 2 }}
                onMouseEnter={() => setTooltip(i)} onMouseLeave={() => setTooltip(null)}>
                <div style={{
                  width: 13, height: 13, borderRadius: '50%',
                  background: col, border: '2px solid rgba(255,255,255,0.2)',
                  boxShadow: `0 0 14px ${col}aa`,
                  transition: 'transform 0.2s',
                  transform: pulse === i ? 'scale(2)' : 'scale(1)',
                  animation: pin.type === 'urgent' ? 'blueRing 1.5s infinite' : 'none',
                }} />
                {tooltip === i && (
                  <div style={{
                    position: 'absolute', bottom: '130%', left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(6,12,26,0.96)', backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(59,130,246,0.25)',
                    borderRadius: 10, padding: '7px 11px',
                    fontSize: 11, fontWeight: 600, color: 'var(--text)',
                    whiteSpace: 'nowrap', zIndex: 10,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 20px rgba(59,130,246,0.1)',
                    animation: 'scaleIn 0.15s ease forwards',
                  }}>{pin.label}</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
