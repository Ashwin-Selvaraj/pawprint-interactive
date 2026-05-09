import { useEffect, useRef, useState } from 'react'
import { useMousePosition } from '../hooks/useMousePosition'
import puppyBody from '../assets/puppy-body.png'
import puppyEye from '../assets/puppy-eye.png'

/** Tune % if pupils drift vs your puppy-body export */
const LEFT_SOCKET = {
  top: '36%',
  left: '37%',
  width: '13%',
}
const RIGHT_SOCKET = {
  top: '36%',
  left: '58%',
  width: '13%',
}

const HEAD_YAW_MAX = 11
const HEAD_PITCH_MAX = 9
const EYE_X_RANGE = 15
const EYE_Y_RANGE = 11

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

function EyeSocket({ side, pupilRef, blinkNonce }) {
  const style =
    side === 'left'
      ? {
          top: LEFT_SOCKET.top,
          left: LEFT_SOCKET.left,
          width: LEFT_SOCKET.width,
          transform: 'translate(-50%, -50%)',
        }
      : {
          top: RIGHT_SOCKET.top,
          left: RIGHT_SOCKET.left,
          width: RIGHT_SOCKET.width,
          transform: 'translate(-50%, -50%)',
        }

  return (
    <div
      className="pointer-events-none absolute aspect-square overflow-hidden rounded-full"
      style={style}
    >
      <div
        ref={pupilRef}
        className="absolute inset-0 flex items-center justify-center will-change-transform"
      >
        <img
          src={puppyEye}
          alt=""
          className="h-[145%] w-[145%] max-w-none object-cover object-center select-none"
          draggable={false}
        />
      </div>
      {blinkNonce === 0 ? (
        <div
          className="absolute inset-0 origin-top scale-y-0 rounded-full bg-[#1a1208]/92"
          aria-hidden
        />
      ) : (
        <div
          key={`${side}-${blinkNonce}`}
          className="puppy-lid absolute inset-0 origin-top rounded-full bg-[#1a1208]/92"
          aria-hidden
        />
      )}
    </div>
  )
}

export default function PuppyMascot() {
  const containerRef = useRef(null)
  const headRef = useRef(null)
  const lerpedMouse = useMousePosition(containerRef)
  const eyeL = useRef(null)
  const eyeR = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  const [blinkNonce, setBlinkNonce] = useState(0)

  useEffect(() => {
    if (reducedMotion) return undefined

    let timeoutId
    const schedule = () => {
      const delay = 2000 + Math.random() * 4000
      timeoutId = window.setTimeout(() => {
        setBlinkNonce((n) => n + 1)
        schedule()
      }, delay)
    }
    schedule()
    return () => window.clearTimeout(timeoutId)
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion) {
      if (headRef.current) headRef.current.style.transform = ''
      if (eyeL.current) eyeL.current.style.transform = ''
      if (eyeR.current) eyeR.current.style.transform = ''
      return undefined
    }

    let frameId
    const tick = () => {
      const x = lerpedMouse.current.x
      const y = lerpedMouse.current.y

      const yaw = x * HEAD_YAW_MAX
      const pitch = -y * HEAD_PITCH_MAX
      if (headRef.current) {
        headRef.current.style.transform = `rotateX(${pitch}deg) rotateY(${yaw}deg)`
      }

      const ex = x * EYE_X_RANGE
      const ey = y * EYE_Y_RANGE
      const eyeTransform = `translate(${ex}px, ${ey}px)`
      if (eyeL.current) eyeL.current.style.transform = eyeTransform
      if (eyeR.current) eyeR.current.style.transform = eyeTransform

      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [lerpedMouse, reducedMotion])

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-[min(92vw,26rem)] md:w-[min(92vw,36rem)]"
      style={{ perspective: '1000px' }}
    >
      <div
        className="absolute aspect-square w-[85%] rounded-full bg-blue-500/20 blur-[100px] md:blur-[120px]"
        aria-hidden
      />

      <div
        className={`relative w-full ${reducedMotion ? '' : 'animate-float'}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          ref={headRef}
          className="relative w-full will-change-transform"
          style={{
            transformOrigin: '50% 62%',
            transformStyle: 'preserve-3d',
          }}
        >
          <img
            src={puppyBody}
            alt="Pawprint mascot puppy"
            className="relative z-0 block h-auto w-full select-none"
            draggable={false}
          />

          <div className="absolute inset-0 z-10">
            <EyeSocket side="left" pupilRef={eyeL} blinkNonce={blinkNonce} />
            <EyeSocket side="right" pupilRef={eyeR} blinkNonce={blinkNonce} />
          </div>
        </div>
      </div>
    </div>
  )
}
