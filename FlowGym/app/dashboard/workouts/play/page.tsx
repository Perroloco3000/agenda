"use client"

import { useSearchParams } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { F45Timer } from "@/components/f45-timer"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

function WorkoutPlayerContent() {
    const searchParams = useSearchParams()
    const workoutId = searchParams.get("id")
    const { workouts } = useAppStore()

    const workout = workouts.find(w => w.id === workoutId)

    if (!workout) {
        return (
            <DashboardShell>
                <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
                    <div className="text-6xl">🏃‍♂️</div>
                    <h2 className="text-3xl font-black">Rutina no encontrada</h2>
                    <Link href="/dashboard/workouts">
                        <Button>Volver a Rutinas</Button>
                    </Link>
                </div>
            </DashboardShell>
        )
    }

    // Map WorkoutStat to the format F45Timer expects
    const mappedWorkout = {
        id: workout.id,
        name: workout.name,
        type: workout.type?.toLowerCase() as any || "cardio",
        color: workout.color,
        workTime: parseInt(workout.work) || 45,
        restTime: parseInt(workout.rest) || 15,
        sets: workout.stations || 3,
        exercises: workout.exercises || [],
        hydrationInterval: 4,
        hydrationDuration: 30
    }

    return (
        <div className="h-screen bg-black overflow-hidden flex flex-col">
            {/* Minimal Playback Header */}
            <div className="absolute top-6 left-6 z-50 flex items-center gap-4">
                <Link href="/dashboard/workouts">
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-full bg-black/20 border-white/20 text-white hover:bg-white hover:text-black">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                {workout.videoUrl && (
                    <a href={workout.videoUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="h-12 px-6 rounded-full bg-black/20 border-white/20 text-white hover:bg-rose-600 hover:border-rose-600 font-bold flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" /> Ver Video Instructivo
                        </Button>
                    </a>
                )}
            </div>

            <F45Timer workout={mappedWorkout as any} />
        </div>
    )
}

export default function WorkoutPlayerPage() {
    return (
        <Suspense fallback={
            <div className="h-screen bg-black flex items-center justify-center">
                <div className="text-white font-black text-2xl animate-pulse italic uppercase tracking-tighter">Cargando KaiPlayer...</div>
            </div>
        }>
            <WorkoutPlayerContent />
        </Suspense>
    )
}
