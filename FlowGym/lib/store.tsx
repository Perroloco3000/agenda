"use client"

import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from "react"
import { supabase } from "./supabase"
import { toast } from "sonner"

// Types
export type Member = {
    id: string
    name: string
    email: string
    phone: string
    plan: "Premium" | "VIP" | "Básico"
    status: "Activo" | "Inactivo"
    joinDate: string
}

export type Booking = {
    id: string
    time: string
    workout: string
    instructor: string
    booked: number
    capacity: number
    date: string
}

export type WorkoutStat = {
    id: string
    name: string
    type: string
    stations: number
    work: string
    rest: string
    color: string
}

export type UserReservation = {
    id: string
    memberId: string
    memberName: string
    memberEmail: string
    date: string
    timeSlot: string
    status: "confirmed" | "cancelled"
    createdAt: string
}

export type TimeSlot = {
    time: string
    capacity: number
    booked: number
    available: number
}

// Time slots: 7am-8:30pm, 1.5hr each, max 20 people
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

export const SLOT_CAPACITY = 20

// Store Hook Logic
export function useAppStoreLogic() {
    const [members, setMembers] = useState<Member[]>([])
    const [bookings, setBookings] = useState<Booking[]>([])
    const [workouts, setWorkouts] = useState<WorkoutStat[]>([])
    const [reservations, setReservations] = useState<UserReservation[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [syncStatus, setSyncStatus] = useState<"connecting" | "connected" | "error">("connecting")

    // Load Data from Supabase
    const loadSupabaseData = useCallback(async () => {
        setSyncStatus("connecting")
        try {
            // Fetch each table individually to avoid one error blocking everything
            const fetchMembers = async () => {
                console.log("Fetching members...")
                const { data, error } = await supabase.from('members').select('*')
                if (error) {
                    console.error("Error fetching members:", error)
                    throw error
                }
                console.log(`Fetched ${data?.length || 0} members`)
                if (data) setMembers(data.map(m => ({
                    id: m.id,
                    name: m.name,
                    email: m.email,
                    phone: m.phone,
                    plan: m.plan || 'Premium',
                    status: m.status || 'Activo',
                    joinDate: m.created_at || m.joinDate || new Date().toISOString()
                })))
            }

            const fetchWorkouts = async () => {
                const { data } = await supabase.from('workouts').select('*')
                if (data) setWorkouts(data)
            }

            const fetchBookings = async () => {
                const { data } = await supabase.from('scheduled_bookings').select('*')
                if (data) setBookings(data)
            }

            const fetchReservations = async () => {
                const { data, error } = await supabase.from('reservations').select('*').eq('status', 'confirmed')
                if (error) throw error
                if (data) setReservations(data.map(r => ({
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

            await Promise.allSettled([
                fetchMembers(),
                fetchWorkouts(),
                fetchBookings(),
                fetchReservations()
            ])

            setIsLoaded(true)
            setSyncStatus("connected")
        } catch (error) {
            console.error("Critical error loading data:", error)
            setSyncStatus("error")
            setIsLoaded(true) // Set to true anyway to allow showing what we have
        }
    }, [supabase])

    useEffect(() => {
        loadSupabaseData()

        // Sync Subscriptions
        const membersSub = supabase.channel('members-all')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, payload => {
                console.log("REALTIME MEMBER EVENT:", payload.eventType, payload)
                if (payload.eventType === 'INSERT') {
                    const nm = payload.new as any
                    toast.success(`NUEVO MIEMBRO: ${nm.name}`, {
                        description: `Se ha registrado un nuevo usuario: ${nm.email}`,
                        duration: 8000
                    })
                    setMembers(prev => {
                        if (prev.find(m => m.id === nm.id)) return prev
                        return [...prev, {
                            id: nm.id,
                            name: nm.name,
                            email: nm.email,
                            phone: nm.phone,
                            plan: nm.plan || 'Premium',
                            status: nm.status || 'Activo',
                            joinDate: nm.created_at || new Date().toISOString()
                        }]
                    })
                } else if (payload.eventType === 'UPDATE') {
                    const um = payload.new as any
                    setMembers(prev => prev.map(m => m.id === um.id ? {
                        ...m,
                        name: um.name,
                        email: um.email,
                        phone: um.phone,
                        plan: um.plan || m.plan,
                        status: um.status || m.status
                    } : m))
                } else if (payload.eventType === 'DELETE') {
                    setMembers(prev => prev.filter(m => m.id !== payload.old.id))
                }
            }).subscribe()

        const reservationsSub = supabase.channel('reservations-all')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, payload => {
                if (payload.eventType === 'INSERT') {
                    const nr = payload.new as any
                    toast.success("NUEVA RESERVA", {
                        description: `${nr.member_name} ha reservado para el ${nr.date} a las ${nr.time_slot}`,
                        duration: 8000
                    })
                    setReservations(prev => {
                        if (prev.find(r => r.id === nr.id)) return prev
                        return [...prev, {
                            id: nr.id,
                            memberId: nr.member_id,
                            memberName: nr.member_name,
                            memberEmail: nr.member_email,
                            date: nr.date,
                            timeSlot: nr.time_slot,
                            status: nr.status,
                            createdAt: nr.created_at
                        }]
                    })
                } else if (payload.eventType === 'UPDATE') {
                    const ur = payload.new as any
                    if (ur.status === 'cancelled') {
                        toast.warning("RESERVA CANCELADA", {
                            description: `${ur.member_name} ha cancelado su reserva.`,
                            duration: 5000
                        })
                    }
                    setReservations(prev => {
                        if (ur.status === 'cancelled') {
                            return prev.filter(r => r.id !== ur.id)
                        }
                        return prev.map(r => r.id === ur.id ? {
                            ...r,
                            status: ur.status
                        } : r)
                    })
                } else if (payload.eventType === 'DELETE') {
                    setReservations(prev => prev.filter(r => r.id !== payload.old.id))
                }
            }).subscribe()

        return () => {
            supabase.removeChannel(membersSub)
            supabase.removeChannel(reservationsSub)
        }
    }, [])

    // New Store Actions with useCallback for stability
    const addMember = useCallback(async (member: Omit<Member, "id" | "joinDate">) => {
        const id = Math.random().toString(36).substr(2, 9)
        const { error } = await supabase.from('members').insert([{
            id,
            name: member.name,
            email: member.email,
            phone: member.phone,
            plan: member.plan,
            status: member.status
        }])
        if (error) throw error
        setMembers(prev => [...prev, { ...member, id, joinDate: new Date().toISOString() }])
    }, [])

    const removeMember = useCallback(async (id: string) => {
        const { error } = await supabase.from('members').delete().eq('id', id)
        if (error) throw error
        setMembers(prev => prev.filter(m => m.id !== id))
    }, [])

    const toggleMemberStatus = useCallback(async (id: string) => {
        setMembers(prev => {
            const member = prev.find(m => m.id === id)
            if (!member) return prev
            const newStatus = member.status === 'Activo' ? 'Inactivo' : 'Activo'
            supabase.from('members').update({ status: newStatus }).eq('id', id).then(({ error }) => {
                if (error) console.error(error)
            })
            return prev.map(m => m.id === id ? { ...m, status: newStatus } : m)
        })
    }, [])

    const addWorkout = useCallback(async (workout: Omit<WorkoutStat, "id">) => {
        const id = Math.random().toString(36).substr(2, 9)
        const { error } = await supabase.from('workouts').insert([{ id, ...workout }])
        if (error) throw error
        setWorkouts(prev => [...prev, { id, ...workout }])
    }, [])

    const deleteWorkout = useCallback(async (id: string) => {
        const { error } = await supabase.from('workouts').delete().eq('id', id)
        if (error) throw error
        setWorkouts(prev => prev.filter(w => w.id !== id))
    }, [])

    const updateWorkout = useCallback(async (id: string, updates: Partial<WorkoutStat>) => {
        const { error } = await supabase.from('workouts').update(updates).eq('id', id)
        if (error) throw error
        setWorkouts(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w))
    }, [])

    const createReservation = useCallback(async (memberId: string, date: string, timeSlot: string) => {
        const member = members.find(m => m.id === memberId)
        if (!member) throw new Error("Miembro no encontrado")

        const resId = Math.random().toString(36).substr(2, 9)
        const { error } = await supabase.from('reservations').insert([{
            id: resId,
            member_id: memberId,
            member_name: member.name,
            member_email: member.email,
            date,
            time_slot: timeSlot,
            status: 'confirmed'
        }])
        if (error) throw error
        return { id: resId, memberId, date, timeSlot }
    }, [members])

    const cancelReservation = useCallback(async (reservationId: string) => {
        const { error } = await supabase.from('reservations').update({ status: 'cancelled' }).eq('id', reservationId)
        if (error) throw error
        setReservations(prev => prev.filter(r => r.id !== reservationId))
    }, [])

    const getAvailableSlots = useCallback((date: string): TimeSlot[] => {
        return TIME_SLOTS.map(slot => {
            const slotReservations = reservations.filter(
                (r: UserReservation) => r.date === date && r.timeSlot === slot && r.status === "confirmed"
            )
            const booked = slotReservations.length
            return {
                time: slot,
                capacity: SLOT_CAPACITY,
                booked,
                available: SLOT_CAPACITY - booked
            }
        })
    }, [reservations])

    const getMemberReservations = useCallback((memberId: string) => {
        return reservations.filter(r => r.memberId === memberId && r.status === "confirmed")
    }, [reservations])

    return {
        members,
        bookings,
        workouts,
        reservations,
        addMember,
        removeMember,
        toggleMemberStatus,
        addWorkout,
        deleteWorkout,
        updateWorkout,
        createReservation,
        cancelReservation,
        getAvailableSlots,
        getMemberReservations,
        isLoaded,
        syncStatus,
        refreshData: loadSupabaseData
    }
}

// Context Setup
const StoreContext = createContext<ReturnType<typeof useAppStoreLogic> | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
    const store = useAppStoreLogic()
    return <StoreContext.Provider value={store}> {children} </StoreContext.Provider>
}

export function useAppStore() {
    const context = useContext(StoreContext)
    if (!context) throw new Error("useAppStore must be used within StoreProvider")
    return context
}
