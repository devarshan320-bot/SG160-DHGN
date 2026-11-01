import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

const FOOD_TYPES = [
  { value: 'Cooked Meals', label: '🍛 Cooked Meals', emoji: '🍛' },
  { value: 'Raw Ingredients', label: '🥦 Raw Ingredients', emoji: '🥦' },
  { value: 'Packaged Food', label: '📦 Packaged Food', emoji: '📦' },
  { value: 'Bakery Items', label: '🥐 Bakery Items', emoji: '🥐' },
  { value: 'Fresh Produce', label: '🥗 Fresh Produce', emoji: '🥗' },
  { value: 'Catering Surplus', label: '🍽️ Catering Surplus', emoji: '🍽️' },
]

const HOTELS = [
  'The Grand Hyatt', 'Taj Palace', 'Marriott Hotel', 'Radisson Blu',
  'ITC Maurya', 'Le Méridien', 'Sheraton', 'Hilton Garden',
  'Oberoi Grand', 'Park Hyatt', 'Other / Independent'
]

export default function AddFood({ onAdd }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [classifying, setClassifying] = useState(false)
  const [model, setModel] = useState(null)
  const [form, setForm] = useState({
    hotelName: '', customHotel: '', foodType: 'Cooked Meals',
    quantity: '', unit: 'meals', expiryHours: 4, description: '',
    contactName: '', phone: ''
  })

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
      } catch (err) {
        console.error('Failed to load model:', err);
      }
    };
    loadModel();
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !model) return;

    setClassifying(true);
    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      const predictions = await model.classify(img);
      if (predictions.length > 0) {
        set('description', predictions[0].className);
      }
    } catch (err) {
      console.error('Classification failed:', err);
    } finally {
      setClassifying(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const name = form.hotelName === 'Other / Independent' ? form.customHotel : form.hotelName
    const ft = FOOD_TYPES.find(f => f.value === form.foodType)
    onAdd({
      id: Date.now(),
      hotelName: name,
      emoji: ft?.emoji || '🍱',
      foodType: form.foodType + (form.description ? ` — ${form.description}` : ''),
      quantity: Number(form.quantity),
      unit: form.unit,
      status: form.expiryHours <= 1 ? 'urgent' : 'available',
      expiryHours: Number(form.expiryHours),
      distance: +(Math.random() * 5 + 0.5).toFixed(1),
      lat: 28.55 + Math.random() * 0.15,
      lng: 77.15 + Math.random() * 0.15,
      claimedBy: null,
      createdAt: new Date().toISOString(),
      color: '#22d3a5',
      isLive: true,
    })
    setSubmitted(true)
  }

  if (submitted) return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', animation: 'fadeUp 0.5s ease' }}>
        <div style={{ fontSize: 80, marginBottom: 24 }}>🎉</div>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Donation Listed!</h2>
        <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 32, maxWidth: 400 }}>
          Your food donation has been broadcast to all NGOs in real-time. A team will be in touch shortly.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="submit-btn" onClick={() => navigate('/')}>View Dashboard</button>
          <button className="submit-btn" style={{ background: 'var(--surface2)', color: 'var(--text)' }}
            onClick={() => { setSubmitted(false); setStep(1); setForm({ hotelName:'',customHotel:'',foodType:'Cooked Meals',quantity:'',unit:'meals',expiryHours:4,description:'',contactName:'',phone:'' }) }}>
            Add Another
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Donate Surplus Food</h1>
        <p className="page-sub">List your surplus food and an NGO will pick it up — usually within 30 minutes</p>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 36 }}>
          {[1, 2].map(s => (
            <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative' }}>
              {s < 2 && (
                <div style={{ position: 'absolute', top: 18, left: '50%', width: '100%', height: 2, background: step > s ? 'var(--accent)' : 'var(--border)' }} />
              )}
              <div style={{
                width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 14, zIndex: 1,
                background: step >= s ? 'var(--accent)' : 'var(--surface2)',
                color: step >= s ? 'var(--bg)' : 'var(--muted)',
                border: `2px solid ${step >= s ? 'var(--accent)' : 'var(--border)'}`,
              }}>{s}</div>
              <div style={{ fontSize: 12, color: step >= s ? 'var(--accent)' : 'var(--muted)', fontWeight: 600 }}>
                {s === 1 ? 'Food Details' : 'Contact Info'}
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Hotel / Restaurant Name</label>
                  <select className="form-select" value={form.hotelName} onChange={e => set('hotelName', e.target.value)} required>
                    <option value="">— Select your establishment —</option>
                    {HOTELS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                {form.hotelName === 'Other / Independent' && (
                  <div className="form-group">
                    <label className="form-label">Enter Name</label>
                    <input className="form-input" value={form.customHotel} onChange={e => set('customHotel', e.target.value)} placeholder="Restaurant or hotel name" required />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Food Category</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {FOOD_TYPES.map(ft => (
                      <button
                        key={ft.value}
                        type="button"
                        onClick={() => set('foodType', ft.value)}
                        style={{
                          padding: '12px 8px', borderRadius: 10, border: '1px solid',
                          background: form.foodType === ft.value ? 'rgba(34,211,165,0.12)' : 'var(--surface2)',
                          borderColor: form.foodType === ft.value ? 'var(--accent)' : 'var(--border)',
                          color: form.foodType === ft.value ? 'var(--accent)' : 'var(--muted)',
                          cursor: 'pointer', fontSize: 13, fontWeight: 600,
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                          fontFamily: 'inherit',
                        }}
                      >
                        <span style={{ fontSize: 22 }}>{ft.emoji}</span>
                        {ft.value}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Food Image (optional - for auto-classification)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={classifying}
                    style={{ marginBottom: 8 }}
                  />
                  {classifying && <div style={{ fontSize: 12, color: 'var(--muted)' }}>Classifying image...</div>}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Quantity</label>
                    <input className="form-input" type="number" min="1" value={form.quantity} onChange={e => set('quantity', e.target.value)} placeholder="e.g. 80" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unit</label>
                    <select className="form-select" value={form.unit} onChange={e => set('unit', e.target.value)}>
                      <option value="meals">Meals</option>
                      <option value="kg">Kilograms (kg)</option>
                      <option value="pieces">Pieces</option>
                      <option value="litres">Litres</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Safe Until (hours from now)</label>
                    <input className="form-input" type="number" min="1" max="48" value={form.expiryHours} onChange={e => set('expiryHours', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description (optional)</label>
                    <input className="form-input" value={form.description} onChange={e => set('description', e.target.value)} placeholder="e.g. Veg biryani, no allergens" />
                  </div>
                </div>

                {form.expiryHours <= 1 && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: 'var(--danger)' }}>
                    ⚠️ This will be marked <strong>URGENT</strong> — NGOs will be notified immediately.
                  </div>
                )}

                <button type="button" className="submit-btn" onClick={() => form.hotelName && form.quantity ? setStep(2) : null}
                  style={{ alignSelf: 'flex-end' }}>
                  Next Step →
                </button>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ background: 'rgba(34,211,165,0.08)', border: '1px solid rgba(34,211,165,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Donation Summary</div>
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    <div><span style={{ fontSize: 20 }}>{FOOD_TYPES.find(f => f.value === form.foodType)?.emoji}</span><strong style={{ marginLeft: 8 }}>{form.quantity} {form.unit}</strong></div>
                    <div style={{ color: 'var(--muted)' }}>from {form.hotelName === 'Other / Independent' ? form.customHotel : form.hotelName}</div>
                    <div style={{ color: 'var(--muted)' }}>Safe for {form.expiryHours}h</div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Person Name</label>
                  <input className="form-input" value={form.contactName} onChange={e => set('contactName', e.target.value)} placeholder="Kitchen Manager or Chef name" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input className="form-input" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" required />
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button type="button" onClick={() => setStep(1)}
                    style={{ padding: '14px 24px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--muted)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    ← Back
                  </button>
                  <button type="submit" className="submit-btn" style={{ flex: 1, justifyContent: 'center' }}>
                    🌿 List Donation Now
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Info cards */}
        <div className="grid-3" style={{ marginTop: 20 }}>
          {[
            { icon: '⚡', title: 'Instant Broadcast', desc: 'NGOs notified in under 30 seconds' },
            { icon: '🚚', title: 'Free Pickup', desc: 'We coordinate logistics at no cost' },
            { icon: '🏆', title: 'Earn Credits', desc: '+10 credits per donation for leaderboard' },
          ].map(info => (
            <div key={info.title} style={{ background: 'var(--surface2)', borderRadius: 12, padding: '16px', textAlign: 'center', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{info.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{info.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>{info.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
