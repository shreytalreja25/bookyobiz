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
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'var(--color-surface)' }}>
          <div className="container">
            <Link to={{ pathname: '/', search: `?type=${current}` }} className="navbar-brand brand">BookYoBiz</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent" aria-controls="navContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav">
                <li className="nav-item"><NavLink className="nav-link" to={{ pathname: '/', search: `?type=${current}` }} end>Home</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to={{ pathname: '/browse', search: `?type=${current}` }}>Browse</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to={{ pathname: '/app', search: `?type=${current}` }}>Client</NavLink></li>
                {!user && <li className="nav-item"><NavLink className="nav-link" to={{ pathname: '/login', search: `?type=${current}` }}>Login</NavLink></li>}
                {!user && <li className="nav-item"><NavLink className="nav-link" to={{ pathname: '/register', search: `?type=${current}` }}>Register</NavLink></li>}
                {user && (['owner','staff'].includes(user.role)) && (
                  <li className="nav-item"><NavLink className="nav-link" to={{ pathname: '/admin', search: `?type=${current}` }}>Admin</NavLink></li>
                )}
                {user && <li className="nav-item"><NavLink className="nav-link" to={{ pathname: '/profile', search: `?type=${current}` }}>Profile</NavLink></li>}
              </ul>
              <div className="d-flex align-items-center gap-2 theme-picker">
                {user && (
                  <div className="user-badge" title={user.email}>
                    {user.email} ({user.role})
                  </div>
                )}
                <label htmlFor="biz" className="form-label m-0">Business</label>
                <select id="biz" className="form-select form-select-sm" style={{ width: 'auto' }} defaultValue={current} onChange={onChange}>
                  {businessTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {user ? <button className="btn btn-sm btn-outline-light" onClick={logout}>Logout</button> : <a className="btn btn-sm btn-primary" href={`https://forms.gle/`}>List your business</a>}
              </div>
            </div>
          </div>
        </nav>
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


