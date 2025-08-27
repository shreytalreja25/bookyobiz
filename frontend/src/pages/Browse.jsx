import { useEffect, useMemo, useState } from 'react'
import { apiGet } from '../apiClient.js'
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
        <div className="biz-cta">
          <button className="btn primary" onClick={(e) => { e.stopPropagation(); onClick?.(biz); }}>Book Now</button>
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

const MOCK = []

export default function Browse() {
  const [sp] = useSearchParams()
  const type = sp.get('type') || 'barber'
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState(null)
  const [items, setItems] = useState([])
  const [loc, setLoc] = useState(null)

  useEffect(() => {
    // Try geolocation (non-blocking)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => setLoc({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => setLoc(null),
        { enableHighAccuracy: false, maximumAge: 60000, timeout: 3000 },
      )
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (loc) { params.set('lat', String(loc.lat)); params.set('lng', String(loc.lng)); params.set('radiusKm', '10') }
    if (type) params.set('vertical', type)
    if (q.trim()) params.set('q', q.trim())
    apiGet(`/businesses?${params.toString()}`)
      .then((d) => setItems((d || []).map((x) => ({
        id: x._id || x.id,
        name: x.name,
        vertical: x.vertical,
        rating: x.rating || 4.5,
        distanceKm: x.distanceKm || 0,
        photoUrl: x.photoUrl,
        coverUrl: x.coverUrl,
      }))))
      .catch(() => setItems([]))
  }, [loc, type, q])

  const filtered = items

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
            <BusinessCard key={biz.id} biz={biz} onHover={setSelected} onClick={setSelected} />
          ))}
        </div>
        <div className="map-pane">
          <MapPlaceholder selected={selected} />
        </div>
      </div>
    </section>
  )
}


