import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import NgoAllocationCharts from '../components/NgoAllocationCharts'
import MoneyFlowDiagram from '../components/MoneyFlowDiagram'
import ImpactGraph from '../components/ImpactGraph'

const STATUS_COLORS = { Received: '#22d3a5', Allocated: '#f97316', Spent: '#a78bfa' }
const ALLOCATION_OPTIONS = [
  'Vehicle Logistics', 'Cold Storage', 'Packaging Material',
  'Driver Wages', 'NGO Support Grant', 'Logistics Fund'
]

function timeAgo(ms) {
  const diff = Math.floor((Date.now() - ms) / 60000)
  if (diff < 1) return 'just now'
  if (diff < 60) return `${diff}m ago`
  return `${Math.floor(diff / 60)}h ${diff % 60}m ago`
}

export default function MoneyFeed({ feed, onAdd }) {
  const [form, setForm] = useState({ donor: '', amount: '', allocated: 'Logistics Fund', note: '' })
  const [submitting, setSubmitting] = useState(false)

  const totalReceived = feed.reduce((s, f) => s + f.amount, 0)
  const totalSpent = feed.filter(f => f.status === 'Spent').reduce((s, f) => s + f.amount, 0)
  const totalAllocated = feed.filter(f => f.status === 'Allocated').reduce((s, f) => s + f.amount, 0)

  const pieData = [
    { name: 'Spent', value: totalSpent },
    { name: 'Allocated', value: totalAllocated },
    { name: 'Received', value: Math.max(0, totalReceived - totalSpent - totalAllocated) },
  ].filter(d => d.value > 0)

  // Aggregated by allocation
  const allocationBreakdown = ALLOCATION_OPTIONS.map(opt => ({
    name: opt,
    total: feed.filter(f => f.allocated === opt).reduce((s, f) => s + f.amount, 0)
  })).filter(a => a.total > 0).sort((a, b) => b.total - a.total)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      onAdd({
        id: Date.now(),
        donor: form.donor,
        avatar: form.donor.charAt(0).toUpperCase(),
        amount: Number(form.amount),
        allocated: form.allocated,
        status: 'Received',
        time: 'just now',
        _ts: Date.now(),
        txId: `TXN-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      })
      setForm({ donor: '', amount: '', allocated: 'Logistics Fund', note: '' })
      setSubmitting(false)
    }, 600)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">💳 Money Transparency Feed</h1>
        <p className="page-sub">Every rupee tracked — from donation to deployment. Full public accountability.</p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Received', value: totalReceived, color: '#3b82f6', glow: 'rgba(59,130,246,0.3)', icon: '📥', border: 'rgba(59,130,246,0.2)', bg: 'rgba(59,130,246,0.07)' },
          { label: 'Allocated',      value: totalAllocated, color: '#818cf8', glow: 'rgba(129,140,248,0.3)', icon: '📋', border: 'rgba(129,140,248,0.2)', bg: 'rgba(129,140,248,0.06)' },
          { label: 'Deployed',       value: totalSpent,    color: '#22c55e', glow: 'rgba(34,197,94,0.3)',  icon: '✅', border: 'rgba(34,197,94,0.2)',  bg: 'rgba(34,197,94,0.06)'  },
        ].map(s => (
          <div key={s.label} style={{
            background: s.bg, border: `1px solid ${s.border}`,
            borderRadius: 16, padding: '22px',
            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            boxShadow: `0 0 24px ${s.glow}`,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
            <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, textShadow: `0 0 20px ${s.glow}` }}>₹{s.value.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 8, padding: '24px 0', borderTop: '1px solid rgba(59,130,246,0.1)', borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
        <NgoAllocationCharts />
      </div>

      {/* Money Flow Diagram */}
      <MoneyFlowDiagram amount={Number(form.amount) || 500} />

      {/* Impact Graph */}
      <ImpactGraph donationAmount={Number(form.amount) || 500} />

      <div className="grid-2">
        {/* Donate Form */}
        <div className="card" style={{ alignSelf: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, background: 'rgba(34,211,165,0.12)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>💚</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Fund the Mission</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Every rupee helps feed someone today</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input className="form-input" value={form.donor} onChange={e => setForm(f => ({...f, donor: e.target.value}))} placeholder="e.g. Rahul Mehta" required />
            </div>
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: 16 }}>₹</span>
                <input className="form-input" type="number" min="100" style={{ paddingLeft: 30 }} value={form.amount} onChange={e => setForm(f => ({...f, amount: e.target.value}))} placeholder="500" required />
              </div>
            </div>

            {/* Quick amounts */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[500, 1000, 2500, 5000].map(a => (
                <button key={a} type="button" onClick={() => setForm(f => ({...f, amount: a}))}
                  style={{
                    padding: '7px 16px', borderRadius: 8, border: '1px solid',
                    background: Number(form.amount) === a ? 'rgba(34,211,165,0.12)' : 'var(--surface2)',
                    borderColor: Number(form.amount) === a ? 'var(--accent)' : 'var(--border)',
                    color: Number(form.amount) === a ? 'var(--accent)' : 'var(--muted)',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                  ₹{a.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Allocate To</label>
              <select className="form-select" value={form.allocated} onChange={e => setForm(f => ({...f, allocated: e.target.value}))}>
                {ALLOCATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <button type="submit" className="submit-btn" style={{ justifyContent: 'center', opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
              {submitting ? '⏳ Processing...' : '💳 Donate Now'}
            </button>
          </form>
        </div>

        {/* Transaction Feed */}
        <div className="card">
          <div className="section-header">
            <div className="section-title">
              <span className="live-dot" />
              Live Transactions
            </div>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{feed.length} records</span>
          </div>
          <div className="scroll-area">
            {feed.map(f => (
              <div key={f.id} className="money-item">
                <div className="donor-avatar">{f.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{f.donor}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                    {f.txId} · {f._ts ? timeAgo(f._ts) : f.time}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--green)' }}>+₹{f.amount.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{f.allocated}</div>
                  </div>
                  <div style={{
                    padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                    background: `rgba(${STATUS_COLORS[f.status] === 'var(--accent)' ? '34,211,165' : f.status === 'Spent' ? '167,139,250' : '249,115,22'}, 0.12)`,
                    color: STATUS_COLORS[f.status],
                    border: `1px solid ${STATUS_COLORS[f.status]}40`,
                  }}>
                    {f.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
