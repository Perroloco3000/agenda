"use client"

import { useState, useEffect } from "react"
import { useAppStore, UserReservation, TimeSlot } from "@/lib/store"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, Users, Plus, XCircle, CheckCircle2, TrendingUp } from "lucide-react"
import { TIME_SLOTS, GYM_SLOTS, COGNITIVE_SLOTS } from "@/lib/store"

export default function ReservationsPage() {
    const { members, reservations, createReservation, cancelReservation, getAvailableSlots } = useAppStore()
    const [selectedDate, setSelectedDate] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState("")
    const [selectedSlot, setSelectedSlot] = useState("")
    const [availableSlots, setAvailableSlots] = useState<ReturnType<typeof getAvailableSlots>>([])
    const [todayReservations, setTodayReservations] = useState<typeof reservations>([])
    const [selectedArea, setSelectedArea] = useState<"gym" | "cognitive">("gym")
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    // Set today as default
    useEffect(() => {
        const today = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD local
        setSelectedDate(today)
    }, [])

    // Update slots and reservations when date or area changes
    useEffect(() => {
        if (selectedDate) {
            setAvailableSlots(getAvailableSlots(selectedDate, selectedArea))
            const filtered = reservations.filter((r: UserReservation) => r.date === selectedDate && r.status === "confirmed" && r.area === selectedArea)
            setTodayReservations(filtered)
        }
    }, [selectedDate, selectedArea, reservations, getAvailableSlots])

    const handleCreateReservation = async () => {
        if (!selectedMember || !selectedSlot) {
            setErrorMessage("Selecciona un miembro y un turno")
            return
        }

        try {
            await createReservation(selectedMember, selectedDate, selectedSlot, selectedArea)
            setSuccessMessage("¡Reserva creada exitosamente!")
            setErrorMessage("")
            setIsCreateOpen(false)
            setSelectedMember("")
            setSelectedSlot("")
            setTimeout(() => setSuccessMessage(""), 3000)
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : "Error al crear reserva")
            setSuccessMessage("")
        }
    }

    const handleCancelReservation = async (reservationId: string) => {
        if (confirm("¿Estás seguro de cancelar esta reserva?")) {
            try {
                await cancelReservation(reservationId)
                setSuccessMessage("Reserva cancelada")
                setTimeout(() => setSuccessMessage(""), 3000)
            } catch (err) {
                setErrorMessage("Error al cancelar")
            }
        }
    }

    const getSlotStatus = (available: number, capacity: number) => {
        const percentage = (available / capacity) * 100
        if (percentage > 50) return { color: "bg-green-500", text: "Disponible" }
        if (percentage > 20) return { color: "bg-yellow-500", text: "Casi lleno" }
        if (percentage > 0) return { color: "bg-orange-500", text: "Últimos lugares" }
        return { color: "bg-red-500", text: "Completo" }
    }

    const stats = {
        totalReservations: todayReservations.length,
        totalCapacity: availableSlots.reduce((acc, slot) => acc + slot.capacity, 0),
        occupancy: availableSlots.length > 0
            ? Math.round((todayReservations.length / availableSlots.reduce((acc, slot) => acc + slot.capacity, 0)) * 100)
            : 0
    }

    return (
        <DashboardShell>
            <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10">
                    <div className="space-y-4">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none bg-clip-text text-transparent bg-gradient-to-br from-white to-white/40">Reservas</h2>
                        <p className="text-xl text-white/40 font-bold uppercase tracking-widest italic">Panel de Control de Turnos</p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="h-20 px-10 rounded-[2rem] bg-emerald-500 text-black font-black text-xl italic shadow-2xl shadow-emerald-500/30 hover:scale-105 hover:bg-emerald-400 transition-all active:scale-95 uppercase tracking-tighter">
                                <Plus className="mr-3 h-8 w-8" />
                                Nueva Reserva
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Crear Nueva Reserva</DialogTitle>
                                <DialogDescription>Asigna un turno a un miembro.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Miembro</Label>
                                    <Select value={selectedMember} onValueChange={setSelectedMember}>
                                        <SelectTrigger><SelectValue placeholder="Selecciona un miembro" /></SelectTrigger>
                                        <SelectContent>
                                            {members.filter(m => m.status === "Activo").map(member => (
                                                <SelectItem key={member.id} value={member.id}>
                                                    {member.name} - {member.email}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Turno</Label>
                                    <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                                        <SelectTrigger><SelectValue placeholder="Selecciona un turno" /></SelectTrigger>
                                        <SelectContent>
                                            {availableSlots.filter(slot => slot.available > 0).map(slot => (
                                                <SelectItem key={slot.time} value={slot.time}>
                                                    {slot.time} - {slot.available}/{slot.capacity} disponibles
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Área</Label>
                                    <Select value={selectedArea} onValueChange={(v: "gym" | "cognitive") => setSelectedArea(v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gym">Gimnasio</SelectItem>
                                            <SelectItem value="cognitive">Área Cognitiva</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {errorMessage && (
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                        {errorMessage}
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateReservation}>Crear Reserva</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Reservas Hoy</p>
                                <p className="text-5xl font-black tracking-tighter italic">{stats.totalReservations}</p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <Calendar className="h-8 w-8 text-emerald-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Capacidad Total</p>
                                <p className="text-5xl font-black tracking-tighter italic">{stats.totalCapacity}</p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                <Users className="h-8 w-8 text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Ocupación</p>
                                <p className="text-5xl font-black tracking-tighter italic">{stats.occupancy}%</p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                <TrendingUp className="h-8 w-8 text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {successMessage && (
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle2 className="h-5 w-5" />
                        {successMessage}
                    </div>
                )}

                {/* Date Selector */}
                <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-10 shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                             <Calendar className="h-6 w-6" />
                        </div>
                        <h3 className="text-3xl font-black uppercase italic tracking-tigh">Seleccionar Fecha</h3>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Fecha de Turno</Label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={e => setSelectedDate(e.target.value)}
                                className="w-full h-16 px-6 rounded-2xl bg-white/5 border border-white/10 font-bold text-xl uppercase italic focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            />
                        </div>
                        <div className="flex-1 space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Área de Entrenamiento</Label>
                            <Select value={selectedArea} onValueChange={(v: "gym" | "cognitive") => setSelectedArea(v)}>
                                <SelectTrigger className="h-16 rounded-2xl bg-white/5 border border-white/10 font-bold text-xl uppercase italic"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-zinc-950 border-white/10">
                                    <SelectItem value="gym" className="font-bold py-3">GIMNASIO</SelectItem>
                                    <SelectItem value="cognitive" className="font-bold py-3">ÁREA COGNITIVA</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Reservations by Time Slot */}
                <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-10 shadow-2xl overflow-hidden">
                    <div className="flex flex-col gap-2 mb-10">
                        <h3 className="text-4xl font-black uppercase italic tracking-tighter">Reservas por Turno</h3>
                        <p className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">
                            {new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    
                    <div>
                        {todayReservations.length === 0 ? (
                            <div className="text-center py-20 bg-white/[0.02] rounded-[2.5rem] border border-white/5 border-dashed">
                                <Calendar className="h-20 w-20 text-white/5 mx-auto mb-6" />
                                <p className="text-white/20 font-black uppercase tracking-widest italic text-sm">No hay reservas para esta fecha</p>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {(selectedArea === 'gym' ? GYM_SLOTS : COGNITIVE_SLOTS).map((slot: string) => {
                                    const slotReservations = todayReservations.filter((r: UserReservation) => r.timeSlot === slot)
                                    if (slotReservations.length === 0) return null
 
                                    const slotInfo = availableSlots.find((s: TimeSlot) => s.time === slot)
                                    const status = slotInfo ? getSlotStatus(slotInfo.available, slotInfo.capacity) : null
 
                                    return (
                                        <div key={slot} className="relative group/slot">
                                            <div className="flex items-center justify-between mb-6 px-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/slot:bg-emerald-500/20 group-hover/slot:border-emerald-500/40 transition-all duration-500">
                                                        <Clock className="h-6 w-6 text-emerald-400" />
                                                    </div>
                                                    <h3 className="text-3xl font-black italic tracking-tighter uppercase">{slot}</h3>
                                                </div>
                                                {slotInfo && (
                                                    <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                                                        <div className={`w-2.5 h-2.5 rounded-full ${status?.color} shadow-[0_0_10px_currentcolor] animate-pulse`} />
                                                        <span className="font-black text-[10px] uppercase tracking-widest italic">{slotInfo.booked}/{slotInfo.capacity} ENTRENANDO</span>
                                                    </div>
                                                )}
                                            </div>
 
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {slotReservations.map(reservation => (
                                                    <div key={reservation.id} className="relative group bg-white/[0.03] p-6 rounded-[2rem] border border-white/[0.05] hover:bg-white/[0.07] hover:border-emerald-500/20 transition-all duration-300">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center font-black text-emerald-400 text-xl italic group-hover:scale-110 transition-transform">
                                                                    {reservation.memberName.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-xl tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">{reservation.memberName}</p>
                                                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.1em] mt-0.5">{reservation.memberEmail}</p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                onClick={() => handleCancelReservation(reservation.id)}
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-10 w-10 rounded-xl hover:bg-red-500/20 text-white/20 hover:text-red-400 border border-transparent hover:border-red-500/30 transition-all"
                                                            >
                                                                <XCircle className="h-5 w-5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </DashboardShell>
    )
}
