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
import { TIME_SLOTS } from "@/lib/store"

export default function ReservationsPage() {
    const { members, reservations, createReservation, cancelReservation, getAvailableSlots } = useAppStore()
    const [selectedDate, setSelectedDate] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState("")
    const [selectedSlot, setSelectedSlot] = useState("")
    const [availableSlots, setAvailableSlots] = useState<ReturnType<typeof getAvailableSlots>>([])
    const [todayReservations, setTodayReservations] = useState<typeof reservations>([])
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    // Set today as default
    useEffect(() => {
        const today = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD local
        setSelectedDate(today)
    }, [])

    // Update slots and reservations when date changes
    useEffect(() => {
        if (selectedDate) {
            setAvailableSlots(getAvailableSlots(selectedDate))
            const filtered = reservations.filter((r: UserReservation) => r.date === selectedDate && r.status === "confirmed")
            setTodayReservations(filtered)
        }
    }, [selectedDate, reservations, getAvailableSlots])

    const handleCreateReservation = async () => {
        if (!selectedMember || !selectedSlot) {
            setErrorMessage("Selecciona un miembro y un turno")
            return
        }

        try {
            await createReservation(selectedMember, selectedDate, selectedSlot)
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
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Reservas</h2>
                        <p className="text-xl text-muted-foreground font-medium">Gestiona las reservas de turnos de los miembros.</p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="h-16 px-8 rounded-3xl bg-primary text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                                <Plus className="mr-2 h-6 w-6" />
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Reservas Hoy</p>
                                    <p className="text-4xl font-black mt-2">{stats.totalReservations}</p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                    <Calendar className="h-7 w-7 text-emerald-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Capacidad Total</p>
                                    <p className="text-4xl font-black mt-2">{stats.totalCapacity}</p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                    <Users className="h-7 w-7 text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Ocupación</p>
                                    <p className="text-4xl font-black mt-2">{stats.occupancy}%</p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                                    <TrendingUp className="h-7 w-7 text-purple-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Messages */}
                {successMessage && (
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle2 className="h-5 w-5" />
                        {successMessage}
                    </div>
                )}

                {/* Date Selector */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl font-black flex items-center gap-2">
                            <Calendar className="h-6 w-6 text-emerald-400" />
                            Seleccionar Fecha
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                            className="w-full md:w-auto px-4 py-3 rounded-xl bg-background border border-border font-bold text-lg"
                        />
                    </CardContent>
                </Card>

                {/* Reservations by Time Slot */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl font-black">Reservas por Turno</CardTitle>
                        <CardDescription>
                            {new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {todayReservations.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                                <p className="text-muted-foreground font-medium">No hay reservas para esta fecha</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {TIME_SLOTS.map((slot: string) => {
                                    const slotReservations = todayReservations.filter((r: UserReservation) => r.timeSlot === slot)
                                    if (slotReservations.length === 0) return null

                                    const slotInfo = availableSlots.find((s: TimeSlot) => s.time === slot)
                                    const status = slotInfo ? getSlotStatus(slotInfo.available, slotInfo.capacity) : null

                                    return (
                                        <div key={slot} className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Clock className="h-5 w-5 text-emerald-400" />
                                                    <h3 className="text-xl font-black">{slot}</h3>
                                                </div>
                                                {slotInfo && (
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-3 h-3 rounded-full ${status?.color} animate-pulse`} />
                                                        <span className="font-bold text-sm">{slotInfo.booked}/{slotInfo.capacity} personas</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {slotReservations.map(reservation => (
                                                    <div key={reservation.id} className="p-4 rounded-xl bg-muted/50 border border-border flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center font-black text-emerald-400">
                                                                {reservation.memberName.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold">{reservation.memberName}</p>
                                                                <p className="text-xs text-muted-foreground">{reservation.memberEmail}</p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            onClick={() => handleCancelReservation(reservation.id)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>
        </DashboardShell>
    )
}
