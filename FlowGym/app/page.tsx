"use client"

import { useState, useEffect } from "react"
import { useAppStore, WorkoutStat } from "@/lib/store"
import { dayNames, getCurrentDayKey } from "@/lib/workout-data"
import Link from "next/link"
import { DaySelector } from "@/components/day-selector"
import { F45Timer } from "@/components/f45-timer"
import { ExerciseList } from "@/components/exercise-list"
import { Button } from "@/components/ui/button"
import { Accessibility } from "lucide-react"

export default function GymApp() {
  const { workouts, isLoaded } = useAppStore()
  const [selectedDayKey, setSelectedDayKey] = useState<string>("")
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  const phrases = [
    "¡SIN EXCUSAS!",
    "¡TÚ PUEDES!",
    "KAICENTER POWER",
    "EL LÍMITE ES EL CIELO",
    "SUDOR = ÉXITO",
    "MÁS FUERTE CADA DÍA",
    "ENFOQUE Y DISCIPLINA"
  ]

  useEffect(() => {
    setIsMounted(true)
    setSelectedDayKey(getCurrentDayKey())
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [phrases.length])

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

  // Prevent hydration error by returning a placeholder or null during server-side render
  if (!isMounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-primary font-black text-2xl animate-pulse italic uppercase tracking-tighter">Cargando FlowGym...</div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden font-sans">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-md border-b border-border px-8 py-4 flex-none flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Accessibility className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">KaiCenter SC</h1>
            <p className="text-[10px] font-bold text-muted-foreground tracking-[0.3em] uppercase">Training Osteomuscular</p>
          </div>
        </div>

        {/* Motivational Phrases */}
        <div className="hidden md:block flex-1 text-center">
          <div className="inline-block px-6 py-2 rounded-full bg-primary/5 border border-primary/10">
            <p className="text-sm font-black text-primary animate-in fade-in slide-in-from-top-2 duration-1000" key={phraseIndex}>
              {phrases[phraseIndex]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" className="h-10 px-6 rounded-xl font-bold border-2 hover:bg-primary hover:text-primary-foreground transition-all">
              Dashboard Admin
            </Button>
          </Link>
          <div className="w-px h-6 bg-border mx-2" />
          <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-2xl border border-border/50">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-sm hidden sm:inline">Admin Eduardo</span>
          </div>
        </div>
      </header>

      {/* Main Content - 3 Panel Layout */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Panel - Day Selector */}
        <aside className="w-72 border-r border-border bg-card p-4 overflow-y-auto hidden md:block">
          <DaySelector
            selectedDay={selectedDayKey}
            onSelectDay={setSelectedDayKey}
          />
        </aside>

        {/* Center Panel - Timer */}
        <section className="flex-1 p-6 bg-background overflow-hidden flex flex-col">
          {currentWorkout ? (
            <F45Timer
              key={selectedDayKey}
              workout={currentWorkout}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="text-6xl animate-bounce">🏋️‍♂️</div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">Preparando el entrenamiento...</h2>
              <p className="text-muted-foreground max-w-md">No hemos encontrado una rutina para este día en el sistema. Asegúrate de configurarla en el panel de control.</p>
            </div>
          )}
        </section>

        {/* Right Panel - Exercise List */}
        <aside className="w-80 border-l border-border bg-card p-4 overflow-y-auto hidden lg:block">
          {currentWorkout && <ExerciseList workout={currentWorkout} />}
        </aside>
      </main>
    </div>
  )
}
