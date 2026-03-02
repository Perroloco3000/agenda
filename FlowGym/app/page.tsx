"use client"

import { useState, useEffect } from "react"
import { useAppStore, WorkoutStat } from "@/lib/store"
import { dayNames, getCurrentDayKey } from "@/lib/workout-data"
import Link from "next/link"
import { DaySelector } from "@/components/day-selector"
import { F45Timer } from "@/components/f45-timer"
import { ExerciseList } from "@/components/exercise-list"
import { Button } from "@/components/ui/button"
import { Accessibility, Maximize2, ChevronLeft } from "lucide-react"

export default function GymApp() {
  const { workouts, isLoaded, gymName, slogan, logoUrl } = useAppStore()
  const [selectedDayKey, setSelectedDayKey] = useState<string>("")
  const [mode, setMode] = useState<'choice' | 'tv'>('choice')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  const phrases = [
    "Diseñando tu mejor versión...",
    "Calibrando el flujo de energía...",
    "Preparando el circuito del éxito...",
    "Sincronizando con tu potencial...",
    "Inspirando salud y equilibrio..."
  ]

  useEffect(() => {
    setIsMounted(true)
    setSelectedDayKey(getCurrentDayKey())
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Find the workout for the selected day in our Supabase data
  const selectedDayName = dayNames[selectedDayKey]
  const workoutFromStore = Array.isArray(workouts) ? workouts.find(w => w?.day === selectedDayName) : null

  // Map WorkoutStat to WorkoutDay format for components
  const currentWorkout = workoutFromStore ? {
    id: workoutFromStore.id || "temp",
    name: workoutFromStore.name || "Entrenamiento",
    type: (workoutFromStore.type?.toLowerCase() as any) || "cardio",
    color: workoutFromStore.color || "bg-primary",
    workTime: parseInt(String(workoutFromStore.work || "45")) || 45,
    restTime: parseInt(String(workoutFromStore.rest || "15")) || 15,
    sets: parseInt(String(workoutFromStore.stations || "3")) || 3,
    exercises: Array.isArray(workoutFromStore.exercises) ? workoutFromStore.exercises : [],
    hydrationInterval: 4,
    hydrationDuration: 30
  } : null

  if (!isLoaded || !isMounted) {
    return (
      <div className="h-screen w-screen bg-[#F5F1E6] flex flex-col items-center justify-center p-6 gap-8 animate-in fade-in duration-700">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-[#3B7552]/10 border-t-[#3B7552] animate-spin" />
          <Accessibility className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-[#3B7552]" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-black text-[#3E3A33] uppercase tracking-tighter">Cargando KaiCenter</p>
          <p className="text-[#3B7552] font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">
            {phrases[phraseIndex]}
          </p>
        </div>
      </div>
    )
  }

  if (mode === 'choice') {
    return (
      <div className="h-screen w-screen bg-[#F5F1E6] flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-1000">
        <div className="relative z-10 flex flex-col items-center gap-16 w-full max-w-4xl animate-in fade-in zoom-in duration-1000">
          <div className="flex flex-col items-center gap-0 text-center">
            <div className="w-full max-w-[550px] h-56 flex items-center justify-center mb-0 overflow-hidden rounded-full border-[10px] border-[#FCFBF6] shadow-[0_20px_50px_rgba(62,58,51,0.05)] bg-white/50">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <Accessibility className="h-20 w-20 text-[#3B7552]" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-4">
            <button
              onClick={() => setMode('tv')}
              className="group relative bg-[#FCFBF6] border-2 border-[#9B8C7A]/10 rounded-[2.5rem] p-12 flex flex-col items-center text-center gap-6 hover:border-[#3B7552]/40 transition-all duration-500 hover:scale-[1.02] shadow-[0_10px_30px_rgba(62,58,51,0.03)]"
            >
              <div className="w-20 h-20 rounded-3xl bg-[#3B7552]/10 flex items-center justify-center text-[#3B7552] group-hover:scale-110 transition-transform">
                <Maximize2 className="h-10 w-10" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-[#3E3A33] uppercase italic tracking-tight">Modo Pantalla</h3>
                <p className="text-[#3B7552]/70 font-bold mt-2">Circuito de ejercicios en alta resolución</p>
              </div>
            </button>

            <Link href="/dashboard" className="w-full">
              <div className="group relative bg-[#FCFBF6] border-2 border-[#9B8C7A]/10 rounded-[2.5rem] p-12 flex flex-col items-center text-center gap-6 hover:border-[#3B7552]/40 transition-all duration-500 hover:scale-[1.02] shadow-[0_10px_30px_rgba(62,58,51,0.03)] h-full">
                <div className="w-20 h-20 rounded-3xl bg-[#3B7552] flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-[#3B7552]/30">
                  <Accessibility className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-[#3E3A33] uppercase italic tracking-tight">Administrador</h3>
                  <p className="text-[#3B7552]/70 font-bold mt-2">Gestión de miembros y entrenamientos</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-[#3B7552]/30 text-xs font-black uppercase tracking-[0.5em] animate-pulse">
            {phrases[phraseIndex]}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-[#F5F1E6] overflow-hidden font-sans">
      <main className="h-full w-full">
        {currentWorkout ? (
          <F45Timer
            key={selectedDayKey}
            workout={currentWorkout}
            onBack={() => setMode('choice')}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-12 bg-[#F5F1E6]">
            <div className="text-9xl animate-bounce drop-shadow-xl">🧘‍♂️</div>
            <div className="space-y-4">
              <h2 className="text-5xl font-black uppercase tracking-tighter text-[#3E3A33]">Preparando el flujo...</h2>
              <p className="text-xl text-[#3B7552]/70 max-w-2xl mx-auto font-bold">No hemos encontrado una rutina para este día.</p>
            </div>
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-16 px-10 rounded-2xl font-black text-xl bg-[#3B7552] hover:bg-[#2d5a3f] shadow-lg shadow-[#3B7552]/20">Panel Control</Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setSelectedDayKey(getCurrentDayKey())}
                className="h-16 px-10 rounded-2xl font-black text-xl border-[#9B8C7A]/20 text-[#3E3A33] hover:bg-white/50"
              >
                Reintentar
              </Button>
            </div>
            <button
              onClick={() => setMode('choice')}
              className="group flex items-center gap-2 text-[#3B7552] font-black uppercase tracking-widest text-xs mt-16 transition-all hover:gap-3"
            >
              <ChevronLeft className="h-4 w-4" />
              Volver al inicio
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
