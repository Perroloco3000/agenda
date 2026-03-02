"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore, TimeSlot, Booking } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { getVenezuelaTime, getVenezuelaDateString, cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accessibility, LogOut, Calendar, Clock, Users, CheckCircle2, XCircle, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function BookingPage() {
    const router = useRouter()
    const { currentUser, logout, getAvailableSlots, createBooking, getUserBookings, cancelBooking, cancelAllUserBookings, gymName, logoUrl } = useStore()
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedArea, setSelectedArea] = useState<"gym" | "cognitive">("gym")
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    // Redirect if not logged in
    useEffect(() => {
        if (!currentUser) {
            router.push("/")
        }
    }, [currentUser, router])

    // Set today as default date
    useEffect(() => {
        const today = new Date().toLocaleDateString('en-CA')
        setSelectedDate(today)
    }, [])

    const motivationalQuotes = [
        "La excelencia no es un acto, es un hábito.",
        "Tu única competencia eres tú mismo.",
        "El éxito comienza con la autodisciplina.",
        "Hoy es un buen día para superar tus límites.",
        "No te detengas hasta que estés orgulloso.",
        "La persistencia vence a la resistencia.",
        "Entrena como un profesional, vive como un campeón.",
        "Fuerte en mente, fuerte en cuerpo."
    ]

    const [quote, setQuote] = useState("")

    useEffect(() => {
        setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)])
    }, [])

    // Derived values directly from store
    const availableSlots = getAvailableSlots(selectedDate, selectedArea)
    const myBookings = currentUser ? getUserBookings(currentUser.id) : []

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    const handleBooking = async (timeSlot: string) => {
        if (!currentUser) return

        try {
            await createBooking(currentUser.id, selectedDate, timeSlot, selectedArea)
            toast.success(`¡Reserva confirmada para ${selectedArea === 'gym' ? 'Gimnasio' : 'Área Cognitiva'} a las ${timeSlot}!`)
            setSuccessMessage(`¡Reserva confirmada para ${timeSlot}!`)
            setErrorMessage("")

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(""), 3000)
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error al reservar"
            toast.error(msg)
            setErrorMessage(msg)
            setSuccessMessage("")
        }
    }

    const getSlotStatus = (available: number, capacity: number) => {
        const percentage = (available / capacity) * 100
        if (percentage > 50) return { color: "bg-green-500", text: "Disponible" }
        if (percentage > 20) return { color: "bg-yellow-500", text: "Casi lleno" }
        if (percentage > 0) return { color: "bg-orange-500", text: "Últimos lugares" }
        return { color: "bg-red-500", text: "Completo" }
    }

    if (!currentUser) return null

    return (
        <div className="min-h-screen bg-[#F5F1E6]">
            {/* Header */}
            <header className="bg-card/50 backdrop-blur-md border-b border-border/10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex flex-col items-center">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="h-24 flex items-center justify-center cursor-pointer"
                        >
                            {logoUrl ? (
                                <img src={logoUrl} alt="Logo" className="h-full object-contain" />
                            ) : (
                                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                    <Accessibility className="h-7 w-7 text-primary-foreground" />
                                </div>
                            )}
                        </motion.div>
                        <div className="mt-2 text-center">
                            <h1 className="text-sm font-black tracking-[0.3em] uppercase text-foreground leading-none">{gymName || "KAI CENTER"}</h1>
                            <p className="text-[8px] font-bold text-primary tracking-[0.2em] uppercase mt-1">Osteomuscular Peace</p>
                        </div>
                    </div>

                    <div className="hidden md:block flex-1 max-w-xl mx-auto px-8">
                        <p className="text-center italic text-primary/60 font-medium text-sm">
                            "{quote}"
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-foreground">{currentUser.name}</p>
                            <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                        </div>
                        <Button onClick={handleLogout} variant="outline" className="border-border/30 text-primary hover:bg-primary/10">
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto p-6 space-y-10">
                {/* Date Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Card className="border-border/5 bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-2xl font-black text-foreground flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-xl">
                                        <Calendar className="h-6 w-6 text-primary" />
                                    </div>
                                    Selecciona tu Fecha
                                </CardTitle>
                                <Sparkles className="h-5 w-5 text-primary/30 animate-pulse" />
                            </div>
                            <CardDescription className="text-muted-foreground font-medium ml-12">Elige el día para tu entrenamiento de paz</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col md:flex-row gap-6">
                            <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs font-bold uppercase tracking-widest pl-1">Día</Label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={e => setSelectedDate(e.target.value)}
                                    min={getVenezuelaDateString()}
                                    className="w-full md:w-64 px-4 py-3 rounded-xl bg-background border border-border/20 text-foreground font-bold text-lg focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div className="space-y-2 flex-1">
                                <Label className="text-muted-foreground text-xs font-bold uppercase tracking-widest pl-1">Área de Entrenamiento</Label>
                                <div className="grid grid-cols-2 gap-2 p-1 bg-background border border-border/20 rounded-xl">
                                    <button
                                        onClick={() => setSelectedArea("gym")}
                                        className={`py-2.5 rounded-lg font-black uppercase tracking-tighter transition-all ${selectedArea === "gym" ? "bg-primary text-primary-foreground shadow-lg" : "text-foreground/40 hover:text-foreground/60"}`}
                                    >
                                        Gimnasio
                                    </button>
                                    <button
                                        onClick={() => setSelectedArea("cognitive")}
                                        className={`py-2.5 rounded-lg font-black uppercase tracking-tighter transition-all ${selectedArea === "cognitive" ? "bg-primary text-primary-foreground shadow-lg" : "text-foreground/40 hover:text-foreground/60"}`}
                                    >
                                        Área Cognitiva
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Messages */}
                    {successMessage && (
                        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <CheckCircle2 className="h-5 w-5" />
                            {successMessage}
                        </div>
                    )}
                    {errorMessage && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <XCircle className="h-5 w-5" />
                            {errorMessage}
                        </div>
                    )}

                    {/* Time Slots Grid */}
                    <div>
                        <h2 className="text-2xl font-black text-foreground mb-6 flex items-center gap-2">
                            <Clock className="h-6 w-6 text-primary" />
                            Turnos Disponibles
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {availableSlots.map((slot: TimeSlot) => {
                                const status = getSlotStatus(slot.available, slot.capacity)
                                const isBooked = myBookings.some((b: Booking) => b.timeSlot === slot.time && b.date === selectedDate)

                                return (
                                    <motion.div
                                        key={slot.time}
                                        whileHover={{ y: -5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className="border-border/5 bg-card hover:border-primary/20 transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] rounded-[2rem] group">
                                            <CardContent className="p-8 space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                                                            <Clock className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <span className="text-2xl font-black text-foreground tracking-tight">{slot.time}</span>
                                                    </div>
                                                    <div className={`w-3 h-3 rounded-full ${status.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                                                        <span className="text-muted-foreground/60">Disponibilidad</span>
                                                        <span className="text-foreground">{slot.available}/{slot.capacity}</span>
                                                    </div>
                                                    <div className="w-full bg-background/50 rounded-full h-1.5 overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(slot.booked / slot.capacity) * 100}%` }}
                                                            className={`h-full ${status.color} transition-all duration-1000`}
                                                        />
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground/50 font-black uppercase tracking-[0.2em]">{status.text}</p>
                                                </div>

                                                {isBooked ? (
                                                    <Button disabled className="w-full bg-green-500/20 text-green-400 border border-green-500/30">
                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                        Ya Reservado
                                                    </Button>
                                                ) : (() => {
                                                    const [startStr] = slot.time.split('-');
                                                    const [hour, min] = startStr.split(':').map(Number);
                                                    const venezuelaNow = getVenezuelaTime();
                                                    const slotTime = new Date(venezuelaNow);
                                                    slotTime.setHours(hour, min, 0, 0);

                                                    // Inactivate 15 mins before
                                                    const cutoffTime = new Date(slotTime.getTime() - 15 * 60000);
                                                    const isDateToday = selectedDate === getVenezuelaDateString();
                                                    const isPastOrClosing = isDateToday && venezuelaNow > cutoffTime;

                                                    return (
                                                        <div className="space-y-2">
                                                            {isPastOrClosing && !isBooked && (
                                                                <div className="flex items-center gap-2 text-[10px] font-bold text-red-400 uppercase tracking-widest justify-center bg-red-400/5 py-1 rounded-lg border border-red-400/10">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                                    Turno Inactivo (15m antes)
                                                                </div>
                                                            )}
                                                            <Button
                                                                onClick={() => handleBooking(slot.time)}
                                                                disabled={slot.available === 0 || isPastOrClosing}
                                                                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30"
                                                            >
                                                                {isPastOrClosing ? (
                                                                    <span className="opacity-50">Cerrado</span>
                                                                ) : (
                                                                    <div className="flex items-center gap-2">
                                                                        Reservar
                                                                        <ChevronRight className="h-4 w-4" />
                                                                    </div>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    );
                                                })()}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>

                    {/* My Bookings */}
                    {myBookings.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="border-border/5 bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden">
                                <CardHeader className="p-8 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-2xl font-black text-foreground uppercase tracking-tight">Mis Reservas</CardTitle>
                                            <CardDescription className="text-muted-foreground font-medium tracking-wide">Tus próximos entrenamientos de paz</CardDescription>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={async () => {
                                                if (confirm("¿Seguro que quieres borrar TODAS tus reservas?")) {
                                                    toast.promise(cancelAllUserBookings(currentUser.id), {
                                                        loading: 'Cancelando todas las reservas...',
                                                        success: 'Todas las reservas canceladas',
                                                        error: 'Error al cancelar reservas'
                                                    })
                                                }
                                            }}
                                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold"
                                        >
                                            Borrar Todas
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {myBookings.map((booking: Booking) => (
                                            <motion.div
                                                key={booking.id}
                                                layout
                                                className="p-6 rounded-[2rem] bg-background/40 border border-border/5 flex items-center justify-between hover:bg-background/80 transition-all duration-500"
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                                                        <Calendar className="h-7 w-7 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3">
                                                            <p className="font-black text-2xl text-foreground tracking-tight">{booking.timeSlot}</p>
                                                            <span className="text-[9px] font-black uppercase bg-primary/10 px-3 py-1 rounded-full text-primary border border-primary/10 tracking-widest">
                                                                {booking.area === 'gym' ? 'Gimnasio' : 'Área Cognitiva'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-widest opacity-60">
                                                            {new Date(booking.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
                                                        <span className="text-green-400 font-bold text-sm">Confirmado</span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={async () => {
                                                            if (confirm("¿Seguro que quieres cancelar tu reserva?")) {
                                                                toast.promise(cancelBooking(booking.id), {
                                                                    loading: 'Cancelando reserva...',
                                                                    success: 'Reserva cancelada correctamente',
                                                                    error: 'Error al cancelar reserva'
                                                                })
                                                            }
                                                        }}
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Dev Tools */}
                    <div className="pt-12 flex justify-center opacity-20 hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                                const { clearAllTestData } = useStore()
                                if (confirm("¿Deseas eliminar todos los datos de prueba (Miembros y Reservas)?")) {
                                    await clearAllTestData()
                                    window.location.reload()
                                }
                            }}
                            className="text-[10px] text-slate-500 uppercase tracking-widest font-bold"
                        >
                            Limpiar Datos de Prueba
                        </Button>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
