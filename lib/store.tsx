"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { supabase } from "./supabase"

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
  memberId: string
  memberName: string
  memberEmail: string
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
            status: r.status,
            createdAt: r.created_at
          })))
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

    return () => {
      supabase.removeChannel(membersSubscription)
      supabase.removeChannel(reservationsSubscription)
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
  const getAvailableSlots = useCallback((date: string): TimeSlot[] => {
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
        role: newUser.role,
        status: 'Activo'
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
      throw new Error("Los administradores deben usar el panel de FlowGym")
    }

    const loggedUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.created_at
    }

    setCurrentUser(loggedUser)
    return loggedUser
  }

  const logout = () => {
    setCurrentUser(null)
  }

  // Booking Actions
  const createBooking = async (userId: string, date: string, timeSlot: string) => {
    const user = users.find(u => u.id === userId)
    if (!user) throw new Error("Usuario no encontrado")

    // Check availability
    const slotBookings = bookings.filter(
      b => b.date === date && b.timeSlot === timeSlot && b.status === "confirmed"
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
        status: 'confirmed'
      }])

    if (error) {
      setBookings(prev => prev.filter(b => b.id !== id))
      throw new Error(error.message)
    }

    return { id, memberId: userId, date, timeSlot }
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
    clearAllTestData
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
