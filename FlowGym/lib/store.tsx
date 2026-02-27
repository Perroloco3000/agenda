"use client"

import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from "react"
import { supabase } from "./supabase"
import { toast } from "sonner"
import { weeklyWorkouts, dayNames } from "./workout-data"

// Types
export type Member = {
    id: string
    name: string
    email: string
    phone: string
    plan: "Plan Plus" | "Plan Basic"
    status: "Activo" | "Inactivo"
    joinDate: string
    password?: string
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
    day?: string
    difficulty?: "Intro" | "Power" | "Elite"
    videoUrl?: string
    exercises?: any[]
}

export type Notification = {
    id: string
    title: string
    description: string
    time: string
    type: "info" | "success" | "warning"
    read: boolean
}

export type UserReservation = {
    id: string
    memberId: string
    memberName: string
    memberEmail: string
    date: string
    timeSlot: string
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

// Time slots: 7am-8:30pm, 1.5hr each, max 20 people
export const GYM_SLOTS = [
    "08:00-09:00",
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "14:00-15:00",
    "15:00-16:00",
    "17:00-18:00"
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

export const TIME_SLOTS = GYM_SLOTS // Default for backward compatibility

export const SLOT_CAPACITY = 12

// Store Hook Logic
export function useAppStoreLogic() {
    const [members, setMembers] = useState<Member[]>([])
    const [bookings, setBookings] = useState<Booking[]>([])
    const [workouts, setWorkouts] = useState<WorkoutStat[]>([])
    const [reservations, setReservations] = useState<UserReservation[]>([])
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [gymName, setGymName] = useState("KAICENTER SC")
    const [slogan, setSlogan] = useState("Osteomuscular & Ecological")
    const [logoUrl, setLogoUrl] = useState("")
    const [isLoaded, setIsLoaded] = useState(false)
    const [syncStatus, setSyncStatus] = useState<"connecting" | "connected" | "error">("connecting")

    const addNotification = useCallback(async (n: Omit<Notification, "id" | "time" | "read">) => {
        const { error } = await supabase.from('notifications').insert([{
            title: n.title,
            description: n.description,
            type: n.type,
            read: false
        }])
        if (error) console.error("Error adding notification:", error)
    }, [])

    const clearNotifications = useCallback(() => setNotifications([]), [])

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
                console.log(`Fetched ${data?.length || 0} members from Supabase`)
                if (data && data.length > 0) {
                    console.table(data.map(m => ({ id: m.id, name: m.name, email: m.email, role: m.role })))
                    setMembers(data.map(m => ({
                        id: m.id || Math.random().toString(),
                        name: m.name || "Sin Nombre",
                        email: m.email || "Sin Email",
                        phone: m.phone || "N/A",
                        plan: (m.plan as any) || 'Plan Basic',
                        status: (m.status as any) || 'Activo',
                        joinDate: m.created_at || m.joinDate || new Date().toISOString()
                    })))
                } else {
                    console.log("No members found in table 'members'")
                    setMembers([])
                }
            }

            setWorkouts(currentWorkouts.map(w => ({
                ...w,
                day: w.day || 'Lunes',
                difficulty: w.difficulty || 'Power',
                videoUrl: w.video_url || w.videoUrl || '',
                exercises: w.exercises || []
            })))
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
                area: r.area || 'gym',
                status: r.status,
                createdAt: r.created_at
            })))
        }

        const fetchNotifications = async () => {
            const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(20)
            if (error) throw error
            if (data) setNotifications(data.map(n => ({
                id: n.id,
                title: n.title,
                description: n.description,
                time: new Date(n.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                type: n.type as any,
                read: n.read
            })))
        }

        const fetchSettings = async () => {
            const { data } = await supabase.from('system_settings').select('*')
            if (data) {
                data.forEach(s => {
                    if (s.key === 'gymName') setGymName(s.value)
                    if (s.key === 'slogan') setSlogan(s.value)
                    if (s.key === 'logoUrl') setLogoUrl(s.value)
                })
            }
        }

        await Promise.allSettled([
            fetchMembers(),
            fetchWorkouts(),
            fetchBookings(),
            fetchReservations(),
            fetchNotifications(),
            fetchSettings()
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
                if (nm) {
                    toast.success(`NUEVO MIEMBRO: ${nm.name || 'Usuario'}`, {
                        description: `Se ha registrado un nuevo usuario.`,
                        duration: 8000
                    })
                }
                if (nm?.id) {
                    setMembers(prev => {
                        if (prev.find(m => m.id === nm.id)) return prev
                        return [...prev, {
                            id: nm.id,
                            name: nm.name || 'Sin Nombre',
                            email: nm.email || '',
                            phone: nm.phone || '',
                            plan: nm.plan || 'Plan Basic',
                            status: nm.status || 'Activo',
                            joinDate: nm.created_at || new Date().toISOString()
                        }]
                    })
                }
            } else if (payload.eventType === 'UPDATE') {
                const um = payload.new as any
                if (um?.id) {
                    setMembers(prev => prev.map(m => m.id === um.id ? {
                        ...m,
                        name: um.name || m.name,
                        email: um.email || m.email,
                        phone: um.phone || m.phone,
                        plan: um.plan || m.plan,
                        status: um.status || m.status
                    } : m))
                }
            } else if (payload.eventType === 'DELETE') {
                if (payload.old?.id) {
                    setMembers(prev => prev.filter(m => m.id !== payload.old.id))
                }
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
                        area: nr.area || 'gym',
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

    const workoutsSub = supabase.channel('workouts-all')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'workouts' }, payload => {
            if (payload.eventType === 'INSERT') {
                const nw = payload.new as any
                if (nw?.id) {
                    setWorkouts(prev => {
                        if (prev.find(w => w.id === nw.id)) return prev
                        return [...prev, {
                            id: nw.id,
                            name: nw.name || 'Nueva Rutina',
                            type: nw.type || 'cardio',
                            stations: nw.stations || 3,
                            work: nw.work || '45',
                            rest: nw.rest || '15',
                            color: nw.color || 'bg-primary',
                            day: nw.day || 'Lunes',
                            difficulty: nw.difficulty || 'Power',
                            videoUrl: nw.video_url || nw.videoUrl || '',
                            exercises: Array.isArray(nw.exercises) ? nw.exercises : []
                        }]
                    })
                }
            } else if (payload.eventType === 'UPDATE') {
                const uw = payload.new as any
                if (uw?.id) {
                    setWorkouts(prev => prev.map(w => w.id === uw.id ? {
                        ...w,
                        name: uw.name || w.name,
                        type: uw.type || w.type,
                        stations: uw.stations || w.stations,
                        work: uw.work || w.work,
                        rest: uw.rest || w.rest,
                        color: uw.color || w.color,
                        day: uw.day || w.day,
                        difficulty: uw.difficulty || w.difficulty,
                        videoUrl: uw.video_url || uw.videoUrl || w.videoUrl,
                        exercises: Array.isArray(uw.exercises) ? uw.exercises : (w.exercises || [])
                    } : w))
                }
            } else if (payload.eventType === 'DELETE') {
                if (payload.old?.id) {
                    setWorkouts(prev => prev.filter(w => w.id !== payload.old.id))
                }
            }
        }).subscribe()

    const notificationsSub = supabase.channel('notifications-all')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, payload => {
            if (payload.eventType === 'INSERT') {
                const nn = payload.new as any
                setNotifications(prev => [{
                    id: nn.id,
                    title: nn.title,
                    description: nn.description,
                    time: new Date(nn.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                    type: nn.type as any,
                    read: nn.read
                }, ...prev].slice(0, 20))
            } else if (payload.eventType === 'UPDATE') {
                const un = payload.new as any
                setNotifications(prev => prev.map(n => n.id === un.id ? { ...n, read: un.read } : n))
            } else if (payload.eventType === 'DELETE') {
                setNotifications(prev => prev.filter(n => n.id !== payload.old.id))
            }
        }).subscribe()

    const settingsSub = supabase.channel('settings-all')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'system_settings' }, payload => {
            const ns = payload.new as any
            if (ns.key === 'gymName') setGymName(ns.value)
            if (ns.key === 'slogan') setSlogan(ns.value)
            if (ns.key === 'logoUrl') setLogoUrl(ns.value)
        }).subscribe()

    const refreshInterval = setInterval(() => {
        console.log("Automatic Heartbeat Refresh...")
        loadSupabaseData()
    }, 30000)

    return () => {
        supabase.removeChannel(membersSub)
        supabase.removeChannel(reservationsSub)
        supabase.removeChannel(workoutsSub)
        supabase.removeChannel(notificationsSub)
        supabase.removeChannel(settingsSub)
        clearInterval(refreshInterval)
    }
}, [loadSupabaseData, supabase, addNotification])

// New Store Actions with useCallback for stability
const addMember = useCallback(async (member: Omit<Member, "id" | "joinDate">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const { error } = await supabase.from('members').insert([{
        id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        plan: member.plan || 'Plan Basic',
        status: member.status,
        password: member.password
    }])
    if (error) throw error
    const addedMember: Member = {
        id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        plan: member.plan || 'Plan Basic',
        status: member.status,
        password: member.password,
        joinDate: new Date().toISOString().split('T')[0]
    }
    setMembers(prev => [...prev, addedMember])
}, [])

const removeMember = useCallback(async (id: string) => {
    const { error } = await supabase.from('members').delete().eq('id', id)
    if (error) throw error
    setMembers(prev => prev.filter(m => m.id !== id))
}, [])

const updateMember = useCallback(async (id: string, updates: Partial<Omit<Member, "id" | "joinDate">>) => {
    const { error } = await supabase.from('members').update(updates).eq('id', id)
    if (error) throw error
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m))
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

const createReservation = useCallback(async (memberId: string, date: string, timeSlot: string, area: "gym" | "cognitive" = "gym") => {
    const member = members.find(m => m.id === memberId)
    if (!member) throw new Error("Miembro no encontrado")

    // Subscription check
    if (member.plan === "Plan Basic") {
        const existing = reservations.filter(r => r.memberId === memberId && r.date === date && r.status === "confirmed")
        if (existing.length > 0 && existing[0].area !== area) {
            throw new Error("El Plan Básico solo permite reservar en un área por día.")
        }
    }

    const resId = Math.random().toString(36).substr(2, 9)
    const { error } = await supabase.from('reservations').insert([{
        id: resId,
        member_id: memberId,
        member_name: member.name,
        member_email: member.email,
        date,
        time_slot: timeSlot,
        area: area,
        status: 'confirmed'
    }])
    if (error) throw error
    return { id: resId, memberId, date, timeSlot }
}, [members])

const updateSettings = useCallback(async (updates: { gymName?: string, slogan?: string, logoUrl?: string }) => {
    const promises = Object.entries(updates).map(([key, value]) =>
        supabase.from('system_settings').update({ value }).eq('key', key)
    )
    await Promise.all(promises)
    if (updates.gymName) setGymName(updates.gymName)
    if (updates.slogan) setSlogan(updates.slogan)
    if (updates.logoUrl) setLogoUrl(updates.logoUrl)
}, [])

const cancelReservation = useCallback(async (reservationId: string) => {
    const { error } = await supabase.from('reservations').update({ status: 'cancelled' }).eq('id', reservationId)
    if (error) throw error
    setReservations(prev => prev.filter(r => r.id !== reservationId))
}, [])

const getAvailableSlots = useCallback((date: string, area: "gym" | "cognitive" = "gym"): TimeSlot[] => {
    const slots = area === "gym" ? GYM_SLOTS : COGNITIVE_SLOTS
    return slots.map(slot => {
        const slotReservations = reservations.filter(
            (r: UserReservation) => r.date === date && r.timeSlot === slot && r.area === area && r.status === "confirmed"
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
    updateMember,
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
    refreshData: loadSupabaseData,
    notifications,
    markNotificationAsRead: async (id: string) => {
        const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id)
        if (!error) setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    },
    clearNotifications,
    gymName,
    slogan,
    logoUrl,
    updateSettings
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
