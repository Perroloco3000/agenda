"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Play, Pause, RotateCcw, Volume2, VolumeX, Coffee, Maximize2, Armchair, Dumbbell, Timer, Zap, Move, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { WorkoutDay, Exercise } from "@/lib/workout-data"

type TimerPhase = "warmup" | "strength" | "hydration" | "movement" | "stretching" | "finished" | "countdown"

interface F45TimerProps {
  workout: WorkoutDay
}

const DURATIONS: Record<TimerPhase, number> = {
  warmup: 600,
  strength: 1200,
  hydration: 60,
  movement: 1200,
  stretching: 540,
  finished: 0,
  countdown: 10
}

export function F45Timer({ workout }: F45TimerProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState<TimerPhase>("warmup")
  const [timeLeft, setTimeLeft] = useState(DURATIONS.warmup)
  const [isMuted, setIsMuted] = useState(false)
  const [audioInitialized, setAudioInitialized] = useState(false)

  // Refs
  const audioContext = useRef<AudioContext | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const exercises = Array.isArray(workout.exercises) ? workout.exercises : []

  const initAudio = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }
    setAudioInitialized(true);
  }, []);

  const playTone = useCallback((frequency: number, type: 'sine' | 'triangle' | 'square' | 'sawtooth', duration: number, volume: number = 0.5) => {
    if (isMuted || !audioContext.current) return;
    const ctx = audioContext.current;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }, [isMuted]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && rootRef.current) {
      rootRef.current.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setPhase("warmup")
    setTimeLeft(DURATIONS.warmup)
  }, [])

  const moveToNextPhase = useCallback(() => {
    const sequence: TimerPhase[] = ["warmup", "strength", "hydration", "movement", "stretching", "finished"]
    const currentIndex = sequence.indexOf(phase)

    if (currentIndex < sequence.length - 1) {
      const nextPhase = sequence[currentIndex + 1]
      setPhase(nextPhase)
      setTimeLeft(DURATIONS[nextPhase])

      // Phase Change Sound
      playTone(440, 'triangle', 0.5, 0.4);
      setTimeout(() => playTone(554.37, 'triangle', 0.5, 0.4), 50);
      setTimeout(() => playTone(659.25, 'triangle', 0.5, 0.4), 100);
    } else {
      setPhase("finished")
      setIsRunning(false)
    }
  }, [phase, playTone])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning && phase !== "finished") {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Don't call moveToNextPhase here to avoid race conditions
            return 0
          }
          if (prev <= 4) playTone(880, 'sine', 0.1, 0.2)
          return prev - 1
        })
      }, 1000)
    }
    return () => { if (interval) clearInterval(interval) }
  }, [isRunning, phase, playTone])

  // Separate effect to handle phase transitions when timeLeft reaches 0
  useEffect(() => {
    if (timeLeft === 0 && phase !== "finished" && isRunning) {
      moveToNextPhase()
    }
  }, [timeLeft, phase, isRunning, moveToNextPhase])

  if (!isMounted) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const getPhaseConfig = () => {
    switch (phase) {
      case "warmup": return { label: "Estiramiento y Calentamiento", icon: <Zap />, color: "from-orange-500 to-red-600" }
      case "strength": return { label: "Bloque 1: Fuerza", icon: <Dumbbell />, color: "from-blue-600 to-indigo-700" }
      case "hydration": return { label: "Hidratación", icon: <Coffee />, color: "from-cyan-400 to-blue-500" }
      case "movement": return { label: "Bloque 2: Movimiento", icon: <Move />, color: "from-purple-600 to-pink-600" }
      case "stretching": return { label: "Estiramiento Final", icon: <Heart />, color: "from-emerald-500 to-teal-600" }
      case "countdown": return { label: "Prepárate", icon: <Timer />, color: "from-gray-700 to-gray-900" }
      default: return { label: "Completado", icon: <Zap />, color: "from-slate-700 to-slate-900" }
    }
  }

  const config = getPhaseConfig()

  // Exercise Rendering for 4-Block Layout
  const renderExerciseBlocks = (startIndex: number) => {
    const blocks = exercises.slice(startIndex, startIndex + 4)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full p-4 overflow-hidden">
        {blocks.map((ex, idx) => (
          <div key={ex.id || idx} className="relative bg-black/20 rounded-[2.5rem] overflow-hidden border-2 border-white/10 flex flex-col shadow-2xl">
            <div className="absolute top-6 left-6 z-20 bg-black/60 backdrop-blur-xl px-6 py-2 rounded-full border border-white/20">
              <span className="text-white font-black italic uppercase text-lg">Estación {idx + 1}</span>
            </div>
            <div className="flex-1 relative bg-black">
              {ex.videoUrl ? (
                <iframe
                  src={ex.videoUrl.replace("watch?v=", "embed/").split("&")[0] + "?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0&disablekb=1&playlist=" + (ex.videoUrl.includes("v=") ? ex.videoUrl.split("v=")[1].split("&")[0] : "")}
                  className="absolute inset-0 w-full h-full pointer-events-none object-cover scale-110"
                  allow="autoplay; encrypted-media"
                ></iframe>
              ) : (
                <img src={ex.gifUrl} className="w-full h-full object-cover" alt={ex.name} />
              )}
            </div>
            <div className="bg-black/60 backdrop-blur-2xl p-6 text-center border-t border-white/10">
              <h4 className="text-white text-3xl font-black uppercase italic tracking-tighter truncate">{ex.name}</h4>
            </div>
          </div>
        ))}
        {blocks.length < 4 && Array.from({ length: 4 - blocks.length }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-black/10 rounded-[2.5rem] border-2 border-dashed border-white/5 flex items-center justify-center">
            <Dumbbell className="text-white/5 w-24 h-24" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={rootRef} className={`flex flex-col h-screen w-screen relative overflow-hidden bg-gradient-to-br ${config.color} text-white font-sans`}>

      {/* Top Bar: Timer & Progress */}
      <div className="relative z-10 w-full p-6 flex flex-col items-center gap-4 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="w-full max-w-6xl flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/10 rounded-[2rem] border border-white/20 shadow-xl">
              {config.icon}
            </div>
            <div>
              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">{config.label}</h2>
              <p className="text-white/60 text-sm font-black uppercase tracking-[0.5em] mt-3">CIRCUITO KAI CENTER</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {phase === "warmup" && isRunning && (
                <Button 
                    variant="ghost" 
                    onClick={moveToNextPhase}
                    className="text-white/20 hover:text-white/80 uppercase tracking-[0.3em] font-black text-[10px] border border-white/5 rounded-full px-4 py-1.5 hover:bg-white/5 transition-all"
                >
                    NEXT
                </Button>
            )}
            <div className="flex flex-col items-end">
            <span className="text-9xl font-black tabular-nums tracking-tighter leading-none drop-shadow-2xl">
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm font-black uppercase tracking-[0.4em] text-white/50 mt-2">TIEMPO RESTANTE</span>
          </div>
        </div>
      </div>

      {/* Global Progress Bar */}
        <div className="w-full max-w-4xl flex gap-1.5 h-1.5 px-4">
          {["warmup", "strength", "hydration", "movement", "stretching"].map((p, i) => {
            const sequence = ["warmup", "strength", "hydration", "movement", "stretching"];
            const currentIdx = sequence.indexOf(phase);
            const isCompleted = i < currentIdx;
            const isCurrent = i === currentIdx;

            return (
              <div key={p} className="flex-1 relative h-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`absolute inset-0 transition-all duration-1000 ${isCompleted ? 'bg-white' : isCurrent ? 'bg-white animate-pulse' : 'bg-transparent'}`}
                  style={{ width: isCurrent ? `${((DURATIONS[p as TimerPhase] - timeLeft) / DURATIONS[p as TimerPhase]) * 100}%` : isCompleted ? '100%' : '0%' }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex items-center justify-center min-h-0">
        {phase === "warmup" || phase === "hydration" || phase === "stretching" ? (
          <div className="flex flex-col items-center justify-center gap-8 animate-in zoom-in duration-700">
            <div className="w-64 h-64 rounded-full bg-white/5 flex items-center justify-center border-4 border-white/10 shadow-2xl relative">
              <div className="absolute inset-0 rounded-full border-4 border-white/20 border-t-white animate-spin-slow" />
              {phase === "warmup" ? <Zap className="w-32 h-32 text-orange-400" /> :
                phase === "hydration" ? <Coffee className="w-32 h-32 text-cyan-300" /> :
                  <Heart className="w-32 h-32 text-emerald-400" />}
            </div>
            <h3 className="text-6xl font-black uppercase italic tracking-tighter text-center max-w-2xl px-8 drop-shadow-lg">
              {phase === "warmup" ? "¡PREPÁRATE PARA EL SUDOR!" :
                phase === "hydration" ? "RECUPERA Y BEBE AGUA" :
                  "¡EXCELENTE TRABAJO! RELÁJATE"}
            </h3>
          </div>
        ) : phase === "strength" ? (
          renderExerciseBlocks(0)
        ) : phase === "movement" ? (
          renderExerciseBlocks(4)
        ) : (
          <div className="flex flex-col items-center justify-center gap-6">
            <h2 className="text-9xl font-black italic uppercase tracking-tighter">¡LISTO!</h2>
            <Button size="lg" onClick={resetTimer} className="h-16 px-12 rounded-full bg-white text-black font-black text-xl hover:scale-110 transition-all">REINICIAR</Button>
          </div>
        )}
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-black/40 backdrop-blur-2xl p-3 rounded-full border border-white/10 shadow-2xl transition-all duration-500 opacity-0 hover:opacity-100 translate-y-4 hover:translate-y-0">
        <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} className="h-12 w-12 rounded-full hover:bg-white/20">
          {isMuted ? <VolumeX className="text-red-400" /> : <Volume2 />}
        </Button>
        <Button
          onClick={() => { if (!audioInitialized) initAudio(); setIsRunning(!isRunning); }}
          className={`h-16 px-10 rounded-full font-black italic text-xl transition-all active:scale-90 ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-white text-black'}`}
        >
          {isRunning ? <Pause className="fill-current mr-2" /> : <Play className="fill-current mr-2" />}
          {isRunning ? "PAUSA" : "INICIAR"}
        </Button>
        <Button variant="ghost" size="icon" onClick={resetTimer} className="h-12 w-12 rounded-full hover:bg-white/20">
          <RotateCcw />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="h-12 w-12 rounded-full hover:bg-white/20">
          <Maximize2 />
        </Button>
      </div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
