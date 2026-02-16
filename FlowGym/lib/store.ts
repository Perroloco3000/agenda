"use client"

import { useState, useEffect } from "react"
import { supabase } from "./supabase"

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

export function useAppStore() {
    const [members, setMembers] = useState<Member[]>([])
    const [bookings, setBookings] = useState<Booking[]>([])
    const [workouts, setWorkouts] = useState<WorkoutStat[]>([])
    const [reservations, setReservations] = useState<UserReservation[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load Data from Supabase
    useEffect(() => {
        const loadSupabaseData = async () => {
            try {
                // Members
                const { data: mData } = await supabase.from('members').select('*')
                if (mData) {
                    setMembers(mData.map(m => ({
                        id: m.id,
                        name: m.name,
                        email: m.email,
                        phone: m.phone,
                        plan: m.plan || 'Premium',
                        status: m.status || 'Activo',
                        joinDate: m.created_at
                    })))
                }

                // Workouts
                const { data: wData } = await supabase.from('workouts').select('*')
                if (wData) setWorkouts(wData)

                // Scheduled Bookings (Classes)
                const { data: bData } = await supabase.from('scheduled_bookings').select('*')
                if (bData) setBookings(bData)

                // User Reservations (Turn Bookings)
                const { data: rData } = await supabase.from('reservations').select('*').eq('status', 'confirmed')
                if (rData) {
                    setReservations(rData.map(r => ({
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
                console.error("Error loading FlowGym data from Supabase:", error)
            }
        }

        loadSupabaseData()

        // Sync Subscriptions
        const membersSub = supabase.channel('members-all')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, payload => {
                if (payload.eventType === 'INSERT') {
                    const nm = payload.new as any
                    setMembers(prev => [...prev, {
                        id: nm.id,
                        name: nm.name,
                        email: nm.email,
                        phone: nm.phone,
                        plan: nm.plan || 'Premium',
                        status: nm.status || 'Activo',
                        joinDate: nm.created_at
                    }])
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
                    setReservations(prev => prev.map(r => r.id === ur.id ? {
                        ...r,
                        status: ur.status
                    } : r).filter(r => r.status === 'confirmed'))
                } else if (payload.eventType === 'DELETE') {
                    setReservations(prev => prev.filter(r => r.id !== payload.old.id))
                }
            }).subscribe()

        return () => {
            supabase.removeChannel(membersSub)
            supabase.removeChannel(reservationsSub)
        }
    }, [])

    // New Member Actions
    const addMember = async (member: Omit<Member, "id" | "joinDate">) => {
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
    }

    const removeMember = async (id: string) => {
        const { error } = await supabase.from('members').delete().eq('id', id)
        if (error) throw error
        setMembers(prev => prev.filter(m => m.id !== id))
    }

    const toggleMemberStatus = async (id: string) => {
        const member = members.find(m => m.id === id)
        if (!member) return
        const newStatus = member.status === 'Activo' ? 'Inactivo' : 'Activo'
        const { error } = await supabase.from('members').update({ status: newStatus }).eq('id', id)
        if (error) throw error
        setMembers(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m))
    }

    // Workout Actions
    const addWorkout = async (workout: Omit<WorkoutStat, "id">) => {
        const id = Math.random().toString(36).substr(2, 9)
        const { error } = await supabase.from('workouts').insert([{ id, ...workout }])
        if (error) throw error
        setWorkouts(prev => [...prev, { id, ...workout }])
    }

    const deleteWorkout = async (id: string) => {
        const { error } = await supabase.from('workouts').delete().eq('id', id)
        if (error) throw error
        setWorkouts(prev => prev.filter(w => w.id !== id))
    }

    const updateWorkout = async (id: string, updates: Partial<WorkoutStat>) => {
        const { error } = await supabase.from('workouts').update(updates).eq('id', id)
        if (error) throw error
        setWorkouts(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w))
    }

    // Reservation Actions (Turns)
    const createReservation = async (memberId: string, date: string, timeSlot: string) => {
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
    }

    const cancelReservation = async (reservationId: string) => {
        const { error } = await supabase.from('reservations').update({ status: 'cancelled' }).eq('id', reservationId)
        if (error) throw error
        setReservations(prev => prev.filter(r => r.id !== reservationId))
    }

    const getAvailableSlots = (date: string) => {
        return TIME_SLOTS.map(slot => {
            const slotReservations = reservations.filter(
                r => r.date === date && r.timeSlot === slot && r.status === "confirmed"
            )
            const booked = slotReservations.length
            return {
                time: slot,
                capacity: SLOT_CAPACITY,
                booked,
                available: SLOT_CAPACITY - booked
            }
        })
    }

    const getMemberReservations = (memberId: string) => {
        return reservations.filter(r => r.memberId === memberId && r.status === "confirmed")
    }

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
        isLoaded
    }
}
