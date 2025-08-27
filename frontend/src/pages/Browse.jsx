import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

function emojiFor(vertical) {
  const v = String(vertical || '').toLowerCase()
  if (v.includes('barber')) return '✂️'
  if (v.includes('salon')) return '💇‍♀️'
  if (v.includes('spa')) return '🌿'
  if (v.includes('tattoo')) return '🎨'
  if (v.includes('massage')) return '💆'
  if (v.includes('nail')) return '💅'
  if (v.includes('fitness')) return '🏋️'
  if (v.includes('electric')) return '⚡'
  if (v.includes('plumb')) return '🔧'
  return '🏷️'
}

function BusinessCard({ biz, onHover, onClick }) {
  return (
    <div className="biz-card" onMouseEnter={() => onHover?.(biz)} onClick={() => onClick?.(biz)}>
      <div className="biz-card-cover">
        {biz.coverUrl ? (<img src={biz.coverUrl} alt="cover" />) : (<span>{emojiFor(biz.vertical)}</span>)}
      </div>
      <div className="biz-card-body">
        <div className="biz-avatar">
          {biz.photoUrl ? (<img src={biz.photoUrl} alt={biz.name} />) : (<span>{emojiFor(biz.vertical)}</span>)}
        </div>
        <div className="biz-meta">
          <div className="biz-card-title">{biz.name}</div>
          <div className="biz-card-sub">{biz.vertical} • {biz.distanceKm.toFixed(1)} km • ⭐ {biz.rating.toFixed(1)}</div>
          {biz.promo && <div className="badge">{biz.promo.title}</div>}
        </div>
      </div>
    </div>
  )
}

function MapPlaceholder({ selected }) {
  return (
    <div className="map-placeholder">
      <div>Map will go here</div>
      {selected && <div className="map-selected">Selected: {selected.name}</div>}
    </div>
  )
}

const MOCK = [
  { id: '1', name: 'Sharp Fade Barbers', vertical: 'barber', rating: 4.6, distanceKm: 1.2, promo: { title: '10% off first cut' } },
  { id: '2', name: 'Glow Salon', vertical: 'salon', rating: 4.8, distanceKm: 2.9 },
  { id: '3', name: 'Zen Spa', vertical: 'spa', rating: 4.7, distanceKm: 3.4, promo: { title: 'Free massage add-on' } },
]

export default function Browse() {
  const [sp] = useSearchParams()
  const type = sp.get('type') || 'barber'
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    return MOCK.filter(b => b.name.toLowerCase().includes(t) || b.vertical.toLowerCase().includes(t))
  }, [q])

  return (
    <section className="section">
      <div className="browse-toolbar">
        <input className="input" placeholder="Search service or business" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="chips">
          {['barber','salon','spa','tattoo','massage','nails'].map((c) => (
            <span key={c} className={`chip ${c === type ? 'active' : ''}`}>{c}</span>
          ))}
        </div>
      </div>

      <div className="browse-split">
        <div className="list-pane">
          {filtered.map((biz) => (
            <div key={biz.id} className="biz-card-row">
              <BusinessCard biz={biz} onHover={setSelected} onClick={setSelected} />
              <div className="biz-card-actions">
                <button className="btn primary">Book Now</button>
              </div>
            </div>
          ))}
        </div>
        <div className="map-pane">
          <MapPlaceholder selected={selected} />
        </div>
      </div>
    </section>
  )
}


