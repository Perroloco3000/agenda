"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { dayNames, weeklyWorkouts } from "@/lib/workout-data"
import { cn } from "@/lib/utils"
import { Flame, Dumbbell, Zap } from "lucide-react"

interface DaySelectorProps {
  selectedDay: string
  onSelectDay: (day: string) => void
}

const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

const typeIcons: Record<string, any> = {
  cardio: Flame,
  resistance: Dumbbell,
  hybrid: Zap,
}

export function DaySelector({ selectedDay, onSelectDay }: DaySelectorProps) {
  const { workouts } = useAppStore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-foreground mb-4">Rutinas Semanales</h2>
      <div className="space-y-2">
        {dayOrder.map((dayKey) => {
          const dayName = dayNames[dayKey]
          const workoutFromStore = workouts.find(w => w.day === dayName)

          // Use store data if available, otherwise fallback to template
          const workout = workoutFromStore ? {
            name: workoutFromStore.name,
            type: (workoutFromStore.type?.toLowerCase() as any) || "cardio",
            color: workoutFromStore.color,
            exercises: Array.isArray(workoutFromStore.exercises) ? workoutFromStore.exercises : [],
            sets: workoutFromStore.stations || 3
          } : weeklyWorkouts[dayKey]

          const Icon = typeIcons[workout.type] || Zap
          const isSelected = selectedDay === dayKey

          return (
            <button
              key={dayKey}
              onClick={() => onSelectDay(dayKey)}
              className={cn(
                "w-full p-3 rounded-xl text-left transition-all duration-200",
                "border-2 hover:scale-[1.02]",
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-transparent bg-secondary/50 hover:bg-secondary"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br",
                  workout.color
                )}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {dayNames[dayKey]}
                    </span>
                    {isSelected && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase font-black italic tracking-tighter">
                        HOY
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate font-bold">
                    {workout.name}
                  </p>
                </div>
                <div className="text-right text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                  <div>{workout.exercises.length} ej.</div>
                  <div>{workout.sets} sets</div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
