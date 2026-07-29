import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

const NAV = [
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

export default function Header() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div style={{
        scaleX,
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 2, background: 'var(--accent)',
        transformOrigin: '0%', zIndex: 10002,
        pointerEvents: 'none',
      }} />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: 'clamp(.9rem,2vw,1.4rem) clamp(1.25rem,4vw,3rem)',
          backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          background: scrolled ? 'rgba(8,8,8,0.8)' : 'transparent',
          borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
          transition: 'background .4s, border-color .4s',
          fontFamily: 'var(--mono)',
        }}
      >
        <a href="#hero" style={{
          fontFamily: 'var(--display)', fontWeight: 800,
          fontSize: 'clamp(1rem,2.5vw,1.15rem)', letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          Hithesh
        </a>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}
          className="desktop-nav">
          {NAV.map(({ href, label }) => (
            <NavLink key={href} href={href}>{label}</NavLink>
          ))}
          <HireBtn />
        </nav>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(o => !o)}
          style={{
            display: 'none', background: 'none', border: 'none',
            cursor: 'pointer', padding: '0.4rem', color: 'var(--text)',
          }}
          className="hamburger"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5">
            {menuOpen
              ? <><line x1="4" y1="4" x2="18" y2="18" /><line x1="18" y1="4" x2="4" y2="18" /></>
              : <><line x1="3" y1="7" x2="19" y2="7" /><line x1="3" y1="15" x2="19" y2="15" /></>
            }
          </svg>
        </button>
      </motion.header>

      {/* Mobile drawer */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{
            position: 'fixed', top: '3.5rem', left: 0, right: 0, zIndex: 49,
            background: 'rgba(8,8,8,0.97)', borderBottom: '1px solid var(--border)',
            padding: '2rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
          }}
        >
          {NAV.map(({ href, label }) => (
            <a key={href} href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--mono)', fontSize: '0.75rem',
                letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)',
              }}>
              {label}
            </a>
          ))}
          <HireBtn />
        </motion.div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .hamburger   { display: flex !important; }
        }
      `}</style>
    </>
  )
}

function NavLink({ href, children }) {
  return (
    <a href={href} className="link-under" style={{
      fontSize: '0.7rem', letterSpacing: '0.16em',
      textTransform: 'uppercase', color: 'var(--muted)',
      transition: 'color .2s',
    }}
      onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
      {children}
    </a>
  )
}

function HireBtn() {
  return (
    <a href="/resume.pdf" style={{
      fontFamily: 'var(--mono)', fontSize: '0.62rem',
      letterSpacing: '0.16em', textTransform: 'uppercase',
      padding: '0.45rem 1.1rem',
      border: '1px solid var(--accent)', color: 'var(--accent)',
      borderRadius: '999px', transition: 'background .25s, color .25s',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#080808' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent)' }}>
      Hire me
    </a>
  )
}
