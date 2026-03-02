"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore, TimeSlot, Booking } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { getVenezuelaTime, getVenezuelaDateString, cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accessibility, LogOut, Calendar, Clock, Users, CheckCircle2, XCircle, Sparkles, ChevronRight } from "lucide-react"
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
            {/* Header Etéreo */}
            <header className="sticky top-0 z-50 bg-[#F5F1E6]/60 backdrop-blur-2xl border-b border-[#9B8C7A]/5 px-8 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="h-20 flex items-center justify-center cursor-pointer"
                        >
                            {logoUrl ? (
                                <img src={logoUrl} alt="Logo" className="h-full object-contain filter drop-shadow-md" />
                            ) : (
                                <div className="w-12 h-12 rounded-2xl bg-[#3B7552] flex items-center justify-center shadow-lg shadow-[#3B7552]/10">
                                    <Accessibility className="h-7 w-7 text-white" />
                                </div>
                            )}
                        </motion.div>
                    </div>

                    <div className="hidden lg:block flex-1 max-w-md mx-auto relative overflow-hidden group">
                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                            {/* Decorative Leaf SVG or Image placeholder behavior */}
                            <svg viewBox="0 0 100 100" className="h-full w-full fill-[#3B7552]">
                                <path d="M50 10C50 10 30 40 30 60C30 80 50 90 50 90C50 90 70 80 70 60C70 40 50 10 50 10Z" opacity="0.2" />
                            </svg>
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={quote}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-center italic text-[#3B7552] font-black text-[13px] tracking-widest relative z-10"
                            >
                                "{quote}"
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black text-[#3E3A33] uppercase tracking-wider">{currentUser.name}</p>
                            <p className="text-[10px] text-[#9B8C7A] font-bold uppercase tracking-widest">{currentUser.plan || "Guest"}</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 117, 82, 0.1)" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleLogout}
                            className="p-2.5 rounded-2xl border border-[#9B8C7A]/10 text-[#3B7552] transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                        </motion.button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto p-8 space-y-16">
                {/* Selector Integrado */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative"
                >
                    <img
                        src="file:///C:/Users/Promiley/.gemini/antigravity/brain/73160ea1-3bae-4b08-9466-87c0c5f92f43/leaf_silhouette_accent_png_1772423764045.png"
                        alt=""
                        className="absolute -left-20 -top-20 w-64 h-64 opacity-[0.07] pointer-events-none rotate-45"
                    />
                    <div className="bg-white/80 backdrop-blur-3xl shadow-[0_10px_50px_rgba(59,117,82,0.03)] rounded-[3.5rem] p-5 flex flex-col md:flex-row gap-4 items-center border border-white/40 ring-1 ring-[#3B7552]/5 relative z-10">
                        <div className="flex-1 w-full pl-8 py-5 border-b md:border-b-0 md:border-r border-[#3B7552]/10 group transition-all">
                            <div className="flex items-center gap-4 text-[#3B7552] mb-2 uppercase tracking-[0.3em] text-[10px] font-black">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Fecha de Sesión</span>
                            </div>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={e => setSelectedDate(e.target.value)}
                                min={getVenezuelaDateString()}
                                className="w-full bg-transparent border-none p-0 text-[#3E3A33] font-black text-2xl focus:ring-0 cursor-pointer selection:bg-[#3B7552]/20"
                            />
                        </div>
                        <div className="flex-1 w-full pl-6 py-4">
                            <div className="flex items-center gap-4 text-[#3B7552] mb-2 uppercase tracking-[0.3em] text-[10px] font-black">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Experiencia</span>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setSelectedArea("gym")}
                                    className={`text-lg font-black tracking-tight transition-all duration-500 uppercase ${selectedArea === "gym" ? "text-[#3B7552]" : "text-[#3E3A33]/20 hover:text-[#3E3A33]/40"}`}
                                >
                                    Gimnasio
                                </button>
                                <span className="text-[#3B7552]/20 font-light">|</span>
                                <button
                                    onClick={() => setSelectedArea("cognitive")}
                                    className={`text-lg font-black tracking-tight transition-all duration-500 uppercase ${selectedArea === "cognitive" ? "text-[#3B7552]" : "text-[#3E3A33]/20 hover:text-[#3E3A33]/40"}`}
                                >
                                    Cognitivo
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Messages */}
                <div className="space-y-4">
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-600 flex items-center gap-3 font-bold text-sm"
                        >
                            <CheckCircle2 className="h-5 w-5" />
                            {successMessage}
                        </motion.div>
                    )}
                    {errorMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-center gap-3 font-bold text-sm"
                        >
                            <XCircle className="h-5 w-5" />
                            {errorMessage}
                        </motion.div>
                    )}
                </div>

                {/* Grid de Turnos Refinado */}
                <div className="space-y-8 mt-12">
                    <div className="flex items-end justify-between px-4">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-[#3E3A33] tracking-tighter uppercase leading-none">Turnos de Hoy</h2>
                            <p className="text-[10px] font-black text-[#3B7552] tracking-[0.5em] uppercase pl-1">Horarios exclusivos disponibles</p>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black text-[#3B7552] tracking-widest uppercase bg-white/80 px-5 py-2.5 rounded-full border border-[#3B7552]/10 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-[#3B7552] animate-pulse" />
                            En línea
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {availableSlots.map((slot: TimeSlot, idx: number) => {
                            const status = getSlotStatus(slot.available, slot.capacity)
                            const isBooked = myBookings.some((b: Booking) => b.timeSlot === slot.time && b.date === selectedDate)

                            return (
                                <motion.div
                                    key={slot.time}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05, duration: 0.7 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="relative group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#3B7552]/10 to-transparent rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl" />
                                    <Card className="relative border-none bg-white/90 backdrop-blur-sm shadow-[0_10px_60px_rgba(0,0,0,0.015)] rounded-[3rem] overflow-hidden transition-all duration-700 ring-1 ring-white/50 group-hover:ring-[#3B7552]/10">
                                        <CardContent className="p-12 space-y-12">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <span className="text-4xl font-black text-[#3E3A33] tracking-tighter">{slot.time}</span>
                                                    <p className="text-[9px] font-black text-[#3B7552] tracking-[0.3em] uppercase opacity-60">Duración: 50 Minutos</p>
                                                </div>
                                                <div className={`p-4 rounded-[1.5rem] ${isBooked ? 'bg-[#3B7552]/10' : 'bg-[#F5F1E6]'} group-hover:scale-110 transition-transform duration-700`}>
                                                    <Clock className={`h-6 w-6 ${isBooked ? 'text-[#3B7552]' : 'text-[#3B7552]'}`} />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between px-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${status.color}`} />
                                                        <span className="text-[10px] font-black text-[#3B7552] uppercase tracking-widest">{status.text}</span>
                                                    </div>
                                                    <span className="text-[10px] font-black text-[#3E3A33] tracking-tighter uppercase">{slot.available} / {slot.capacity} LIBRES</span>
                                                </div>
                                                <div className="w-full bg-[#f0ede4] rounded-full h-1 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(slot.booked / slot.capacity) * 100}%` }}
                                                        transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                                                        className={`h-full ${status.color} transition-all`}
                                                    />
                                                </div>
                                            </div>

                                            {isBooked ? (
                                                <div className="w-full h-16 rounded-[2rem] bg-[#3B7552]/10 border border-[#3B7552]/20 flex items-center justify-center gap-3">
                                                    <CheckCircle2 className="h-5 w-5 text-[#3B7552]" />
                                                    <span className="text-[11px] font-black text-[#3B7552] uppercase tracking-[0.2em]">Sesión Agendada</span>
                                                </div>
                                            ) : (() => {
                                                const [startStr] = slot.time.split('-');
                                                const [hour, min] = startStr.split(':').map(Number);
                                                const venezuelaNow = getVenezuelaTime();
                                                const slotTime = new Date(venezuelaNow);
                                                slotTime.setHours(hour, min, 0, 0);

                                                const cutoffTime = new Date(slotTime.getTime() - 15 * 60000);
                                                const isDateToday = selectedDate === getVenezuelaDateString();
                                                const isPastOrClosing = isDateToday && venezuelaNow > cutoffTime;

                                                return (
                                                    <div className="space-y-4">
                                                        {isPastOrClosing && (
                                                            <div className="text-center">
                                                                <span className="text-[10px] font-black text-red-500/50 uppercase tracking-[0.3em]">Reserva Finalizada</span>
                                                            </div>
                                                        )}
                                                        <motion.button
                                                            whileHover={!isPastOrClosing && slot.available > 0 ? { scale: 1.02 } : {}}
                                                            whileTap={!isPastOrClosing && slot.available > 0 ? { scale: 0.98 } : {}}
                                                            onClick={() => handleBooking(slot.time)}
                                                            disabled={slot.available === 0 || isPastOrClosing}
                                                            className="w-full h-16 rounded-[2rem] bg-[#3B7552] hover:bg-[#2a543b] text-white font-black uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-[#3B7552]/20 transition-all duration-500 disabled:opacity-10 disabled:grayscale overflow-hidden relative group"
                                                        >
                                                            <span className="relative z-10">{isPastOrClosing ? "Cerrado" : "Confirmar Presencia"}</span>
                                                            <motion.div
                                                                className="absolute inset-0 bg-[#ccff00]/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                initial={false}
                                                            />
                                                        </motion.button>
                                                    </div>
                                                );
                                            })()}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Sección "Mis Reservas" Premium */}
                {myBookings.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="pt-10"
                    >
                        <div className="bg-white/90 backdrop-blur-2xl shadow-[0_10px_60px_rgba(0,0,0,0.02)] rounded-[4rem] overflow-hidden border border-white relative group">
                            <img
                                src="file:///C:/Users/Promiley/.gemini/antigravity/brain/73160ea1-3bae-4b08-9466-87c0c5f92f43/leaf_silhouette_accent_png_1772423764045.png"
                                alt=""
                                className="absolute -right-20 -bottom-20 w-80 h-80 opacity-[0.03] pointer-events-none -rotate-12"
                            />
                            <div className="bg-gradient-to-r from-[#3B7552]/10 to-transparent px-12 py-10 flex items-center justify-between border-b border-white relative z-10">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-[#3E3A33] tracking-tighter uppercase leading-none">Tu Agenda</h2>
                                    <p className="text-[10px] font-black text-[#3B7552] tracking-[0.4em] uppercase">Control de sesiones agendadas</p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05, color: "#ef4444" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={async () => {
                                        if (confirm("¿Seguro que quieres borrar TODAS tus reservas?")) {
                                            toast.promise(cancelAllUserBookings(currentUser.id), {
                                                loading: 'Cancelando sesiones...',
                                                success: 'Agenda liberada',
                                                error: 'Error de red'
                                            })
                                        }
                                    }}
                                    className="text-[10px] font-black text-[#3B7552] uppercase tracking-[0.2em] px-6 py-3 rounded-2xl border border-[#9B8C7A]/10 hover:border-red-500/20 transition-all"
                                >
                                    Limpiar Todo
                                </motion.button>
                            </div>
                            <div className="p-4 space-y-4">
                                {myBookings.map((booking: Booking) => (
                                    <motion.div
                                        key={booking.id}
                                        layout
                                        className="p-10 rounded-[3.5rem] bg-white/60 border border-white flex items-center justify-between hover:bg-white transition-all duration-700 group shadow-sm hover:shadow-xl hover:shadow-[#3B7552]/5"
                                    >
                                        <div className="flex items-center gap-10">
                                            <div className="w-24 h-24 rounded-[2.5rem] bg-white flex items-center justify-center border border-[#3B7552]/5 group-hover:scale-105 transition-all duration-700 shadow-sm">
                                                <Calendar className="h-10 w-10 text-[#3B7552]" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-4">
                                                    <p className="font-black text-3xl text-[#3E3A33] tracking-tighter">{booking.timeSlot}</p>
                                                    <span className="text-[9px] font-black uppercase bg-[#3B7552]/10 px-4 py-1.5 rounded-full text-[#3B7552] tracking-[0.2em] border border-[#3B7552]/5">
                                                        {booking.area === 'gym' ? 'GYM' : 'COGNITIVO'}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-[#3B7552] font-bold uppercase tracking-[0.3em] opacity-80">
                                                    {new Date(booking.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="hidden sm:flex flex-col items-end mr-4">
                                                <span className="text-[10px] font-black text-[#3B7552] uppercase tracking-widest">Confirmado</span>
                                                <span className="text-[8px] font-bold text-[#3B7552] uppercase tracking-tighter">Sesión de Paz</span>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1, rotate: 90 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={async () => {
                                                    if (confirm("¿Seguro que quieres cancelar tu reserva?")) {
                                                        toast.promise(cancelBooking(booking.id), {
                                                            loading: 'Liberando turno...',
                                                            success: 'Sesión cancelada',
                                                            error: 'Error'
                                                        })
                                                    }
                                                }}
                                                className="h-12 w-12 rounded-full flex items-center justify-center text-[#3B7552]/20 hover:text-red-500/40 transition-colors"
                                            >
                                                <XCircle className="h-6 w-6" />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Footer Tools */}
                <div className="pt-20 pb-10 flex justify-center opacity-10 hover:opacity-50 transition-opacity">
                    <button
                        onClick={async () => {
                            const { clearAllTestData } = useStore()
                            if (confirm("¿Resetear sistema?")) {
                                await clearAllTestData()
                                window.location.reload()
                            }
                        }}
                        className="text-[9px] text-[#3B7552] font-black uppercase tracking-[1em]"
                    >
                        System Reset
                    </button>
                </div>
            </main>
        </div>
    )
}
