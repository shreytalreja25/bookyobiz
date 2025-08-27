import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const auth = useAuth()
  const nav = useNavigate()
  const [sp] = useSearchParams()
  const type = sp.get('type') || 'barber'

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true); setErr('')
    const ok = await auth.login(email, password).catch(() => false)
    setBusy(false)
    if (ok) nav(`/admin?type=${type}`)
    else setErr('Invalid credentials')
  }

  return (
    <section className="section" style={{ maxWidth: 420 }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
        {err && <div style={{ color: 'tomato' }}>{err}</div>}
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={busy} type="submit">{busy ? 'Signing in…' : 'Login'}</button>
      </form>
    </section>
  )
}


