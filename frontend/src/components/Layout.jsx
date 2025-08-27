import { Link, NavLink, Outlet } from 'react-router-dom'
import { getAvailableBusinessTypes, getThemeClassFor, loadSelectedBusinessType, saveSelectedBusinessType } from '../theme.js'

export default function Layout() {
  const businessTypes = getAvailableBusinessTypes()
  const current = loadSelectedBusinessType()

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
          <Link to="/" className="brand">BookYoBiz</Link>
          <nav className="nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/app">Client</NavLink>
            <NavLink to="/admin">Admin</NavLink>
          </nav>
          <div className="theme-picker">
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


