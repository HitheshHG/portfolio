import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const mouse = useRef({ x: -100, y: -100 })
  const ring = useRef({ x: -100, y: -100 })
  const raf = useRef(null)
  const grown = useRef(false)

  useEffect(() => {
    // Don't run on touch-only devices
    if (window.matchMedia('(hover: none)').matches) return

    const dot = dotRef.current
    const ring_ = ringRef.current
    if (!dot || !ring_) return

    const onMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      dot.style.transform = `translate3d(${e.clientX - 4}px,${e.clientY - 4}px,0)`
    }

    const onOver = (e) => {
      if (e.target.closest('a, button') && !grown.current) {
        grown.current = true
        Object.assign(ring_.style, {
          width: '56px', height: '56px',
          marginTop: '-28px', marginLeft: '-28px',
          borderColor: 'rgba(200,241,53,0.85)',
        })
      }
    }

    const onOut = (e) => {
      if (!e.relatedTarget?.closest('a, button') && grown.current) {
        grown.current = false
        Object.assign(ring_.style, {
          width: '36px', height: '36px',
          marginTop: '-18px', marginLeft: '-18px',
          borderColor: 'rgba(200,241,53,0.4)',
        })
      }
    }

    const lerp = (a, b, t) => a + (b - a) * t

    const tick = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.1)
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.1)
      ring_.style.transform = `translate3d(${ring.current.x}px,${ring.current.y}px,0)`
      raf.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: 8, height: 8, borderRadius: '50%',
        background: 'var(--accent)',
        pointerEvents: 'none', zIndex: 10001,
        willChange: 'transform',
        transform: 'translate3d(-100px,-100px,0)',
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: 36, height: 36,
        marginTop: -18, marginLeft: -18,
        borderRadius: '50%',
        border: '1px solid rgba(200,241,53,0.4)',
        pointerEvents: 'none', zIndex: 10000,
        willChange: 'transform',
        transform: 'translate3d(-100px,-100px,0)',
        transition: 'width .3s, height .3s, margin .3s, border-color .3s',
      }} />
    </>
  )
}
