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
        <div className="text-primary font-black text-2xl animate-pulse italic uppercase tracking-tighter">Cargando Kai Center...</div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-background overflow-hidden font-sans">
      <main className="h-full w-full">
        {currentWorkout ? (
          <F45Timer
            key={selectedDayKey}
            workout={currentWorkout}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-12">
            <div className="text-8xl animate-bounce">🏋️‍♂️</div>
            <h2 className="text-5xl font-black uppercase tracking-tighter">Preparando el entrenamiento...</h2>
            <p className="text-2xl text-muted-foreground max-w-2xl">No hemos encontrado una rutina para este día en el sistema. Asegúrate de configurarla en el panel de control.</p>
            <div className="mt-8 flex gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-16 px-10 rounded-2xl font-black text-xl">Dashboard Admin</Button>
              </Link>
              <Button size="lg" variant="outline" onClick={() => setSelectedDayKey(getCurrentDayKey())} className="h-16 px-10 rounded-2xl font-black text-xl">Reintentar</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
