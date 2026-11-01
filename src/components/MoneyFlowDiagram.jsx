import { useState, useEffect } from 'react'

const FLOWS = [
  {
    id: 'donation',
    icon: '💳',
    title: 'Donation',
    desc: 'Secure payment received',
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.35)',
  },
  {
    id: 'processing',
    icon: '⚙️',
    title: 'Processing',
    desc: 'Verified & recorded on ledger',
    color: '#818cf8',
    glow: 'rgba(129,140,248,0.35)',
  },
  {
    id: 'allocation',
    icon: '📦',
    title: 'Allocation',
    desc: 'Assigned to specific use case',
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.35)',
  },
  {
    id: 'impact',
    icon: '🍱',
    title: 'Real Impact',
    desc: 'Meals delivered to people in need',
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.35)',
  },
]

const SCENARIOS = [
  { amount: 100, meals: 5, use: 'Packaging Material', people: 5 },
  { amount: 500, meals: 25, use: 'Vehicle Logistics', people: 25 },
  { amount: 1000, meals: 50, use: 'Driver Wages', people: 50 },
  { amount: 2500, meals: 125, use: 'Cold Storage', people: 125 },
  { amount: 5000, meals: 250, use: 'NGO Support Grant', people: 250 },
  { amount: 10000, meals: 500, use: 'Logistics Fund', people: 500 },
]

export default function MoneyFlowDiagram({ amount = 500 }) {
  const [activeStep, setActiveStep] = useState(0)
  const [running, setRunning] = useState(true)
  const [dotPct, setDotPct] = useState(0)

  // Find closest scenario
  const scenario = SCENARIOS.reduce((prev, curr) =>
    Math.abs(curr.amount - amount) < Math.abs(prev.amount - amount) ? curr : prev
  )

  // Auto-advance steps
  useEffect(() => {
    if (!running) return
    setActiveStep(0)
    setDotPct(0)
    const stepInterval = setInterval(() => {
      setActiveStep(prev => {
        if (prev >= FLOWS.length - 1) {
          setRunning(false)
          return prev
        }
        return prev + 1
      })
    }, 1100)
    return () => clearInterval(stepInterval)
  }, [amount, running])

  // Animate dot pct 0→100 in sync with steps
  useEffect(() => {
    if (!running) return
    let frame
    let start = null
    const totalDuration = 1100 * (FLOWS.length - 1)
    const animate = (ts) => {
      if (!start) start = ts
      const elapsed = ts - start
      setDotPct(Math.min((elapsed / totalDuration) * 100, 100))
      if (elapsed < totalDuration) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [running, amount])

  const replay = () => { setRunning(true) }

  return (
    <div className="card" style={{ marginBottom: 20, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
            🔁 Money Flow
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>
            Watch how <span style={{ color: '#3b82f6', fontWeight: 700 }}>₹{amount.toLocaleString()}</span> travels from your wallet to real impact
          </div>
        </div>
        <button
          onClick={replay}
          style={{
            background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)',
            borderRadius: 10, padding: '7px 14px', color: '#60a5fa',
            fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.12)'}
        >↺ Replay</button>
      </div>

      {/* Flow Steps */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
        {FLOWS.map((step, i) => {
          const isActive = i === activeStep
          const isDone = i < activeStep
          const isPending = i > activeStep

          return (
            <div key={step.id} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              {/* Step Card */}
              <div style={{
                flex: '0 0 auto',
                width: '100%',
                maxWidth: 'calc(100% - 32px)',
                background: isActive
                  ? `rgba(${step.color.replace('#', '').match(/.{2}/g).map(h => parseInt(h, 16)).join(',')}, 0.12)`
                  : isDone
                    ? 'rgba(34,197,94,0.06)'
                    : 'rgba(59,130,246,0.03)',
                border: `1px solid ${isActive ? step.color + '55' : isDone ? '#22c55e33' : 'rgba(59,130,246,0.1)'}`,
                borderRadius: 14,
                padding: '16px 14px',
                textAlign: 'center',
                transition: 'all 0.5s cubic-bezier(.16,1,.3,1)',
                boxShadow: isActive ? `0 0 24px ${step.glow}` : 'none',
                transform: isActive ? 'translateY(-3px)' : 'none',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Shimmer on active */}
                {isActive && (
                  <div style={{
                    position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                    animation: 'shimmerMove 1.5s ease infinite',
                    pointerEvents: 'none',
                  }} />
                )}

                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: isActive ? `${step.color}22` : isDone ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.05)',
                  border: `1px solid ${isActive ? step.color + '44' : 'transparent'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, margin: '0 auto 10px',
                  transition: 'all 0.4s',
                  boxShadow: isActive ? `0 0 16px ${step.glow}` : 'none',
                }}>
                  {isDone ? '✅' : step.icon}
                </div>

                <div style={{
                  fontSize: 13, fontWeight: 700,
                  color: isActive ? step.color : isDone ? '#22c55e' : 'var(--text2)',
                  marginBottom: 4, transition: 'color 0.4s',
                }}>{step.title}</div>

                <div style={{ fontSize: 11, color: isPending ? 'var(--muted)' : 'var(--text2)', lineHeight: 1.4 }}>
                  {step.desc}
                </div>

                {/* Step number */}
                <div style={{
                  position: 'absolute', top: 8, right: 10,
                  fontSize: 10, fontWeight: 800, color: isActive ? step.color : isDone ? '#22c55e55' : '#3d5280',
                  letterSpacing: '0.5px',
                }}>0{i + 1}</div>
              </div>

              {/* Connector Arrow */}
              {i < FLOWS.length - 1 && (
                <div style={{
                  flex: '0 0 32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  {/* Line */}
                  <div style={{
                    height: 2, width: '100%', position: 'relative',
                    background: 'rgba(59,130,246,0.12)',
                    borderRadius: 2,
                  }}>
                    {/* Filled portion */}
                    <div style={{
                      position: 'absolute', left: 0, top: 0, height: '100%',
                      width: i < activeStep ? '100%' : i === activeStep - 1 ? '100%' : '0%',
                      background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                      borderRadius: 2,
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                  {/* Arrow tip */}
                  <div style={{
                    position: 'absolute', right: -1,
                    width: 0, height: 0,
                    borderTop: '4px solid transparent',
                    borderBottom: '4px solid transparent',
                    borderLeft: i < activeStep ? '6px solid #06b6d4' : '6px solid rgba(59,130,246,0.2)',
                    transition: 'border-left-color 0.5s',
                  }} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Result Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(6,182,212,0.08))',
        border: '1px solid rgba(59,130,246,0.18)',
        borderRadius: 14, padding: '18px 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
        transition: 'all 0.5s',
        opacity: activeStep >= FLOWS.length - 1 ? 1 : 0.3,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {[
            { icon: '💰', label: 'You Donated', value: `₹${amount.toLocaleString()}` },
            { icon: '📦', label: 'Allocated To', value: scenario.use },
            { icon: '🍱', label: 'Meals Funded', value: `${scenario.meals} meals` },
            { icon: '👥', label: 'People Served', value: `${scenario.people} people` },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#e8efff' }}>{item.value}</div>
              <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>
        <div style={{
          background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)',
          borderRadius: 12, padding: '10px 18px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#22c55e' }}>
            {scenario.meals} <span style={{ fontSize: 13, fontWeight: 600 }}>meals</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>Mission Accomplished 🎉</div>
        </div>
      </div>

      <style>{`
        @keyframes shimmerMove {
          0%   { left: -100%; }
          100% { left: 200%; }
        }
      `}</style>
    </div>
  )
}
