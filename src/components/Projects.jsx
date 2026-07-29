import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { supabase } from './lib/supabase'

/* ── single project row ── */
function ProjectRow({ project, index }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const num = String(index + 1).padStart(2, '0')

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.07, ease: [0.25, 1, 0.5, 1] }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      /* touch toggle */
      onClick={() => setOpen(o => !o)}
      style={{
        borderTop: '1px solid var(--border)',
        padding: 'clamp(1.1rem,2.5vw,1.6rem) 0',
        cursor: 'pointer',
        background: open ? 'rgba(200,241,53,0.025)' : 'transparent',
        transition: 'background .3s',
      }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'clamp(2rem,5vw,3.5rem) 1fr auto',
        alignItems: 'center',
        gap: 'clamp(.8rem,2vw,1.5rem)',
      }}>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: '0.62rem',
          color: open ? 'var(--accent)' : 'var(--muted)',
          letterSpacing: '0.1em', transition: 'color .3s',
        }}>
          {num}
        </span>

        <motion.h3
          animate={{ x: open ? 8 : 0 }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          style={{
            fontFamily: 'var(--display)', fontWeight: 700,
            fontSize: 'clamp(1.1rem, 2.5vw, 2rem)',
            letterSpacing: '-0.02em',
            color: open ? 'var(--text)' : 'var(--muted)',
            transition: 'color .3s',
          }}
        >
          {project.title}
        </motion.h3>

        {/* Tags — hidden on mobile via CSS */}
        <div className="proj-tags" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {(project.tech || '').split(',').map(t => (
            <span key={t} style={{
              fontFamily: 'var(--mono)', fontSize: '0.54rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '.22rem .52rem', border: '1px solid var(--border)',
              color: 'var(--muted)', borderRadius: 2, whiteSpace: 'nowrap',
              transition: 'border-color .3s',
              borderColor: open ? 'rgba(200,241,53,.3)' : 'var(--border)',
            }}>
              {t.trim()}
            </span>
          ))}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              paddingTop: '1.2rem',
              paddingLeft: 'clamp(0px, 5vw, 5rem)',
              display: 'flex', flexWrap: 'wrap',
              alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.2rem',
            }}>
              <p style={{
                fontFamily: 'var(--mono)', fontSize: '0.76rem',
                lineHeight: 1.8, color: 'var(--muted)', maxWidth: '52ch',
              }}>
                {project.description}
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', flexShrink: 0 }}>
                {project.github && (
                  <a href={project.github} target="_blank" rel="noreferrer" className="link-under"
                    style={{ fontFamily: 'var(--mono)', fontSize: '0.63rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                    GitHub ↗
                  </a>
                )}
                {project.live && (
                  <a href={project.live} target="_blank" rel="noreferrer" className="link-under"
                    style={{ fontFamily: 'var(--mono)', fontSize: '0.63rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text)' }}>
                    Live ↗
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 580px) { .proj-tags { display: none; } }
      `}</style>
    </motion.div>
  )
}

/* ── pulsing live dot ── */
function LiveDot() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>
      <span style={{
        display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
        background: 'var(--accent)',
        animation: 'livePulse 2s ease-in-out infinite',
      }} />
      live
      <style>{`@keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.7)} }`}</style>
    </span>
  )
}

/* ── Projects section ── */
export default function Projects() {
  const [projects, setProjects] = useState([])
  const [error, setError] = useState(null)
  const headerRef = useRef(null)
  const inView = useInView(headerRef, { once: true, margin: '-80px' })

  useEffect(() => {
    /* Initial fetch */
    supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setProjects(data ?? [])
      })

    /* Real-time subscription */
    const channel = supabase
      .channel('projects-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => {
          supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: true })
            .then(({ data }) => setProjects(data ?? []))
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return (
    <section id="projects" className="section-pad">
      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
        style={{ height: 1, background: 'var(--border)', marginBottom: '4rem', transformOrigin: 'left' }}
      />

      <div ref={headerRef} style={{ marginBottom: '3.5rem' }}>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="section-num"
        >
          01 — Selected Work
        </motion.p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            Projects
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}
          >
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>
              ({projects.length} total)
            </span>
            <LiveDot />
          </motion.div>
        </div>
      </div>

      {error && (
        <p style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '2rem' }}>
          ⚠ Could not connect to database. Check your .env keys.
        </p>
      )}

      <div>
        {projects.map((p, i) => <ProjectRow key={p.id} project={p} index={i} />)}
        <div style={{ borderTop: '1px solid var(--border)' }} />
      </div>
    </section>
  )
}
