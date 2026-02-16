"use client"

import type { WorkoutDay } from "@/lib/workout-data"
import { Clock, Target } from "lucide-react"
import Image from "next/image"

interface ExerciseListProps {
  workout: WorkoutDay
}

export function ExerciseList({ workout }: ExerciseListProps) {
  const totalDuration = workout.sets * workout.exercises.length * (workout.workTime + workout.restTime)
  const minutes = Math.floor(totalDuration / 60)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={`bg-gradient-to-r ${workout.color} rounded-xl p-4 mb-4`}>
        <h2 className="text-2xl font-bold text-white">{workout.name}</h2>
        <div className="flex gap-4 mt-2 text-white/90 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{minutes} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span>{workout.exercises.length} ejercicios × {workout.sets} sets</span>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
            {workout.workTime}s trabajo
          </span>
          <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
            {workout.restTime}s descanso
          </span>
        </div>
      </div>

      {/* Exercise Cards */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {workout.exercises.map((exercise, index) => (
          <div
            key={exercise.id}
            className="bg-secondary/50 rounded-xl p-3 hover:bg-secondary transition-colors"
          >
            <div className="flex gap-3">
              {/* Exercise Number */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">{index + 1}</span>
              </div>

              {/* GIF Preview */}
              <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={exercise.gifUrl || "/placeholder.svg"}
                  alt={exercise.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>

              {/* Exercise Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{exercise.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {exercise.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {exercise.muscleGroups.map((muscle) => (
                    <span
                      key={muscle}
                      className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-secondary/50 rounded-lg p-2">
            <div className="text-2xl font-bold text-primary">{workout.sets}</div>
            <div className="text-xs text-muted-foreground">Sets</div>
          </div>
          <div className="bg-secondary/50 rounded-lg p-2">
            <div className="text-2xl font-bold text-primary">{workout.exercises.length}</div>
            <div className="text-xs text-muted-foreground">Ejercicios</div>
          </div>
          <div className="bg-secondary/50 rounded-lg p-2">
            <div className="text-2xl font-bold text-primary">{minutes}</div>
            <div className="text-xs text-muted-foreground">Minutos</div>
          </div>
        </div>
      </div>
    </div>
  )
}
