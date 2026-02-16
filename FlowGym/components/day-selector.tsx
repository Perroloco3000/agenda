"use client"

import { weeklyWorkouts, dayNames } from "@/lib/workout-data"
import { cn } from "@/lib/utils"
import { Flame, Dumbbell, Zap } from "lucide-react"

interface DaySelectorProps {
  selectedDay: string
  onSelectDay: (day: string) => void
}

const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

const typeIcons = {
  cardio: Flame,
  resistance: Dumbbell,
  hybrid: Zap,
}

export function DaySelector({ selectedDay, onSelectDay }: DaySelectorProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-foreground mb-4">Rutinas Semanales</h2>
      <div className="space-y-2">
        {dayOrder.map((dayKey) => {
          const workout = weeklyWorkouts[dayKey]
          const Icon = typeIcons[workout.type]
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
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        HOY
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {workout.name}
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>{workout.exercises.length} ejercicios</div>
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
