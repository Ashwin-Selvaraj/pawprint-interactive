import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import PuppyMascot from './components/PuppyMascot'

export default function App() {
  return (
    <div className="selection:bg-blue-500/40 min-h-screen overflow-hidden bg-[#050505] font-sans text-white">
      <Navbar />

      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
      >
        <div className="absolute top-1/4 left-1/4 h-1 w-1 animate-ping rounded-full bg-white" />
        <div
          className="absolute top-3/4 left-2/3 h-1 w-1 animate-ping rounded-full bg-white"
          style={{ animationDelay: '0.7s' }}
        />
      </div>

      <section className="relative z-10 flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <PuppyMascot />
        </motion.div>

        <motion.div
          className="mt-10 text-center md:mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
        >
          <h1 className="bg-gradient-to-b from-white to-gray-500 bg-clip-text text-5xl font-black tracking-tighter text-transparent italic md:text-8xl">
            DIGITAL PAW
          </h1>
          <p className="mt-4 text-lg font-light tracking-widest text-gray-400 uppercase md:text-xl">
            Interactive Loyalty • Built for Tomorrow
          </p>

          <button
            type="button"
            className="mt-8 rounded-full bg-white px-10 py-4 font-bold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.35)] active:scale-95"
          >
            GET STARTED
          </button>
        </motion.div>
      </section>
    </div>
  )
}
