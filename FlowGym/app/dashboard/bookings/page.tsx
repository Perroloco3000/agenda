"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Calendar as CalendarIcon, Clock, Users, Plus, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore, Booking } from "@/lib/store"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BookingsPage() {
    const { bookings, workouts, addBooking, incrementBooking } = useAppStore()
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newBooking, setNewBooking] = useState<Partial<Booking>>({
        time: "08:00", workout: "", instructor: "", capacity: 20, date: "Today"
    })

    const handleCreate = () => {
        if (newBooking.workout && newBooking.time) {
            addBooking({
                time: newBooking.time,
                workout: newBooking.workout,
                instructor: newBooking.instructor || "Instructor",
                capacity: Number(newBooking.capacity) || 20,
                date: "Today"
            })
            setIsCreateOpen(false)
            setNewBooking({ time: "08:00", workout: "", instructor: "", capacity: 20, date: "Today" })
        }
    }

    return (
        <DashboardShell>
            <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Reservas</h2>
                        <p className="text-xl text-muted-foreground font-medium">Gestiona el horario de clases y asistencias.</p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="h-16 px-8 rounded-3xl bg-primary text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                                <Plus className="mr-2 h-6 w-6" />
                                Nueva Clase
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Programar Clase</DialogTitle>
                                <DialogDescription>Añade una sesión al calendario.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Hora</Label>
                                        <Input type="time" value={newBooking.time} onChange={e => setNewBooking({ ...newBooking, time: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Capacidad</Label>
                                        <Input type="number" value={newBooking.capacity} onChange={e => setNewBooking({ ...newBooking, capacity: Number(e.target.value) })} />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Rutina</Label>
                                    <Select value={newBooking.workout} onValueChange={v => setNewBooking({ ...newBooking, workout: v })}>
                                        <SelectTrigger><SelectValue placeholder="Selecciona rutina" /></SelectTrigger>
                                        <SelectContent>
                                            {workouts.map(w => (
                                                <SelectItem key={w.id} value={w.name}>{w.name}</SelectItem>
                                            ))}
                                            <SelectItem value="OPEN GYM">OPEN GYM</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Instructor</Label>
                                    <Input value={newBooking.instructor} onChange={e => setNewBooking({ ...newBooking, instructor: e.target.value })} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreate}>Programar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Calendar Navigation Bar */}
                <div className="flex items-center justify-between bg-card p-8 rounded-[2.5rem] border border-border/50 shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex flex-col items-center justify-center font-black">
                            <span className="text-primary text-xs uppercase leading-none mb-1">Feb</span>
                            <span className="text-2xl leading-none">11</span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-black uppercase tracking-tight">Hoy</h3>
                            <p className="text-muted-foreground font-medium">Programación del Día</p>
                        </div>
                    </div>
                </div>

                {/* Sessions List */}
                <div className="grid grid-cols-1 gap-6">
                    {bookings.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">No hay clases programadas para hoy via Admin.</div>
                    ) : bookings.map((session) => (
                        <div key={session.id} className="group p-8 bg-card rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="flex items-center gap-10">
                                <div className="flex items-center gap-4 text-primary">
                                    <Clock className="h-8 w-8" />
                                    <span className="text-4xl font-black tabular-nums tracking-tighter">{session.time}</span>
                                </div>
                                <div className="w-px h-12 bg-border/50 hidden lg:block" />
                                <div>
                                    <h4 className="text-2xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">{session.workout}</h4>
                                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                                        Instructor: <span className="text-foreground font-bold">{session.instructor}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-8">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Capacidad</span>
                                        <span className="text-sm font-black">{session.booked}/{session.capacity}</span>
                                    </div>
                                    <div className="w-48 h-3 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ${session.booked === session.capacity ? 'bg-destructive' : 'bg-primary'}`}
                                            style={{ width: `${(session.booked / session.capacity) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        onClick={() => incrementBooking(session.id)}
                                        disabled={session.booked >= session.capacity}
                                        className={`h-14 px-8 rounded-2xl font-black uppercase tracking-widest shadow-lg transition-all ${session.booked === session.capacity
                                            ? 'bg-destructive/10 text-destructive border border-destructive/20 cursor-not-allowed shadow-none'
                                            : 'bg-primary text-primary-foreground shadow-primary/20 hover:scale-105 active:scale-95'
                                            }`}>
                                        {session.booked === session.capacity ? 'Lleno' : 'Registrar Asistente'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Create Session Section */}
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-8 bg-gradient-to-b from-transparent to-muted/20 rounded-[4rem] border border-dashed border-muted">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                        <Plus className="h-12 w-12 text-primary" />
                    </div>
                    <div className="max-w-md">
                        <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Programar más clases</h3>
                        <p className="text-muted-foreground font-medium">Añade nuevas sesiones al horario para que tus miembros puedan reservar su lugar.</p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)} variant="outline" size="lg" className="h-16 px-12 rounded-3xl border-2 font-black text-lg uppercase tracking-widest">
                        Añadir Clase Ahora
                    </Button>
                </div>
            </section>
        </DashboardShell>
    )
}
