import { useEffect, useRef, useState } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

import frame00 from '../assets/frame_00.png'
import frame01 from '../assets/frame_01.png'
import frame02 from '../assets/frame_02.png'
import frame03 from '../assets/frame_03.png'
import frame04 from '../assets/frame_04.png'
import frame05 from '../assets/frame_05.png'

const FRAME_SRCS = [
  frame00,
  frame01,
  frame02,
  frame03,
  frame04,
  frame05,
]

export default function VideoScrubber() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  const [frames, setFrames] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  const cursorXProgress = useMotionValue(0.5)
  const smoothXProgress = useSpring(cursorXProgress, {
    damping: 35,
    stiffness: 200,
    restDelta: 0.001,
  })

  useEffect(() => {
    let loadedCount = 0
    const loadedImages = []

    FRAME_SRCS.forEach((src, index) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        loadedImages[index] = img
        loadedCount++
        setProgress(Math.round((loadedCount / FRAME_SRCS.length) * 100))

        if (loadedCount === FRAME_SRCS.length) {
          setFrames(loadedImages)
          setIsLoading(false)
        }
      }
      img.onerror = () => {
        console.error(`Failed to load frame at: ${src}`)
      }
    })
  }, [])

  useEffect(() => {
    if (isLoading || frames.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const unsubscribe = smoothXProgress.on('change', (latest) => {
      const clamped = Math.max(0, Math.min(1, latest))
      const targetFrameFloat = clamped * (frames.length - 1)
      const baseFrameIndex = Math.floor(targetFrameFloat)
      const nextFrameIndex = Math.min(baseFrameIndex + 1, frames.length - 1)
      const interpolationFactor = targetFrameFloat - baseFrameIndex

      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)

      const baseImg = frames[baseFrameIndex]
      const nextImg = frames[nextFrameIndex]

      if (baseImg && nextImg) {
        ctx.globalAlpha = 1
        ctx.drawImage(baseImg, 0, 0, w, h)

        if (interpolationFactor > 0) {
          ctx.globalAlpha = interpolationFactor
          ctx.drawImage(nextImg, 0, 0, w, h)
        }
      }
    })

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      unsubscribe()
    }
  }, [isLoading, frames, smoothXProgress])

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    cursorXProgress.set(x / rect.width)
  }

  const handleMouseLeave = () => {
    cursorXProgress.set(0.5)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 select-none">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative aspect-[16/9] w-full max-w-4xl cursor-ew-resize overflow-hidden rounded-xl bg-white"
      >
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white text-neutral-800">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-800" />
            <p className="text-sm font-medium tracking-wide">
              Loading Assets {progress}%
            </p>
          </div>
        ) : (
          <canvas ref={canvasRef} className="h-full w-full object-contain" />
        )}
      </div>

      {!isLoading && (
        <p className="pointer-events-none mt-6 text-xs tracking-wider text-neutral-400 uppercase">
          Move your cursor horizontally to steer attention
        </p>
      )}
    </div>
  )
}
