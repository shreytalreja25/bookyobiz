import { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../apiClient.js'
import { useAuth } from '../auth.jsx'

export default function Client() {
  const [health, setHealth] = useState('checking...')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [authMsg, setAuthMsg] = useState('')
  const auth = useAuth()

  useEffect(() => {
    let cancelled = false
    apiGet('/health')
      .then((d) => {
        if (!cancelled) setHealth(d?.status || 'ok')
      })
      .catch(() => {
        if (!cancelled) setHealth('unreachable')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="section">
      <h2>Client App</h2>
      <p>Backend health: {health}</p>

      <div className="card" style={{ marginTop: '1rem', textAlign: 'left' }}>
        <h3>Register / Login</h3>
        {auth.user && (
          <div style={{ marginBottom: '0.5rem' }}>
            <span className="user-badge">{auth.user.email} ({auth.user.role})</span>
            <button className="btn" style={{ marginLeft: '0.5rem' }} onClick={() => { auth.logout(); setAuthMsg('Logged out'); }}>Logout</button>
          </div>
        )}
        {authMsg && <div style={{ color: 'var(--color-foreground)', opacity: 0.9, marginBottom: '0.25rem' }}>{authMsg}</div>}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!!auth.user} />
          <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={!!auth.user} />
          <button onClick={async () => {
            try {
              const ok = await auth.register(email, password)
              setAuthMsg(ok ? 'Registered and logged in' : 'Registration failed')
            } catch { setAuthMsg('Registration failed') }
          }} disabled={!!auth.user}>Register</button>
          <button onClick={async () => {
            try {
              const ok = await auth.login(email, password)
              setAuthMsg(ok ? 'Logged in' : 'Login failed')
            } catch { setAuthMsg('Login failed') }
          }} disabled={!!auth.user}>Login</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem', textAlign: 'left' }}>
        <h3>Find Availability</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <button disabled={!date || loadingSlots} onClick={async () => {
            try {
              setLoadingSlots(true)
              const r = await apiGet(`/availability?date=${encodeURIComponent(date)}`)
              setSlots(r?.available || [])
            } catch (e) {
              alert('Failed to fetch availability')
            } finally {
              setLoadingSlots(false)
            }
          }}>Fetch Slots</button>
        </div>
        <ul>
          {slots.map((s, idx) => (
            <li key={idx} style={{ margin: '0.25rem 0' }}>
              {new Date(s.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              <button style={{ marginLeft: '0.5rem' }} onClick={async () => {
                try {
                  const hour = new Date(s.start).getUTCHours()
                  const r = await apiPost('/availability/book', { date, hour })
                  alert('Booked id: ' + r?.id)
                } catch (e) {
                  alert('Booking failed')
                }
              }}>Book</button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}


