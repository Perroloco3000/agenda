"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Play, Pause, RotateCcw, Volume2, VolumeX, Coffee, Maximize2, Droplets, Armchair } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { WorkoutDay, Exercise } from "@/lib/workout-data"

type TimerPhase = "work" | "rest" | "hydration" | "countdown" | "finished"

interface F45TimerProps {
  workout: WorkoutDay
}

export function F45Timer({ workout }: F45TimerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [currentSet, setCurrentSet] = useState(1)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [phase, setPhase] = useState<TimerPhase>("countdown")
  const [timeLeft, setTimeLeft] = useState(5)
  const [isMuted, setIsMuted] = useState(false)
  const [audioInitialized, setAudioInitialized] = useState(false)

  // Refs
  const audioContext = useRef<AudioContext | null>(null)
  // We target the root div for fullscreen now to include buttons
  const rootRef = useRef<HTMLDivElement>(null)

  // Sunday / Rest Day Logic
  if (workout.id === 'sunday' || workout.type === 'rest' || workout.exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-8">
        <div className="bg-slate-800 p-12 rounded-[3rem] border border-slate-700 shadow-2xl text-center max-w-2xl animate-in zoom-in duration-500">
          <div className="w-32 h-32 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Armchair className="h-16 w-16 text-emerald-400" />
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Domingo de Descanso</h1>
          <p className="text-xl text-slate-400 font-medium">Recupérate, hidrátate y prepárate para una nueva semana de éxitos.</p>
          <p className="mt-8 text-sm uppercase tracking-widest text-slate-500 font-bold">Nos vemos el Lunes</p>
        </div>
      </div>
    )
  }

  const totalExercises = workout.exercises?.length || 0
  const currentExercise = workout.exercises && currentExerciseIndex < totalExercises
    ? workout.exercises[currentExerciseIndex]
    : workout.exercises?.[0]

  // Next Exercise Calculation
  const nextExerciseIndex = currentExerciseIndex + 1 < totalExercises ? currentExerciseIndex + 1 : 0
  const nextUpExercise = workout.exercises && nextExerciseIndex < totalExercises ? workout.exercises[nextExerciseIndex] : null


  // Initialize Audio Context
  const initAudio = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }
    setAudioInitialized(true);
  }, []);

  // Fullscreen toggle logic - Targets ROOT to include controls
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && rootRef.current) {
      rootRef.current.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable full-screen mode: ${e.message} (${e.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // UPDATED AUDIO: More pleasant/modern sounds
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

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setCurrentSet(1)
    setCurrentExerciseIndex(0)
    setPhase("countdown")
    setTimeLeft(5)
  }, [])

  const moveToNextPhase = useCallback(() => {
    if (phase === "countdown") {
      setPhase("work")
      setTimeLeft(workout.workTime)
      // Work Start: Energetic Chord
      playTone(440, 'triangle', 0.5, 0.4); // A4
      setTimeout(() => playTone(554.37, 'triangle', 0.5, 0.4), 50); // C#5
      setTimeout(() => playTone(659.25, 'triangle', 0.5, 0.4), 100); // E5
    } else if (phase === "work") {
      const isLastExercise = currentExerciseIndex === totalExercises - 1
      const isLastSet = currentSet === workout.sets

      if (isLastExercise && isLastSet) {
        setPhase("finished")
        setIsRunning(false)
        // Victory Fanfare
        playTone(523.25, 'square', 0.6); // C5
        setTimeout(() => playTone(659.25, 'square', 0.6), 200); // E5
        setTimeout(() => playTone(783.99, 'square', 0.6), 400); // G5
        setTimeout(() => playTone(1046.50, 'square', 1.0), 600); // C6
      } else {
        const exercisesCompleted = currentExerciseIndex + 1
        if (workout.hydrationInterval && workout.hydrationDuration &&
          exercisesCompleted % workout.hydrationInterval === 0 &&
          exercisesCompleted < totalExercises) {
          setPhase("hydration")
          setTimeLeft(workout.hydrationDuration)
          playTone(600, 'sine', 0.8, 0.3); // Hydration bell
        } else {
          setPhase("rest")
          setTimeLeft(workout.restTime)
          // Rest Start: Descending "relax" tone
          playTone(440, 'sine', 0.4, 0.3);
          setTimeout(() => playTone(349.23, 'sine', 0.6, 0.3), 100);
        }
      }
    } else if (phase === "rest" || phase === "hydration") {
      if (currentExerciseIndex < totalExercises - 1) {
        setCurrentExerciseIndex(prev => prev + 1)
      } else {
        setCurrentSet(prev => prev + 1)
        setCurrentExerciseIndex(0)
      }
      setPhase("work")
      setTimeLeft(workout.workTime)
      // Back to Work
      playTone(440, 'triangle', 0.5, 0.4);
      setTimeout(() => playTone(554.37, 'triangle', 0.5, 0.4), 50);
      setTimeout(() => playTone(659.25, 'triangle', 0.5, 0.4), 100);
    }
  }, [phase, workout, currentSet, currentExerciseIndex, totalExercises, playTone])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && phase !== "finished") {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            moveToNextPhase()
            return prev
          }
          // Countdown beeps (3, 2, 1) - Softer beep
          if (prev <= 4 && prev > 1) {
            playTone(880, 'sine', 0.1, 0.2)
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, phase, moveToNextPhase, playTone])

  // Helpers for dynamic styling
  const getPhaseColor = () => {
    switch (phase) {
      case "countdown": return "bg-gradient-to-br from-white to-slate-200 text-slate-900"
      case "work": return "bg-gradient-to-br from-purple-500 to-indigo-600 text-white" // NEW Lilac/Purple Gradient
      case "rest": return "bg-blue-600 text-white"
      case "hydration": return "bg-cyan-500 text-white"
      case "finished": return "bg-green-500 text-white"
      default: return "bg-primary text-white"
    }
  }

  const getPhaseText = () => {
    switch (phase) {
      case "countdown": return "PREPÁRATE"
      case "work": return "TRABAJO"
      case "rest": return "DESCANSO"
      case "hydration": return "HIDRATACIÓN"
      case "finished": return "COMPLETADO"
      default: return ""
    }
  }

  // Calculate percentages for rings/bars
  const maxTime = phase === "work" ? workout.workTime :
    phase === "rest" ? workout.restTime :
      phase === "hydration" ? (workout.hydrationDuration || 30) :
        phase === "countdown" ? 5 : 100;

  const progress = (timeLeft / maxTime) * 100
  const radius = 120
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div
      ref={rootRef} // Root ref for fullscreen
      className={`flex flex-col h-[100vh] max-h-[100vh] relative overflow-hidden font-sans transition-colors duration-500 ${getPhaseColor()}`}
    >

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 p-4 shrink-0 flex justify-between items-start">

        {/* LEFT: Phase Title */}
        <div className="bg-black/10 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/10 shadow-sm animate-in slide-in-from-top-4 fade-in duration-500">
          <h2 className={`text-2xl font-black italic uppercase tracking-tighter ${phase === 'countdown' ? 'text-slate-800' : 'text-white'}`}>{getPhaseText()}</h2>
          <p className={`text-xs font-bold uppercase tracking-widest ${phase === 'countdown' ? 'text-slate-600' : 'text-white/60'}`}>{workout.name}</p>
        </div>

        {/* RIGHT/OPPOSITE: Next Exercise Alert (Matching Style) */}
        {(phase === 'rest' || phase === 'hydration') && nextUpExercise && (
          <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/20 shadow-sm animate-in slide-in-from-right-4 fade-in duration-500 flex flex-col items-end">
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-0.5">Próximo Ejercicio</p>
            <div className="flex items-center gap-3">
              <span className="text-white text-lg font-black uppercase italic tracking-tight truncate max-w-[200px] text-right leading-none">{nextUpExercise.name}</span>
              {nextUpExercise.gifUrl && (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20 border border-white/30">
                  <img src={nextUpExercise.gifUrl} className="w-full h-full object-cover" alt="next" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 p-4 min-h-0 relative z-10">

        {/* Circular Timer (Left Side) */}
        <div className="relative group shrink-0 transform scale-75 md:scale-100 transition-transform">
          <svg width="320" height="320" className="transform -rotate-90 drop-shadow-md">
            <circle
              cx="160" cy="160" r={radius}
              stroke={phase === 'countdown' ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)"}
              strokeWidth="24"
              fill="transparent"
            />
            <circle
              cx="160" cy="160" r={radius}
              stroke={phase === 'countdown' ? "#334155" : "#22c55e"} // Green
              strokeWidth="24"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-9xl font-black tabular-nums tracking-tighter leading-none ${phase === 'countdown' ? 'text-slate-900' : 'text-white'}`}>
              {timeLeft}
            </span>
            <span className={`font-bold uppercase tracking-widest mt-2 text-sm ${phase === 'countdown' ? 'text-slate-600' : 'text-white/80'}`}>
              {phase === 'work' ? 'GO!' : 'WAIT'}
            </span>
          </div>
        </div>

        {/* Exercise Card (Right Side) - Maximized, Rounded Corners */}
        <div className="flex-1 h-full w-full max-w-5xl flex flex-col items-center justify-center relative min-h-0">

          {currentExercise && phase !== 'finished' ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <h3 className={`text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 text-center drop-shadow-md ${phase === 'countdown' ? 'text-slate-900' : 'text-white'}`}>
                {currentExercise.name}
              </h3>

              {/* Water Drop Indicator during Rest */}
              {phase === 'rest' && (
                <div className="mb-4 animate-bounce">
                  <Droplets className="h-12 w-12 text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                </div>
              )}

              <div className="w-full flex-1 min-h-0 relative flex items-center justify-center">
                {currentExercise.gifUrl && (
                  <img
                    src={currentExercise.gifUrl}
                    alt={currentExercise.name}
                    className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-screen rounded-[2rem] shadow-lg" // Added rounded corners and slight shadow
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center h-full animate-bounce">
              <h2 className="text-6xl font-black text-white uppercase italic">¡CONGRATULATIONS!</h2>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className={`relative z-10 shrink-0 p-4 flex flex-col items-center gap-4 ${phase === 'countdown' ? 'bg-white/50 border-slate-200' : 'bg-white/5 border-white/10'} backdrop-blur-md border-t`}>

        {/* Progress Bar */}
        {/* Segmented Progress Bar */}
        <div className="w-full max-w-3xl flex items-center gap-1 h-2">
          {Array.from({ length: workout.sets * totalExercises }).map((_, i) => {
            const isActive = i < ((currentSet - 1) * totalExercises + currentExerciseIndex + (phase === 'rest' || phase === 'hydration' ? 0.5 : 1));
            const isHydration = workout.hydrationInterval && (i + 1) % workout.hydrationInterval === 0 && (i + 1) < (workout.sets * totalExercises);

            return (
              <div
                key={i}
                className={`flex-1 h-full rounded-full transition-all duration-500 ${isActive
                    ? (phase === 'countdown' ? 'bg-slate-800' : 'bg-white shadow-[0_0_10px_white]')
                    : (phase === 'countdown' ? 'bg-slate-300' : 'bg-white/20')
                  } ${isHydration ? 'relative' : ''}`}
              >
                {isHydration && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px]">💧</div>}
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className={`h-14 w-14 rounded-full border-2 ${phase === 'countdown' ? 'border-slate-300 text-slate-700 hover:bg-slate-200' : 'border-white/10 bg-white/10 text-white hover:bg-white/20'}`}
          >
            {isMuted ? <VolumeX className="h-6 w-6 text-red-400" /> : <Volume2 className="h-6 w-6" />}
          </Button>

          <Button
            onClick={() => {
              if (!audioInitialized) initAudio();
              setIsRunning(!isRunning);
            }}
            className={`h-20 px-12 rounded-full shadow-xl transition-all active:scale-95 hover:scale-105 text-3xl font-black italic tracking-tighter ${isRunning
              ? "bg-gradient-to-br from-red-500 to-red-700 text-white ring-4 ring-offset-2 ring-offset-transparent ring-red-500/50"
              : "bg-gradient-to-br from-green-400 to-green-600 text-white ring-4 ring-offset-2 ring-offset-transparent ring-green-500/50"
              }`}
          >
            {isRunning ? (
              <span className="flex items-center gap-3"><Pause className="fill-current h-8 w-8" /> PAUSA</span>
            ) : (
              <span className="flex items-center gap-3"><Play className="fill-current h-8 w-8" /> ENTRENAR</span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={resetTimer}
            className={`h-14 w-14 rounded-full border-2 ${phase === 'countdown' ? 'border-slate-300 text-slate-700 hover:bg-slate-200' : 'border-white/10 bg-white/10 text-white hover:bg-white/20'}`}
          >
            <RotateCcw className="h-6 w-6 transition-transform hover:-rotate-180 duration-500" />
          </Button>

          {/* Fullscreen Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className={`h-14 w-14 rounded-full border-2 ${phase === 'countdown' ? 'border-slate-300 text-slate-700 hover:bg-slate-200' : 'border-white/10 bg-white/10 text-white hover:bg-white/20'}`}
          >
            <Maximize2 className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
