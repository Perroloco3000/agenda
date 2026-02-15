"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"

// Types (compatible with FlowGym)
export type User = {
  id: string
  name: string
  email: string
  phone: string
  role: "user" | "admin"
  createdAt: string
}

export type Booking = {
  id: string
  memberId: string // Changed from userId to match FlowGym
  memberName: string // Changed from userName to match FlowGym
  memberEmail: string // Changed from userEmail to match FlowGym
  date: string // YYYY-MM-DD
  timeSlot: string // "07:00-08:30"
  status: "confirmed" | "cancelled"
  createdAt: string
}

export type TimeSlot = {
  time: string
  capacity: number
  booked: number
  available: number
}

// Time slots: 7am-8:30pm, 1.5hr each
export const TIME_SLOTS = [
  "07:00-08:30",
  "08:30-10:00",
  "10:00-11:30",
  "11:30-13:00",
  "13:00-14:30",
  "14:30-16:00",
  "16:00-17:30",
  "17:30-19:00",
  "19:00-20:30"
]

const SLOT_CAPACITY = 20

// Store Hook
export function useAppStore() {
  const [users, setUsers] = useState<User[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage (SYNC WITH FLOWGYM)
  useEffect(() => {
    const loadData = () => {
      // Use FlowGym keys for synchronization
      const savedUsers = localStorage.getItem("flowgym_members")
      const savedBookings = localStorage.getItem("flowgym_reservations")
      const savedCurrentUser = localStorage.getItem("agenda_current_user")

      if (savedUsers) setUsers(JSON.parse(savedUsers))
      if (savedBookings) setBookings(JSON.parse(savedBookings))
      if (savedCurrentUser) setCurrentUser(JSON.parse(savedCurrentUser))

      setIsLoaded(true)
    }
    loadData()
  }, [])

  // Save to localStorage (SYNC WITH FLOWGYM)
  useEffect(() => {
    if (isLoaded) {
      // Use FlowGym keys for synchronization
      localStorage.setItem("flowgym_members", JSON.stringify(users))
      localStorage.setItem("flowgym_reservations", JSON.stringify(bookings))
      if (currentUser) {
        localStorage.setItem("agenda_current_user", JSON.stringify(currentUser))
      } else {
        localStorage.removeItem("agenda_current_user")
      }
    }
  }, [users, bookings, currentUser, isLoaded])

  // Auth Actions
  const register = (userData: Omit<User, "id" | "createdAt" | "role">) => {
    const existingUser = users.find(u => u.email === userData.email)
    if (existingUser) {
      throw new Error("El email ya está registrado")
    }

    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      createdAt: new Date().toISOString()
    }
    setUsers([...users, newUser])
    setCurrentUser(newUser)
    return newUser
  }

  const login = (email: string, password: string) => {
    const user = users.find(u => u.email === email)
    if (!user) {
      throw new Error("Usuario no encontrado")
    }
    // Block admin users from logging in to agenda app
    if (user.role === "admin") {
      throw new Error("Los administradores deben usar el panel de FlowGym")
    }
    setCurrentUser(user)
    return user
  }

  const logout = () => {
    setCurrentUser(null)
  }

  // Booking Actions (compatible with FlowGym UserReservation structure)
  const createBooking = (userId: string, date: string, timeSlot: string) => {
    const user = users.find(u => u.id === userId)
    if (!user) throw new Error("Usuario no encontrado")

    // Check if slot is full
    const slotBookings = bookings.filter(
      b => b.date === date && b.timeSlot === timeSlot && b.status === "confirmed"
    )
    if (slotBookings.length >= SLOT_CAPACITY) {
      throw new Error("Este turno está lleno")
    }

    // Check if user already has a booking for this slot
    const existingBooking = bookings.find(
      b => b.memberId === userId && b.date === date && b.timeSlot === timeSlot && b.status === "confirmed"
    )
    if (existingBooking) {
      throw new Error("Ya tienes una reserva para este turno")
    }

    // Create booking with FlowGym-compatible structure
    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      memberId: userId,
      memberName: user.name,
      memberEmail: user.email,
      date,
      timeSlot,
      status: "confirmed",
      createdAt: new Date().toISOString()
    }

    setBookings([...bookings, newBooking])
    return newBooking
  }

  const cancelBooking = (bookingId: string) => {
    setBookings(bookings.map(b =>
      b.id === bookingId ? { ...b, status: "cancelled" as const } : b
    ))
  }

  const getAvailableSlots = (date: string): TimeSlot[] => {
    return TIME_SLOTS.map(slot => {
      const slotBookings = bookings.filter(
        b => b.date === date && b.timeSlot === slot && b.status === "confirmed"
      )
      const booked = slotBookings.length
      return {
        time: slot,
        capacity: SLOT_CAPACITY,
        booked,
        available: SLOT_CAPACITY - booked
      }
    })
  }

  const getUserBookings = (userId: string) => {
    return bookings.filter(b => b.memberId === userId && b.status === "confirmed")
  }

  return {
    users,
    bookings,
    currentUser,
    isLoaded,
    register,
    login,
    logout,
    createBooking,
    cancelBooking,
    getAvailableSlots,
    getUserBookings
  }
}

// Context for easier access
const StoreContext = createContext<ReturnType<typeof useAppStore> | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useAppStore()
  return <StoreContext.Provider value={ store }> { children } </StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within StoreProvider")
  }
  return context
}
