import { useEffect, useState } from 'react'
import { apiGet } from '../apiClient.js'

export default function Admin() {
  const [health, setHealth] = useState('checking...')
  const [appointments, setAppointments] = useState([])

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

  useEffect(() => {
    let cancelled = false
    apiGet('/appointments')
      .then((d) => { if (!cancelled) setAppointments(d || []) })
      .catch(() => { if (!cancelled) setAppointments([]) })
    return () => { cancelled = true }
  }, [])

  return (
    <section className="section">
      <h2>Admin</h2>
      <p>Backend health: {health}</p>
      <div className="card" style={{ marginTop: '1rem', textAlign: 'left' }}>
        <h3>Appointments</h3>
        <ul>
          {appointments.map((a) => (
            <li key={a._id}>
              {new Date(a.start).toLocaleString()} → {new Date(a.end).toLocaleString()} — {a.status}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}


