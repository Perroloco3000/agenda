"use client"

import { useState, useEffect } from "react"
import { useAppStore, WorkoutStat } from "@/lib/store"
import { dayNames, getCurrentDayKey } from "@/lib/workout-data"
import Link from "next/link"
import { DaySelector } from "@/components/day-selector"
import { F45Timer } from "@/components/f45-timer"
import { ExerciseList } from "@/components/exercise-list"
import { Button } from "@/components/ui/button"
import { Accessibility, Maximize2, ChevronLeft, Sparkles, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const FallingLeaves = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            y: -100,
            x: Math.random() * 100 + "%",
            rotate: 0,
          }}
          animate={{
            opacity: [0, 0.4, 0.4, 0],
            y: "110vh",
            x: [null, (Math.random() - 0.5) * 20 + "%"],
            rotate: 360,
          }}
          transition={{
            duration: 12 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 15,
            ease: "linear",
          }}
          className="absolute"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#3B7552]/20"
          >
            <path
              d="M12 2L10.5 4.5L12 7L13.5 4.5L12 2Z"
              fill="currentColor"
            />
            <path
              d="M12 7C12 7 6 10 6 15C6 19 12 21 12 21C12 21 18 19 18 15C18 10 12 7 12 7Z"
              fill="currentColor"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

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
        <FallingLeaves />
        <div className="relative">
          <div className="w-24 h-24 rounded-xl border-4 border-[#3B7552]/10 border-t-[#3B7552] animate-spin" />
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
      <div className="min-h-screen bg-[#F5F1E6] selection:bg-[#3B7552]/30 overflow-hidden flex items-center justify-center p-4 transition-colors duration-1000 relative">
        <FallingLeaves />

        {/* Background Aesthetic */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#3B7552]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#3B7552]/10 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-2xl relative z-30"
        >
          {/* Brand Header */}
          <div className="flex flex-col items-center mb-12">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full max-w-[550px] h-52 flex items-center justify-center mb-0 cursor-pointer"
            >
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <Accessibility className="h-20 w-20 text-[#336647]" />
              )}
            </motion.div>
          </div>

          {/* Form/Choice Container */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-[#336647]/10 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <Card className="relative border-[#2D5A3F]/10 bg-[#FCFBF6] rounded-[2.5rem] shadow-xl overflow-hidden">
              <CardHeader className="pt-10 px-10 pb-4 text-center">
                <div className="flex justify-center items-center gap-4 mb-2">
                  <Sparkles className="h-5 w-5 text-[#336647] animate-pulse" />
                  <CardTitle className="text-3xl font-black tracking-tight text-[#1D3B2A] uppercase italic">
                    Selecciona Operación
                  </CardTitle>
                  <Sparkles className="h-5 w-5 text-[#336647] animate-pulse" />
                </div>
                <CardDescription className="text-[#1D3B2A]/50 font-medium text-sm">
                  Configura tu entorno de KaiCenter
                </CardDescription>
              </CardHeader>
              <CardContent className="p-10 pt-4 space-y-4">
                <button
                  onClick={() => setMode('tv')}
                  className="w-full group relative bg-white border border-[#2D5A3F]/10 rounded-3xl p-8 flex items-center justify-between hover:border-[#336647]/40 transition-all duration-300 hover:shadow-lg shadow-[#336647]/5"
                >
                  <div className="flex items-center gap-6 text-left">
                    <div className="w-16 h-16 rounded-2xl bg-[#336647]/10 flex items-center justify-center text-[#336647] group-hover:scale-110 transition-transform">
                      <Maximize2 className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-[#1D3B2A] uppercase">Modo Pantalla</h4>
                      <p className="text-[#1D3B2A]/60 text-sm font-medium">Ejercicios en resolución TV</p>
                    </div>
                  </div>
                  <ChevronRight className="h-6 w-6 text-[#2D5A3F] group-hover:text-[#336647] group-hover:translate-x-1 transition-all" />
                </button>

                <Link href="/dashboard" className="block w-full">
                  <div className="w-full group relative bg-white border border-[#2D5A3F]/10 rounded-3xl p-8 flex items-center justify-between hover:border-[#336647]/40 transition-all duration-300 hover:shadow-lg shadow-[#336647]/5">
                    <div className="flex items-center gap-6 text-left">
                      <div className="w-16 h-16 rounded-2xl bg-[#336647] flex items-center justify-center text-[#FCFBF6] group-hover:scale-110 transition-transform">
                        <Accessibility className="h-8 w-8" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-[#1D3B2A] uppercase">Administrador</h4>
                        <p className="text-[#1D3B2A]/60 text-sm font-medium">Gestión y configuración</p>
                      </div>
                    </div>
                    <ChevronRight className="h-6 w-6 text-[#2D5A3F] group-hover:text-[#336647] group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>

                <div className="text-center pt-4">
                  <p className="text-[#2D5A3F] text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
                    {phrases[phraseIndex]}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Quote */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-10 text-[#2D5A3F] text-[10px] font-medium uppercase tracking-[0.4em]"
          >
            La excelencia no es un acto, sino un hábito.
          </motion.p>
        </motion.div>
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
