import { useState, useMemo } from 'react'

const FILTERS = ['All', 'Available', 'Urgent', 'Claimed']

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 60000)
  if (diff < 1) return 'just now'
  if (diff < 60) return `${diff}m ago`
  return `${Math.floor(diff / 60)}h ago`
}

function DonationCard({ d, onClaim }) {
  const isAvailable = d.status === 'available'
  const isUrgent = d.status === 'urgent'
  const isClaimed = d.status === 'claimed'

  return (
    <div className={`donation-card ${isUrgent ? 'urgent' : ''} animate-fade-up`}>
      {/* Live badge for newly arrived */}
      {d.isLive && (
        <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(34,211,165,0.15)', color: 'var(--accent)', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, border: '1px solid rgba(34,211,165,0.3)' }}>
          JUST ARRIVED
        </div>
      )}

      {/* Status badge */}
      <div className={`donation-badge ${isUrgent ? 'badge-urgent' : isClaimed ? 'badge-claimed' : 'badge-available'}`}>
        <span>{isUrgent ? '🔴' : isClaimed ? '✅' : '🟢'}</span>
        {isUrgent ? 'Urgent' : isClaimed ? 'Claimed' : 'Available'}
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 24 }}>{d.emoji}</span>
        <div>
          <div className="donation-name">{d.hotelName}</div>
          <div className="donation-type">{d.foodType}</div>
        </div>
      </div>

      {/* Quantity */}
      <div className="donation-qty" style={{ color: isUrgent ? 'var(--danger)' : isAvailable ? 'var(--accent)' : 'var(--accent3)' }}>
        <span className="qty-num">{d.quantity}</span>
        <span className="qty-unit">{d.unit}</span>
      </div>

      {/* Meta */}
      <div className="donation-meta">
        <div className="meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {isUrgent ? <span style={{ color: 'var(--danger)', fontWeight: 700 }}>Expires in {d.expiryHours}h ⚠️</span> : `Expires in ${d.expiryHours}h`}
        </div>
        <div className="meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {d.distance} km away
        </div>
        <div className="meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {timeAgo(d.createdAt)}
        </div>
      </div>

      {/* Claimed by */}
      {isClaimed && (
        <div style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 8, padding: '8px 12px', marginBottom: 14, fontSize: 13 }}>
          <span style={{ color: 'var(--muted)' }}>Claimed by </span>
          <span style={{ color: 'var(--accent3)', fontWeight: 600 }}>{d.claimedBy}</span>
        </div>
      )}

      {/* Button */}
      <button
        className={`claim-btn ${isUrgent ? 'urgent' : isClaimed ? 'claimed' : 'available'}`}
        onClick={() => !isClaimed && onClaim(d.id)}
        disabled={isClaimed}
      >
        {isClaimed ? '✅ Claimed by NGO' : isUrgent ? '🚨 Claim Urgently' : '🤝 Claim Donation'}
      </button>
    </div>
  )
}

export default function Donations({ donations, onClaim }) {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => donations.filter(d => {
    const matchFilter = filter === 'All' || d.status === filter.toLowerCase()
    const matchSearch = d.hotelName.toLowerCase().includes(search.toLowerCase()) ||
      d.foodType.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  }), [donations, filter, search])

  const counts = useMemo(() => ({
    All: donations.length,
    Available: donations.filter(d => d.status === 'available').length,
    Urgent: donations.filter(d => d.status === 'urgent').length,
    Claimed: donations.filter(d => d.status === 'claimed').length,
  }), [donations])

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <span className="live-dot" />
          <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Auto-refreshing</span>
        </div>
        <h1 className="page-title">Live Donation Feed</h1>
        <p className="page-sub">Real-time food rescue listings — new donations appear automatically</p>
      </div>

      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          className="form-input"
          placeholder="🔍  Search hotel or food type..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 220 }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '10px 18px', borderRadius: 10, border: '1px solid',
                fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                background: filter === f ? (f === 'Urgent' ? 'rgba(239,68,68,0.15)' : 'rgba(34,211,165,0.12)') : 'var(--surface)',
                color: filter === f ? (f === 'Urgent' ? 'var(--danger)' : 'var(--accent)') : 'var(--muted)',
                borderColor: filter === f ? (f === 'Urgent' ? 'rgba(239,68,68,0.3)' : 'rgba(34,211,165,0.3)') : 'var(--border)',
              }}
            >
              {f} <span style={{ opacity: 0.7 }}>({counts[f]})</span>
            </button>
          ))}
        </div>
      </div>



      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🍽️</div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>No donations match your filter</div>
          <div>Try changing the filter or search term</div>
        </div>
      ) : (
        <div className="donation-grid">
          {filtered.map(d => <DonationCard key={d.id} d={d} onClaim={onClaim} />)}
        </div>
      )}
    </div>
  )
}
