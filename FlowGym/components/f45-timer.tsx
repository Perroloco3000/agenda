"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { Play, Pause, RotateCcw, Volume2, VolumeX, Coffee, Maximize2, Armchair, Dumbbell, Timer, Zap, Move, Heart, Home, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { WorkoutDay, Exercise } from "@/lib/workout-data"

type TimerPhase = "warmup" | "strength" | "hydration" | "movement" | "stretching" | "finished" | "countdown"

interface F45TimerProps {
  workout: WorkoutDay
  onBack?: () => void
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

export function F45Timer({ workout, onBack }: F45TimerProps) {
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
            return 0
          }
          if (prev <= 4) playTone(880, 'sine', 0.1, 0.2)
          return prev - 1
        })
      }, 1000)
    }
    return () => { if (interval) clearInterval(interval) }
  }, [isRunning, phase, playTone])

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
      case "strength": return { label: "Fuerza y Movimiento", icon: <Dumbbell />, color: "from-blue-600 to-indigo-700" }
      case "hydration": return { label: "Hidratación", icon: <Coffee />, color: "from-cyan-400 to-blue-500" }
      case "movement": return { label: "Fuerza y Movimiento", icon: <Move />, color: "from-purple-600 to-pink-600" }
      case "stretching": return { label: "Estiramiento Final", icon: <Heart />, color: "from-emerald-500 to-teal-600" }
      case "countdown": return { label: "Prepárate", icon: <Timer />, color: "from-gray-700 to-gray-900" }
      default: return { label: "Completado", icon: <Zap />, color: "from-slate-700 to-slate-900" }
    }
  }

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0].split("&")[0];
    } else if (url.includes("v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1].split("?")[0];
    }

    if (!videoId) return url;
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0&disablekb=1&iv_load_policy=3&fs=0&playlist=${videoId}`;
  };

  const config = getPhaseConfig()

  const renderExerciseBlocks = (startIndex: number) => {
    const blocks = exercises.slice(startIndex, startIndex + 4)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full p-6 overflow-hidden">
        {blocks.map((ex, idx) => (
          <div key={ex.id || idx} className="relative bg-white rounded-[2.5rem] overflow-hidden border-2 border-white/20 flex flex-col shadow-2xl transition-all duration-300">
            <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-xl px-6 py-2 rounded-full border border-black/10 shadow-lg">
              <span className="text-black font-black italic uppercase text-lg">Estación {idx + 1}</span>
            </div>
            <div className="relative w-full aspect-video bg-white overflow-hidden">
              {ex.videoUrl ? (
                (() => {
                  const isDirectVideo = ex.videoUrl.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || ex.videoUrl.includes('supabase.co/storage/v1/object/public/');

                  if (isDirectVideo) {
                    return (
                      <video
                        src={ex.videoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    );
                  }

                  return (
                    <iframe
                      src={getYoutubeEmbedUrl(ex.videoUrl)}
                      className="absolute inset-0 w-full h-full pointer-events-none scale-[1.01]"
                      allow="autoplay; encrypted-media"
                      style={{ border: 'none' }}
                    ></iframe>
                  );
                })()
              ) : (
                <img src={ex.gifUrl} className="w-full h-full object-cover" alt={ex.name} />
              )}
              {/* Floating Exercise Name Tag */}
              <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur-xl px-6 py-2 rounded-full border border-black/10 shadow-lg max-w-[80%]">
                <span className="text-black font-black italic uppercase text-xl truncate block">{ex.name}</span>
              </div>
            </div>
          </div>
        ))}
        {blocks.length < 4 && Array.from({ length: 4 - blocks.length }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-white/10 rounded-[2.5rem] border-2 border-dashed border-white/20 flex items-center justify-center aspect-video">
            <Dumbbell className="text-white/20 w-24 h-24" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={rootRef} className={`flex flex-col h-screen w-screen relative overflow-hidden bg-gradient-to-br ${config.color} text-white font-sans`}>
      {/* Top Bar: Timer & Progress */}
      <div className="relative z-10 w-full p-3 flex flex-col items-center gap-1 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="w-full flex justify-between items-center px-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                onClick={onBack}
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-white transition-all active:scale-90"
              >
                <Home className="h-5 w-5" />
              </Button>
            )}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-[1.5rem] border border-white/20 shadow-xl">
                {React.cloneElement(config.icon as React.ReactElement, { className: "w-6 h-6" })}
              </div>
              <div>
                <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{config.label}</h2>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.5em] mt-1">CIRCUITO KAI CENTER</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-8xl font-black tabular-nums tracking-tighter leading-none drop-shadow-2xl">
                {formatTime(timeLeft)}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">TIEMPO RESTANTE</span>
            </div>
            {phase !== "finished" && (
              <Button
                onClick={moveToNextPhase}
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-white transition-all active:scale-90 shadow-lg"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}
          </div>
        </div>

        {/* Global Progress Bar with Maximum Neon Glow */}
        <div className="w-full max-w-5xl flex gap-1 h-5 px-4 mt-1">
          {["warmup", "strength", "hydration", "movement", "stretching"].map((p, i) => {
            const sequence = ["warmup", "strength", "hydration", "movement", "stretching"];
            const currentIdx = sequence.indexOf(phase);
            const isCompleted = i < currentIdx;
            const isCurrent = i === currentIdx;

            return (
              <div key={p} className="flex-1 relative h-full rounded-full bg-white/5 overflow-hidden border border-white/10">
                <div
                  className={`absolute inset-0 transition-all duration-1000 ${isCompleted
                    ? 'bg-white shadow-[0_0_25px_rgba(255,255,255,1),0_0_10px_rgba(255,255,255,0.8)]'
                    : isCurrent
                      ? 'bg-white animate-pulse shadow-[0_0_40px_rgba(255,255,255,1),0_0_20px_rgba(255,255,255,1),0_0_10px_rgba(255,255,255,0.8)]'
                      : 'bg-transparent'
                    }`}
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
