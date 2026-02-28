"use client"

import { useState, useEffect, createContext, useContext, useCallback, useMemo, ReactNode } from "react"
import { supabase } from "./supabase"

// Types (compatible with FlowGym)
export type User = {
  id: string
  name: string
  email: string
  phone: string
  role: "user" | "admin"
  plan?: "GYM" | "Cognitivo" | "Premium"
  password?: string
  createdAt: string
}

export type Booking = {
  id: string
  memberId: string
  memberName: string
  memberEmail: string
  date: string // YYYY-MM-DD
  timeSlot: string // "07:00-08:30"
  area: "gym" | "cognitive"
  status: "confirmed" | "cancelled"
  createdAt: string
}

export type TimeSlot = {
  time: string
  capacity: number
  booked: number
  available: number
}

// Shifts
export const GYM_SLOTS = [
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00"
]

export const COGNITIVE_SLOTS = [
  "09:00-09:30",
  "10:00-10:30",
  "11:00-11:30",
  "12:00-12:30",
  "15:00-15:30",
  "16:00-16:30",
  "17:00-17:30"
]

export const TIME_SLOTS = GYM_SLOTS

const SLOT_CAPACITY = 12

// Store Hook
export function useAppStore() {
  const [users, setUsers] = useState<User[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [gymName, setGymName] = useState("KAICENTER SC")
  const [slogan, setSlogan] = useState("Osteomuscular & Ecological")
  const [logoUrl, setLogoUrl] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)

  // Load Initial Data from Supabase
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load Current User from localStorage (still local session)
        const savedCurrentUser = localStorage.getItem("agenda_current_user")
        if (savedCurrentUser) setCurrentUser(JSON.parse(savedCurrentUser))

        // Fetch Members
        const { data: members, error: mError } = await supabase
          .from('members')
          .select('*')

        if (members) {
          setUsers(members.map(m => ({
            id: m.id,
            name: m.name,
            email: m.email,
            phone: m.phone,
            role: m.role,
            createdAt: m.created_at
          })))
        }

        // Fetch Reservations
        const { data: reservations, error: rError } = await supabase
          .from('reservations')
          .select('*')
          .eq('status', 'confirmed')

        if (reservations) {
          setBookings(reservations.map(r => ({
            id: r.id,
            memberId: r.member_id,
            memberName: r.member_name,
            memberEmail: r.member_email,
            date: r.date,
            timeSlot: r.time_slot,
            area: r.area || "gym",
            status: r.status,
            createdAt: r.created_at
          })))
        }

        // Fetch Settings
        const { data: settings } = await supabase.from('system_settings').select('*')
        if (settings) {
          settings.forEach(s => {
            if (s.key === 'gymName') setGymName(s.value)
            if (s.key === 'slogan') setSlogan(s.value)
            if (s.key === 'logoUrl') setLogoUrl(s.value)
          })
        }

        setIsLoaded(true)
      } catch (error) {
        console.error("Error loading data from Supabase:", error)
      }
    }

    loadInitialData()

    // Real-time Subscriptions
    const membersSubscription = supabase
      .channel('members-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, payload => {
        if (payload.eventType === 'INSERT') {
          const newMember = payload.new as any
          setUsers(prev => {
            if (prev.find(u => u.id === newMember.id)) return prev
            return [...prev, {
              id: newMember.id,
              name: newMember.name,
              email: newMember.email,
              phone: newMember.phone,
              role: newMember.role || 'user',
              createdAt: newMember.created_at
            }]
          })
        }
      })
      .subscribe()

    const reservationsSubscription = supabase
      .channel('reservations-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, payload => {
        if (payload.eventType === 'INSERT') {
          const newRes = payload.new as any
          setBookings(prev => {
            if (prev.find(b => b.id === newRes.id)) return prev
            return [...prev, {
              id: newRes.id,
              memberId: newRes.member_id,
              memberName: newRes.member_name,
              memberEmail: newRes.member_email,
              date: newRes.date,
              timeSlot: newRes.time_slot,
              area: newRes.area || "gym",
              status: newRes.status,
              createdAt: newRes.created_at
            }]
          })
        } else if (payload.eventType === 'UPDATE') {
          const updatedRes = payload.new as any
          if (updatedRes.status === 'cancelled') {
            setBookings(prev => prev.filter(b => b.id !== updatedRes.id))
          }
        } else if (payload.eventType === 'DELETE') {
          setBookings(prev => prev.filter(b => b.id !== payload.old.id))
        }
      })
      .subscribe()

    const settingsSubscription = supabase
      .channel('settings-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'system_settings' }, payload => {
        const ns = payload.new as any
        if (ns.key === 'gymName') setGymName(ns.value)
        if (ns.key === 'slogan') setSlogan(ns.value)
        if (ns.key === 'logoUrl') setLogoUrl(ns.value)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(membersSubscription)
      supabase.removeChannel(reservationsSubscription)
      supabase.removeChannel(settingsSubscription)
    }
  }, [])

  // Save Session Locally
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("agenda_current_user", JSON.stringify(currentUser))
    } else {
      localStorage.removeItem("agenda_current_user")
    }
  }, [currentUser])

  // Derived state/getters as callbacks
  const getAvailableSlots = useCallback((date: string, area: "gym" | "cognitive" = "gym"): TimeSlot[] => {
    const slots = area === "gym" ? GYM_SLOTS : COGNITIVE_SLOTS
    return slots.map(slot => {
      const slotBookings = bookings.filter(
        b => b.date === date && b.timeSlot === slot && b.area === area && b.status === "confirmed"
      )
      const booked = slotBookings.length
      return {
        time: slot,
        capacity: SLOT_CAPACITY,
        booked,
        available: SLOT_CAPACITY - booked
      }
    })
  }, [bookings])

  const getUserBookings = useCallback((userId: string) => {
    return bookings.filter(b => b.memberId === userId && b.status === "confirmed")
  }, [bookings])

  // Auth Actions
  const register = async (userData: Omit<User, "id" | "createdAt" | "role">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newUser: User = {
      ...userData,
      id,
      role: "user",
      createdAt: new Date().toISOString()
    }

    const { error } = await supabase
      .from('members')
      .insert([{
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        password: newUser.password,
        role: newUser.role,
        status: 'Activo',
        plan: 'GYM'
      }])

    if (error) throw new Error(error.message)

    setCurrentUser(newUser)
    return newUser
  }

  const login = async (email: string, password: string) => {
    const { data: user, error } = await supabase
      .from('members')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) throw new Error("Usuario no encontrado")

    if (user.role === "admin") {
      throw new Error("Los administradores deben usar el panel de Kai Center")
    }

    // Password verification
    if (user.password !== password) {
      throw new Error("Contraseña incorrecta")
    }

    const loggedUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      plan: user.plan,
      password: user.password,
      createdAt: user.created_at
    }

    setCurrentUser(loggedUser)
    return loggedUser
  }

  const logout = () => {
    setCurrentUser(null)
  }

  // Booking Actions
  const createBooking = async (userId: string, date: string, timeSlot: string, area: "gym" | "cognitive" = "gym") => {
    const user = users.find(u => u.id === userId)
    if (!user) throw new Error("Usuario no encontrado")

    // Fetch user plan and existing bookings for that day
    const { data: member } = await supabase.from('members').select('plan').eq('id', userId).single()
    const userPlan = member?.plan || "Plan Basic"

    // Plan based restrictions
    if (userPlan === "GYM" && area !== "gym") {
      throw new Error("Tu plan GYM solo permite reservar en el Gimnasio.")
    }
    if (userPlan === "Cognitivo" && area !== "cognitive") {
      throw new Error("Tu plan Cognitivo solo permite reservar en el Área Cognitiva.")
    }
    // Premium allows both, but still limit to one area per day for simplicity if needed
    // or keep it open as requested. User said "Premium can reserve in both".
    // I'll keep the one area per day limit only for GYM and Cognitivo if they already have a booking.

    if (userPlan !== "Premium") {
      const existingToday = bookings.find(b => b.memberId === userId && b.date === date && b.status === "confirmed")
      if (existingToday && existingToday.area !== area) {
        throw new Error(`Tu plan ${userPlan} solo permite reservar en una área por día.`)
      }
    }

    // Check availability
    const slotBookings = bookings.filter(
      b => b.date === date && b.timeSlot === timeSlot && b.area === area && b.status === "confirmed"
    )
    if (slotBookings.length >= SLOT_CAPACITY) {
      throw new Error("Este turno está lleno")
    }

    const id = Math.random().toString(36).substr(2, 9)

    // Optimistic Update
    const optimisticBooking: Booking = {
      id,
      memberId: userId,
      memberName: user.name,
      memberEmail: user.email,
      date,
      timeSlot,
      area,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
    setBookings(prev => [...prev, optimisticBooking])

    const { error } = await supabase
      .from('reservations')
      .insert([{
        id,
        member_id: userId,
        member_name: user.name,
        member_email: user.email,
        date,
        time_slot: timeSlot,
        area,
        status: 'confirmed'
      }])

    if (error) {
      setBookings(prev => prev.filter(b => b.id !== id))
      throw new Error(error.message)
    }

    return { id, memberId: userId, date, timeSlot, area }
  }

  const cancelBooking = useCallback(async (bookingId: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)

    if (error) throw new Error(error.message)

    setBookings(prev => prev.filter(b => b.id !== bookingId))
  }, [])

  const cancelAllUserBookings = useCallback(async (userId: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ status: 'cancelled' })
      .eq('member_id', userId)

    if (error) throw new Error(error.message)

    setBookings(prev => prev.filter(b => b.memberId !== userId))
  }, [])

  const clearAllTestData = async () => {
    const { error: rError } = await supabase.from('reservations').delete().neq('id', '0')
    const { error: mError } = await supabase.from('members').delete().neq('role', 'admin')

    if (rError || mError) console.error("Error clearing data:", rError || mError)

    setBookings([])
    setUsers(prev => prev.filter(u => u.role === 'admin'))
    localStorage.removeItem("agenda_current_user")
    setCurrentUser(null)
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
    cancelAllUserBookings,
    getAvailableSlots,
    getUserBookings,
    clearAllTestData,
    gymName,
    slogan,
    logoUrl
  }
}

// Context
const StoreContext = createContext<ReturnType<typeof useAppStore> | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useAppStore()
  return <StoreContext.Provider value={store}> {children} </StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error("useStore must be used within StoreProvider")
  return context
}
