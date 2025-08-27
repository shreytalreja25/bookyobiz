import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth.jsx'

const STORAGE_KEY = 'bookyobiz_profile_posts'

function loadPosts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function savePosts(posts) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)) } catch {}
}

export default function Profile() {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [posts, setPosts] = useState(loadPosts())

  // Seed recommended barber reviews once
  useEffect(() => {
    const seeded = localStorage.getItem('bookyobiz_profile_seeded')
    if (!seeded && posts.length === 0) {
      const now = Date.now()
      const seedPosts = [
        {
          id: now + 1,
          author: user?.email || 'You',
          text: 'Sharp Fade Barbers — Mid Skin Fade + Textured Crop (4.8/5)\nClean mid skin fade with a soft, natural blend and a textured crop on top. Zero harsh lines, just smooth graduation. Quick, friendly, and they nailed the reference pic.\n#SkinFade #TexturedCrop #SharpFadeBarbers #BookYoBiz',
          createdAt: new Date().toISOString(),
        },
        {
          id: now + 2,
          author: user?.email || 'You',
          text: 'Sharp Fade Barbers — Classic Taper + Beard Shape (5/5)\nClassic taper that sits perfectly with a neat beard shape and razor edge-up. Looks sharp without looking try-hard. Lasted the whole week clean.\n#ClassicTaper #BeardLineUp #Barbershop #FreshCut',
          createdAt: new Date().toISOString(),
        },
        {
          id: now + 3,
          author: user?.email || 'You',
          text: 'City Barber Co. — High Fade + Curly Top (4.7/5)\nHigh fade with a defined curly top—volume up top, tight on the sides. They kept the curls hydrated and bouncy; little styling cream goes a long way.\n#HighFade #CurlyTop #Curls #FadeGame\nCaption: New cut, new mood. Booked via BookYoBiz—zero guesswork, just results. Cheers for the beers. 🍻',
          createdAt: new Date().toISOString(),
        },
      ]
      setPosts(seedPosts)
      savePosts(seedPosts)
      localStorage.setItem('bookyobiz_profile_seeded', 'true')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function addPost() {
    if (!text.trim()) return
    const newPosts = [{ id: Date.now(), author: user?.email || 'You', text: text.trim(), createdAt: new Date().toISOString() }, ...posts]
    setPosts(newPosts)
    savePosts(newPosts)
    setText('')
  }

  function share(post) {
    const url = window.location.origin + '/profile'
    const shareText = `${post.text}\n— via BookYoBiz (${url})`
    if (navigator.share) {
      navigator.share({ title: 'BookYoBiz', text: shareText, url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(shareText).then(() => alert('Copied to clipboard')).catch(() => {})
    }
  }

  return (
    <section className="section profile">
      <h2>My Profile</h2>
      <div className="card editor" style={{ textAlign: 'left' }}>
        <h3>Share your experience</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <textarea rows={4} className="form-control" placeholder="Write a review or recommendation…" value={text} onChange={(e) => setText(e.target.value)} />
          <div>
            <button className="btn primary" onClick={addPost}>Post</button>
          </div>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'left', marginTop: '1rem' }}>
        <h3>My Wall</h3>
        <ul className="wall">
          {posts.map((p) => (
            <li key={p.id} className="post-card">
              <div className="post-header">
                <strong>{p.author}</strong>
                <small>{new Date(p.createdAt).toLocaleString()}</small>
              </div>
              <div className="post-text">{p.text}</div>
              <div className="post-actions">
                <button className="btn" onClick={() => share(p)}>Share</button>
              </div>
            </li>
          ))}
          {posts.length === 0 && <li className="post-card">No posts yet.</li>}
        </ul>
      </div>
    </section>
  )
}


