import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, ExternalLink, Bookmark, Trophy, Filter, Search, Sparkles, Github } from 'lucide-react'
import Chatbot from './Chatbot'

// MOCK_CONTESTS removed - fetching from backend

const ContestCard = ({ contest, isBookmarked, toggleBookmark }) => {
  return (
    <motion.div 
      layout
      className="contest-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
      transition={{ duration: 0.3 }}
    >
      <div className={`platform-badge badge-${contest.platform.toLowerCase()}`}>
        {contest.platform}
      </div>
      <h3 className="contest-title">{contest.title}</h3>
      <div className="contest-info">
        <div className="info-item">
          <Calendar size={16} />
          <span>{contest.startTime}</span>
        </div>
        <div className="info-item">
          <Clock size={16} />
          <span>{contest.duration}</span>
        </div>
      </div>
      <div className="card-footer">
        <a href={contest.link} target="_blank" rel="noopener noreferrer" className="btn-primary">
          View Details
        </a>
        <button 
          className="btn-icon" 
          onClick={() => toggleBookmark(contest.id)}
          style={{ color: isBookmarked ? 'var(--primary)' : 'var(--text-muted)' }}
        >
          <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>
    </motion.div>
  )
}

const StatsCard = ({ title, value, icon: Icon, color }) => (
  <motion.div 
    className="stats-card"
    whileHover={{ scale: 1.05 }}
  >
    <div className="stats-icon" style={{ backgroundColor: color }}>
      <Icon size={20} color="white" />
    </div>
    <div>
      <div className="stats-value">{value}</div>
      <div className="stats-title">{title}</div>
    </div>
  </motion.div>
)

const LoginPage = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isSignUp) {
      // Mock signup success
      onLogin()
    } else {
      if (username.trim() === 'admin' && password.trim() === 'tracker123') {
        onLogin()
      } else {
        setError('Invalid credentials. Use admin / tracker123')
      }
    }
  }

  return (
    <div className="login-container">
      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="login-header">
          <div className="logo" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Trophy size={32} />
            <span style={{ fontSize: '1.75rem' }}>Contest Tracker</span>
          </div>
          <h1>{isSignUp ? 'Create an Account' : 'Welcome Back!'}</h1>
          <p>{isSignUp ? 'Join us and start tracking contests.' : 'Please log in to track your next victory.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              placeholder={isSignUp ? 'Choose a username' : 'admin'}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder={isSignUp ? 'Choose a password' : 'tracker123'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && !isSignUp && <div className="login-error">{error}</div>}
          <button type="submit" className="btn-primary login-btn">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
          
          <div className="divider">
            <span>OR</span>
          </div>

          <button type="button" className="btn-github" onClick={() => onLogin()}>
            <Github size={20} />
            Continue with GitHub
          </button>
        </form>

        <div className="toggle-signup" style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button 
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
            }}
            style={{ 
              background: 'none', border: 'none', color: 'var(--primary)', 
              fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' 
            }}
          >
            {isSignUp ? 'Log in' : 'Sign up'}
          </button>
        </div>

        {!isSignUp && (
          <div className="dummy-creds">
            <p><strong>Demo Mode:</strong> Use <code>admin</code> / <code>tracker123</code></p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [bookmarks, setBookmarks] = useState(new Set())
  const [contests, setContests] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  React.useEffect(() => {
    if (isLoggedIn) {
      fetchContests()
    }
  }, [isLoggedIn])

  const fetchContests = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:8000/contests')
      const data = await response.json()
      setContests(data)
      
      // Initialize bookmarks from backend data
      const initialBookmarks = new Set()
      data.forEach(c => {
        if (c.is_bookmarked) initialBookmarks.add(c.id)
      })
      setBookmarks(initialBookmarks)
    } catch (err) {
      console.error("Failed to fetch contests:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const syncContests = async () => {
    try {
      setIsLoading(true)
      await fetch('http://localhost:8000/contests/sync', { method: 'POST' })
      await fetchContests()
    } catch (err) {
      console.error("Failed to sync:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />
  }

  const toggleBookmark = async (id) => {
    try {
      await fetch(`http://localhost:8000/bookmarks/${id}`, { method: 'POST' })
      setBookmarks(prev => {
        const newBookmarks = new Set(prev)
        if (newBookmarks.has(id)) {
          newBookmarks.delete(id)
        } else {
          newBookmarks.add(id)
        }
        return newBookmarks
      })
    } catch (err) {
      console.error("Error toggling bookmark", err)
    }
  }

  const filteredContests = contests.filter(c => {
    const matchesFilter = filter === 'All' || c.platform === filter
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = [
    { title: 'Codeforces', value: 2, icon: Trophy, color: '#ef4444' },
    { title: 'LeetCode', value: 1, icon: Trophy, color: '#f59e0b' },
    { title: 'CodeChef', value: 1, icon: Trophy, color: '#22c55e' },
    { title: 'AtCoder', value: 1, icon: Trophy, color: '#000000' },
  ]

  const PLATFORMS = ['All', 'Codeforces', 'LeetCode', 'CodeChef', 'AtCoder', 'HackerRank']

  return (
    <div className="app-container">
      <nav className="glass-nav">
        <div className="logo">
          <Trophy size={28} />
          <span>Contest Tracker</span>
        </div>
        <div className="nav-actions">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search contests..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-icon" onClick={syncContests} title="Sync Contests">
            <Sparkles size={20} className={isLoading ? "spin-animation" : ""} />
          </button>
          <button className="btn-icon" onClick={() => setIsLoggedIn(false)} title="Logout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      </nav>

      <main className="main-content">
        <motion.section 
          className="hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>AI Powered tracking</span>
          </div>
          <h1>Level Up Your Skills</h1>
          <p>The smartest way to track competitive programming contests. Never miss a round again.</p>
          
          <div className="stats-grid">
            {stats.map((s, i) => (
              <StatsCard key={i} {...s} />
            ))}
          </div>
        </motion.section>

        <div className="section-header">
          <h2>Upcoming Rounds</h2>
          <div className="filter-bar">
            {PLATFORMS.map(p => (
              <button 
                key={p} 
                className={`filter-chip ${filter === p ? 'active' : ''}`}
                onClick={() => setFilter(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="contest-grid">
          <AnimatePresence mode="popLayout">
            {isLoading && contests.length === 0 ? (
              <motion.div className="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Loading contests from platforms...
              </motion.div>
            ) : filteredContests.map((contest) => (
              <ContestCard 
                key={contest.id} 
                contest={contest} 
                isBookmarked={bookmarks.has(contest.id)}
                toggleBookmark={toggleBookmark}
              />
            ))}
          </AnimatePresence>
          {!isLoading && filteredContests.length === 0 && (
            <motion.div 
              className="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No contests found matching your search.
            </motion.div>
          )}
        </div>
      </main>
      <Chatbot />
    </div>
  )
}

export default App
