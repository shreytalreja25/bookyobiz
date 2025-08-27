import { useEffect, useState } from 'react'
import { apiGet } from '../apiClient.js'

export default function Admin() {
  const [health, setHealth] = useState('checking...')

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
      <h2>Admin</h2>
      <p>Backend health: {health}</p>
    </section>
  )
}


