export type Exercise = {
  id: string
  name: string
  gifUrl: string
  videoUrl?: string
  duration: number // seconds
  description: string
  muscleGroups: string[]
}

export type WorkoutDay = {
  id: string
  name: string
  type: "cardio" | "resistance" | "hybrid"
  color: string
  exercises: Exercise[]
  workTime: number // seconds per exercise
  restTime: number // seconds between exercises
  sets: number // number of rounds/laps
  hydrationInterval?: number // every X exercises
  hydrationDuration?: number // rest time for hydration
}

const exerciseGifs = {
  squats: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHJ6enR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/M9Zu6n8F1LdDzhC8pD/giphy.gif",
  pushups: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJ6enR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/6FEAMX6V0d0LqLqLqL/giphy.gif",
  burpees: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJ6enR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxxXzXF9RJu/giphy.gif",
  lunges: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExczJxeWRueXoxejIzamUxdWN6MHg1eGd6czJ4eWRueXoxejIzamUxdWN6MHg1eGd6JmN0PWc/6FEAMX6V0d0LqLqLqL/giphy.gif",
  plank: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjNqcXJ6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6JmN0PWc/3o7TKv6lE7bXF9RJu/giphy.gif",
  jumpingJacks: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjNqcXJ6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6JmN0PWc/M9Zu6n8F1LdDzhC8pD/giphy.gif",
  mountainClimbers: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjNqcXJ6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6JmN0PWc/6FEAMX6V0d0LqLqLqL/giphy.gif",
  highKnees: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjNqcXJ6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6JmN0PWc/3o7TKMGpxxXzXF9RJu/giphy.gif",
  bicepCurls: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjNqcXJ6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6JmN0PWc/6FEAMX6V0d0LqLqLqL/giphy.gif",
  tricepDips: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjNqcXJ6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6JmN0PWc/LqX3q8LqLqLqLqLqLq/giphy.gif",
  deadlift: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjNqcXJ6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6JmN0PWc/M9Zu6n8F1LdDzhC8pD/giphy.gif",
  shoulderPress: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjNqcXJ6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6JmN0PWc/6FEAMX6V0d0LqLqLqL/giphy.gif",
}

const createExercise = (id: string, name: string, gif: string, description: string, muscles: string[]): Exercise => ({
  id, name, gifUrl: gif, duration: 45, description, muscleGroups: muscles
})

export const weeklyWorkouts: Record<string, WorkoutDay> = {
  monday: {
    id: "monday",
    name: "CARDIO BLAST",
    type: "cardio",
    color: "from-red-500 to-orange-500",
    workTime: 1200,
    restTime: 60,
    sets: 1,
    exercises: [
      createExercise("1", "Jumping Jacks", exerciseGifs.jumpingJacks, "Salto abriendo brazos", ["Cardio"]),
      createExercise("2", "High Knees", exerciseGifs.highKnees, "Rodillas al pecho", ["Cardio"]),
      createExercise("3", "Mountain Climbers", exerciseGifs.mountainClimbers, "Escaladores", ["Core"]),
      createExercise("4", "Burpees", exerciseGifs.burpees, "Burpees explosivos", ["Full"]),
      createExercise("5", "Plank", exerciseGifs.plank, "Plancha estática", ["Core"]),
      createExercise("6", "Squats", exerciseGifs.squats, "Sentadillas", ["Piernas"]),
      createExercise("7", "Lunges", exerciseGifs.lunges, "Estocadas", ["Piernas"]),
      createExercise("8", "Pushups", exerciseGifs.pushups, "Flexiones", ["Pecho"]),
    ],
  },
  tuesday: {
    id: "tuesday",
    name: "STRENGTH FOCUS",
    type: "resistance",
    color: "from-blue-500 to-indigo-600",
    workTime: 1200,
    restTime: 60,
    sets: 1,
    exercises: [
      createExercise("1", "Pushups", exerciseGifs.pushups, "Flexiones de pecho", ["Pecho"]),
      createExercise("2", "Shoulder Press", exerciseGifs.shoulderPress, "Press de hombros", ["Hombros"]),
      createExercise("3", "Tricep Dips", exerciseGifs.tricepDips, "Fondos", ["Tríceps"]),
      createExercise("4", "Bicep Curls", exerciseGifs.bicepCurls, "Curl de bíceps", ["Bíceps"]),
      createExercise("5", "Deadlift", exerciseGifs.deadlift, "Peso muerto", ["Espalda"]),
      createExercise("6", "Squats", exerciseGifs.squats, "Sentadillas pesadas", ["Piernas"]),
      createExercise("7", "Lunges", exerciseGifs.lunges, "Zancadas", ["Piernas"]),
      createExercise("8", "Plank", exerciseGifs.plank, "Plancha fuerte", ["Core"]),
    ],
  },
  wednesday: {
    id: "wednesday",
    name: "HYBRID CIRCUIT",
    type: "hybrid",
    color: "from-purple-500 to-pink-500",
    workTime: 1200,
    restTime: 60,
    sets: 1,
    exercises: [
      createExercise("1", "Burpees", exerciseGifs.burpees, "Burpees de potencia", ["Full"]),
      createExercise("2", "Mountain Climbers", exerciseGifs.mountainClimbers, "Escaladores rápidos", ["Cardio"]),
      createExercise("3", "Pushups", exerciseGifs.pushups, "Flexiones rápidas", ["Pecho"]),
      createExercise("4", "Jumping Jacks", exerciseGifs.jumpingJacks, "Saltos", ["Cardio"]),
      createExercise("5", "Squats", exerciseGifs.squats, "Sentadillas con salto", ["Piernas"]),
      createExercise("6", "Plank", exerciseGifs.plank, "Plancha activa", ["Core"]),
      createExercise("7", "High Knees", exerciseGifs.highKnees, "Rodillas altas", ["Cardio"]),
      createExercise("8", "Lunges", exerciseGifs.lunges, "Zancadas laterales", ["Piernas"]),
    ],
  },
  thursday: {
    id: "thursday",
    name: "POWER WORKOUT",
    type: "resistance",
    color: "from-green-500 to-emerald-600",
    workTime: 1200,
    restTime: 60,
    sets: 1,
    exercises: [
      createExercise("1", "Deadlift", exerciseGifs.deadlift, "Peso muerto explosivo", ["Fuerza"]),
      createExercise("2", "Shoulder Press", exerciseGifs.shoulderPress, "Press militar", ["Hombros"]),
      createExercise("3", "Squats", exerciseGifs.squats, "Sentadillas sumo", ["Piernas"]),
      createExercise("4", "Pushups", exerciseGifs.pushups, "Flexiones diamante", ["Pecho"]),
      createExercise("5", "Mountain Climbers", exerciseGifs.mountainClimbers, "Escaladores de potencia", ["Core"]),
      createExercise("6", "Bicep Curls", exerciseGifs.bicepCurls, "Curl concentrado", ["Bíceps"]),
      createExercise("7", "Lunges", exerciseGifs.lunges, "Zancadas inversas", ["Piernas"]),
      createExercise("8", "Plank", exerciseGifs.plank, "Plancha comando", ["Core"]),
    ],
  },
  friday: {
    id: "friday",
    name: "ULTIMATE HIIT",
    type: "cardio",
    color: "from-yellow-500 to-red-600",
    workTime: 1200,
    restTime: 60,
    sets: 1,
    exercises: [
      createExercise("1", "Burpees", exerciseGifs.burpees, "Burpees HIIT", ["Full"]),
      createExercise("2", "Jumping Jacks", exerciseGifs.jumpingJacks, "Saltos HIIT", ["Cardio"]),
      createExercise("3", "High Knees", exerciseGifs.highKnees, "Rodillas HIIT", ["Cardio"]),
      createExercise("4", "Mountain Climbers", exerciseGifs.mountainClimbers, "Escaladores HIIT", ["Cardio"]),
      createExercise("5", "Squats", exerciseGifs.squats, "Sentadillas HIIT", ["Piernas"]),
      createExercise("6", "Pushups", exerciseGifs.pushups, "Flexiones HIIT", ["Pecho"]),
      createExercise("7", "Lunges", exerciseGifs.lunges, "Zancadas HIIT", ["Piernas"]),
      createExercise("8", "Plank", exerciseGifs.plank, "Plancha HIIT", ["Core"]),
    ],
  },
  saturday: {
    id: "saturday",
    name: "WEEKEND WARRIOR",
    type: "hybrid",
    color: "from-indigo-500 to-purple-600",
    workTime: 1200,
    restTime: 60,
    sets: 1,
    exercises: [
      createExercise("1", "Pushups", exerciseGifs.pushups, "Mix de flexiones", ["Pecho"]),
      createExercise("2", "Squats", exerciseGifs.squats, "Mix de sentadillas", ["Piernas"]),
      createExercise("3", "Burpees", exerciseGifs.burpees, "Mix de burpees", ["Full"]),
      createExercise("4", "Plank", exerciseGifs.plank, "Mix de planchas", ["Core"]),
      createExercise("5", "Lunges", exerciseGifs.lunges, "Mix de zancadas", ["Piernas"]),
      createExercise("6", "Bicep Curls", exerciseGifs.bicepCurls, "Mix de curls", ["Bíceps"]),
      createExercise("7", "Shoulder Press", exerciseGifs.shoulderPress, "Mix de press", ["Hombros"]),
      createExercise("8", "High Knees", exerciseGifs.highKnees, "Mix de saltos", ["Cardio"]),
    ],
  },
  sunday: {
    id: "sunday",
    name: "RECOVERY DAY",
    type: "hybrid",
    color: "from-slate-700 to-slate-900",
    workTime: 0,
    restTime: 0,
    sets: 0,
    exercises: [],
  },
}

export const dayNames: Record<string, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
}

export function getCurrentDayKey(): string {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  return days[new Date().getDay()]
}
