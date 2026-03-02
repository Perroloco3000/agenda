"use client"

import { useState, useEffect } from "react"
import { useAppStore, UserReservation, TimeSlot } from "@/lib/store"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, Users, Plus, XCircle, CheckCircle2 } from "lucide-react"

export default function ReservationsPage() {
    const { members, reservations, createReservation, cancelReservation, getAvailableSlots } = useAppStore()
    const [selectedDate, setSelectedDate] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState("")
    const [selectedSlot, setSelectedSlot] = useState("")
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
    const [selectedArea, setSelectedArea] = useState<"gym" | "cognitive">("gym")
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    // Set today as default
    useEffect(() => {
        const today = new Date().toLocaleDateString('en-CA')
        setSelectedDate(today)
    }, [])

    // Update slots when date or area changes
    useEffect(() => {
        if (selectedDate) {
            setAvailableSlots(getAvailableSlots(selectedDate, selectedArea))
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

    const todayFilteredReservations = reservations.filter(r => r.date === selectedDate && r.status === "confirmed" && r.area === selectedArea)

    return (
        <DashboardShell>
            <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-card p-10 rounded-[2.5rem] border border-border/10">
                    <div className="space-y-2">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground uppercase">Reservas</h2>
                        <p className="text-xl text-primary font-bold uppercase tracking-widest pl-1">Agenda de Entrenamiento</p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="h-16 px-10 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 hover:bg-primary/90 transition-all active:scale-95 uppercase tracking-wider">
                                <Plus className="mr-3 h-6 w-6" />
                                Nueva Reserva
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black uppercase tracking-tight text-foreground">Nueva Reserva</DialogTitle>
                                <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Asignación de turno para usuario.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label className="text-foreground">Usuario</Label>
                                    <Select value={selectedMember} onValueChange={setSelectedMember}>
                                        <SelectTrigger className="border-border/10"><SelectValue placeholder="Selecciona un usuario" /></SelectTrigger>
                                        <SelectContent>
                                            {members.filter(m => m.status === "Activo").map(member => (
                                                <SelectItem key={member.id} value={member.id}>
                                                    {member.name}
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
                                {errorMessage && (
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">
                                        {errorMessage}
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateReservation} className="bg-primary text-primary-foreground font-black uppercase tracking-widest h-12 rounded-xl px-8 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Confirmar Reserva</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Date & Area Selectors (Agenda Style) */}
                <Card className="border-border/10 bg-card rounded-[2.5rem] shadow-2xl">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl font-black text-foreground flex items-center gap-3">
                            <Calendar className="h-6 w-6 text-primary" />
                            Selecciona tu Fecha
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row gap-8">
                        <div className="space-y-3">
                            <Label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest pl-1">Día del Entrenamiento</Label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={e => setSelectedDate(e.target.value)}
                                className="w-full md:w-72 h-14 px-6 rounded-2xl bg-background border border-border/10 text-foreground font-bold text-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all uppercase"
                            />
                        </div>

                        <div className="space-y-3 flex-1">
                            <Label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest pl-1">Área de Entrenamiento</Label>
                            <div className="grid grid-cols-2 gap-3 p-1.5 bg-background rounded-2xl border border-border/10 h-14">
                                <button
                                    onClick={() => setSelectedArea("gym")}
                                    className={`rounded-xl font-black uppercase text-xs tracking-wider transition-all ${selectedArea === "gym" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    Gimnasio
                                </button>
                                <button
                                    onClick={() => setSelectedArea("cognitive")}
                                    className={`rounded-xl font-black uppercase text-xs tracking-wider transition-all ${selectedArea === "cognitive" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    Área Cognitiva
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Success Message UI */}
                {successMessage && (
                    <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 font-bold uppercase tracking-widest text-xs">
                        <CheckCircle2 className="h-5 w-5" />
                        {successMessage}
                    </div>
                )}

                {/* Time Slots Grid (Agenda Style) */}
                <div className="space-y-8">
                    <h3 className="text-2xl font-black text-foreground px-2 flex items-center gap-3 uppercase tracking-tight">
                        <Clock className="h-6 w-6 text-primary" />
                        Turnos de Hoy
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {availableSlots.map((slot) => {
                            const status = getSlotStatus(slot.available, slot.capacity)
                            const slotReservations = todayFilteredReservations.filter(r => r.timeSlot === slot.time)

                            return (
                                <Card key={slot.time} className="border-white/10 bg-white/5 backdrop-blur-xl hover:border-emerald-500/30 transition-all duration-500 group overflow-hidden rounded-[2.5rem]">
                                    <CardContent className="p-8 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                                                    <Clock className="h-5 w-5 text-primary" />
                                                </div>
                                                <span className="text-2xl font-black text-foreground">{slot.time}</span>
                                            </div>
                                            <div className={`w-3 h-3 rounded-full ${status.color === 'bg-green-500' ? 'bg-primary' : status.color} shadow-[0_0_10px_currentcolor] animate-pulse`} />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                                                <span className="text-muted-foreground/40">Cupos Ocupados</span>
                                                <span className="text-foreground">{slot.booked} / {slot.capacity}</span>
                                            </div>
                                            <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                                                <div
                                                    className={`h-full ${status.color} transition-all duration-700`}
                                                    style={{ width: `${(slot.booked / slot.capacity) * 100}%` }}
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">{status.text}</p>
                                        </div>

                                        {/* Member List for this slot */}
                                        <div className="space-y-3 pt-4 border-t border-white/5">
                                            {slotReservations.map(reservation => (
                                                <div key={reservation.id} className="flex items-center justify-between group/user p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-black text-primary uppercase">
                                                            {reservation.memberName.charAt(0)}
                                                        </div>
                                                        <span className="text-xs font-bold text-muted-foreground group-hover/user:text-primary uppercase tracking-tight transition-colors">{reservation.memberName}</span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleCancelReservation(reservation.id)}
                                                        className="h-7 w-7 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover/user:opacity-100"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            {slotReservations.length === 0 && (
                                                <p className="text-[10px] text-center text-slate-600 font-bold uppercase tracking-widest py-2">Sin Reservas</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>
        </DashboardShell>
    )
}
