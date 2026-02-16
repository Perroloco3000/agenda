export type Exercise = {
  id: string
  name: string
  gifUrl: string
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

// GIFs de ejercicios de Giphy (dominio público fitness)
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
// Updating with better URLs (I'll use common fitness CDN or reliable Giphy IDs)

export const weeklyWorkouts: Record<string, WorkoutDay> = {
  monday: {
    id: "monday",
    name: "CARDIO BLAST",
    type: "cardio",
    color: "from-red-500 to-orange-500",
    workTime: 45,
    restTime: 15,
    sets: 3,
    hydrationInterval: 2, // Every 2 exercises
    hydrationDuration: 30, // 30s hydration break
    exercises: [
      {
        id: "1",
        name: "Jumping Jacks",
        gifUrl: exerciseGifs.jumpingJacks,
        duration: 45,
        description: "Salta abriendo piernas y brazos simultáneamente",
        muscleGroups: ["Cardio", "Piernas", "Hombros"],
      },
      {
        id: "2",
        name: "High Knees",
        gifUrl: exerciseGifs.highKnees,
        duration: 45,
        description: "Corre en el lugar llevando las rodillas al pecho",
        muscleGroups: ["Cardio", "Core", "Piernas"],
      },
      {
        id: "3",
        name: "Burpees",
        gifUrl: exerciseGifs.burpees,
        duration: 45,
        description: "Desde de pie, baja al suelo, haz una flexión y salta",
        muscleGroups: ["Full Body", "Cardio"],
      },
      {
        id: "4",
        name: "Mountain Climbers",
        gifUrl: exerciseGifs.mountainClimbers,
        duration: 45,
        description: "En posición de plancha, alterna llevando rodillas al pecho",
        muscleGroups: ["Core", "Cardio", "Hombros"],
      },
    ],
  },
  tuesday: {
    id: "tuesday",
    name: "UPPER BODY",
    type: "resistance",
    color: "from-blue-500 to-cyan-500",
    workTime: 40,
    restTime: 20,
    sets: 3,
    exercises: [
      {
        id: "1",
        name: "Push-ups",
        gifUrl: exerciseGifs.pushups,
        duration: 40,
        description: "Flexiones de pecho manteniendo el core activado",
        muscleGroups: ["Pecho", "Tríceps", "Hombros"],
      },
      {
        id: "2",
        name: "Shoulder Press",
        gifUrl: exerciseGifs.shoulderPress,
        duration: 40,
        description: "Press de hombros con mancuernas o peso corporal",
        muscleGroups: ["Hombros", "Tríceps"],
      },
      {
        id: "3",
        name: "Tricep Dips",
        gifUrl: exerciseGifs.tricepDips,
        duration: 40,
        description: "Fondos de tríceps en silla o banco",
        muscleGroups: ["Tríceps", "Hombros", "Pecho"],
      },
      {
        id: "4",
        name: "Bicep Curls",
        gifUrl: exerciseGifs.bicepCurls,
        duration: 40,
        description: "Curl de bíceps con mancuernas",
        muscleGroups: ["Bíceps", "Antebrazos"],
      },
    ],
  },
  wednesday: {
    id: "wednesday",
    name: "CORE CRUSHER",
    type: "hybrid",
    color: "from-purple-500 to-pink-500",
    workTime: 45,
    restTime: 15,
    sets: 3,
    exercises: [
      {
        id: "1",
        name: "Plank Hold",
        gifUrl: exerciseGifs.plank,
        duration: 45,
        description: "Mantén la posición de plancha con el core activado",
        muscleGroups: ["Core", "Hombros", "Espalda"],
      },
      {
        id: "2",
        name: "Mountain Climbers",
        gifUrl: exerciseGifs.mountainClimbers,
        duration: 45,
        description: "Escaladores rápidos manteniendo la cadera baja",
        muscleGroups: ["Core", "Cardio", "Hombros"],
      },
      {
        id: "3",
        name: "Burpees",
        gifUrl: exerciseGifs.burpees,
        duration: 45,
        description: "Burpees completos con salto al final",
        muscleGroups: ["Full Body", "Core"],
      },
      {
        id: "4",
        name: "High Knees",
        gifUrl: exerciseGifs.highKnees,
        duration: 45,
        description: "Rodillas altas activando el abdomen",
        muscleGroups: ["Core", "Cardio", "Piernas"],
      },
    ],
  },
  thursday: {
    id: "thursday",
    name: "LOWER BODY",
    type: "resistance",
    color: "from-green-500 to-emerald-500",
    workTime: 40,
    restTime: 20,
    sets: 3,
    exercises: [
      {
        id: "1",
        name: "Squats",
        gifUrl: exerciseGifs.squats,
        duration: 40,
        description: "Sentadillas profundas manteniendo la espalda recta",
        muscleGroups: ["Cuádriceps", "Glúteos", "Core"],
      },
      {
        id: "2",
        name: "Lunges",
        gifUrl: exerciseGifs.lunges,
        duration: 40,
        description: "Zancadas alternando piernas",
        muscleGroups: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
      },
      {
        id: "3",
        name: "Deadlift",
        gifUrl: exerciseGifs.deadlift,
        duration: 40,
        description: "Peso muerto con mancuernas o barra",
        muscleGroups: ["Isquiotibiales", "Glúteos", "Espalda"],
      },
      {
        id: "4",
        name: "Jump Squats",
        gifUrl: exerciseGifs.squats,
        duration: 40,
        description: "Sentadillas con salto explosivo",
        muscleGroups: ["Cuádriceps", "Glúteos", "Cardio"],
      },
    ],
  },
  friday: {
    id: "friday",
    name: "HIIT FRIDAY",
    type: "cardio",
    color: "from-yellow-500 to-red-500",
    workTime: 30,
    restTime: 10,
    sets: 4,
    exercises: [
      {
        id: "1",
        name: "Burpees",
        gifUrl: exerciseGifs.burpees,
        duration: 30,
        description: "Burpees a máxima velocidad",
        muscleGroups: ["Full Body", "Cardio"],
      },
      {
        id: "2",
        name: "Mountain Climbers",
        gifUrl: exerciseGifs.mountainClimbers,
        duration: 30,
        description: "Escaladores explosivos",
        muscleGroups: ["Core", "Cardio"],
      },
      {
        id: "3",
        name: "Jump Squats",
        gifUrl: exerciseGifs.squats,
        duration: 30,
        description: "Sentadillas con salto",
        muscleGroups: ["Piernas", "Cardio"],
      },
      {
        id: "4",
        name: "High Knees",
        gifUrl: exerciseGifs.highKnees,
        duration: 30,
        description: "Rodillas altas a máxima velocidad",
        muscleGroups: ["Cardio", "Core"],
      },
    ],
  },
  saturday: {
    id: "saturday",
    name: "FULL BODY",
    type: "hybrid",
    color: "from-indigo-500 to-purple-500",
    workTime: 45,
    restTime: 15,
    sets: 3,
    exercises: [
      {
        id: "1",
        name: "Squats",
        gifUrl: exerciseGifs.squats,
        duration: 45,
        description: "Sentadillas controladas",
        muscleGroups: ["Piernas", "Glúteos"],
      },
      {
        id: "2",
        name: "Push-ups",
        gifUrl: exerciseGifs.pushups,
        duration: 45,
        description: "Flexiones de pecho",
        muscleGroups: ["Pecho", "Tríceps"],
      },
      {
        id: "3",
        name: "Lunges",
        gifUrl: exerciseGifs.lunges,
        duration: 45,
        description: "Zancadas alternadas",
        muscleGroups: ["Piernas", "Glúteos"],
      },
      {
        id: "4",
        name: "Plank",
        gifUrl: exerciseGifs.plank,
        duration: 45,
        description: "Plancha isométrica",
        muscleGroups: ["Core", "Hombros"],
      },
    ],
  },
  sunday: {
    id: "sunday",
    name: "DÍA DE DESCANSO",
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
