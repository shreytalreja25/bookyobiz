import { Link, Route, Routes } from 'react-router-dom'
import Client from './pages/Client.jsx'
import Admin from './pages/Admin.jsx'
import './App.css'
import Layout from './components/Layout.jsx'
import { AuthProvider, RequireAuth } from './auth.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Browse from './pages/Browse.jsx'

function Landing() {
  return (
    <main className="landing">
      <header className="hero">
        <h1 className="brand">BookYoBiz</h1>
        <p className="tagline">Bookings • Jobs • Discovery • Ads</p>
        <div className="cta">
          <Link className="btn primary" to="/app">Enter Client</Link>
          <Link className="btn" to="/admin">Enter Admin</Link>
        </div>
      </header>

      <section className="section">
        <h2>What is BookYoBiz?</h2>
        <p>
          A multi-tenant growth platform for local businesses. Start with online
          bookings and payments, expand with job postings, discovery maps, and
          promotions. Built mobile-first with a fun, approachable brand.
        </p>
      </section>

      <section className="section grid">
        <div>
          <h3>MVP Focus</h3>
          <ul>
            <li>Services, staff, availability, deposits</li>
            <li>Admin dashboard and JWT auth</li>
            <li>Stripe payments, email/WhatsApp reminders</li>
            <li>Tenant-aware theming (e.g., BookYoBarber, BookYoSalon)</li>
          </ul>
        </div>
        <div>
          <h3>Phase 2</h3>
          <ul>
            <li>Job board for hiring</li>
            <li>Map-based discovery</li>
            <li>Ads & promotions</li>
          </ul>
        </div>
        <div>
          <h3>Phase 3</h3>
          <ul>
            <li>AI callbacks and reply bots</li>
            <li>Loyalty, referrals, waitlists</li>
            <li>Mobile app and analytics</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <h2>Tech Stack</h2>
        <p>
          React (Vite) on Vercel • Node/Express on Render • MongoDB Atlas • Stripe •
          Email/WhatsApp notifications
        </p>
      </section>

      <footer className="footer">
        <small>© {new Date().getFullYear()} BookYoBiz</small>
      </footer>
    </main>
  )
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/app" element={<Client />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
