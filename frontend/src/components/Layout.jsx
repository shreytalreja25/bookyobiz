import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import { getAvailableBusinessTypes, getThemeClassFor, loadSelectedBusinessType, saveSelectedBusinessType } from '../theme.js'

export default function Layout() {
  const businessTypes = getAvailableBusinessTypes()
  const current = loadSelectedBusinessType()
  const location = useLocation()
  const { user, logout } = useAuth() || { user: null, logout: () => {} }

  function onChange(e) {
    saveSelectedBusinessType(e.target.value)
    // simple reload to reapply theme class at root
    window.location.reload()
  }

  const themeClass = getThemeClassFor(current)

  return (
    <div className={themeClass}>
      <header className="site-header">
        <div className="container header-inner">
          <Link to={{ pathname: '/', search: `?type=${current}` }} className="brand">BookYoBiz</Link>
          <nav className="nav">
            <NavLink to={{ pathname: '/', search: `?type=${current}` }} end>Home</NavLink>
            <NavLink to={{ pathname: '/browse', search: `?type=${current}` }}>Browse</NavLink>
            <NavLink to={{ pathname: '/app', search: `?type=${current}` }}>Client</NavLink>
            {!user && <NavLink to={{ pathname: '/login', search: `?type=${current}` }}>Login</NavLink>}
            {!user && <NavLink to={{ pathname: '/register', search: `?type=${current}` }}>Register</NavLink>}
            {user && (['owner','staff'].includes(user.role)) && (
              <NavLink to={{ pathname: '/admin', search: `?type=${current}` }}>Admin</NavLink>
            )}
            {user && <button className="btn" onClick={logout}>Logout</button>}
            {!user && <a className="btn primary" href={`https://forms.gle/`}>List your business</a>}
          </nav>
          <div className="theme-picker">
            {user && (
              <div className="user-badge" title={user.email}>
                {user.email} ({user.role})
              </div>
            )}
            <label htmlFor="biz">Business</label>
            <select id="biz" defaultValue={current} onChange={onChange}>
              {businessTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer container">
        <small>© {new Date().getFullYear()} BookYoBiz</small>
      </footer>
    </div>
  )
}


