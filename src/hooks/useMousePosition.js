import { useEffect, useRef } from 'react'

/**
 * Smooth normalized pointer in [-1, 1].
 * If `targetRef` is set, aim is relative to that element’s center (better head tracking).
 * Otherwise uses viewport-wide normalization.
 */
export function useMousePosition(targetRef) {
  const mouse = useRef({ x: 0, y: 0 })
  const lerpedMouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      const el = targetRef?.current
      if (el) {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const halfW = Math.max(r.width * 0.45, 1)
        const halfH = Math.max(r.height * 0.45, 1)
        mouse.current = {
          x: Math.max(-1, Math.min(1, (e.clientX - cx) / halfW)),
          y: Math.max(-1, Math.min(1, (e.clientY - cy) / halfH)),
        }
      } else {
        mouse.current = {
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: (e.clientY / window.innerHeight) * 2 - 1,
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    let frameId
    const animate = () => {
      const k = 0.12
      lerpedMouse.current.x += (mouse.current.x - lerpedMouse.current.x) * k
      lerpedMouse.current.y += (mouse.current.y - lerpedMouse.current.y) * k

      frameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(frameId)
    }
    // targetRef is a stable ref object; handler reads .current each move
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once
  }, [])

  return lerpedMouse
}
