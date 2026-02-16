"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accessibility, LogOut, Calendar, Clock, Users, CheckCircle2, XCircle } from "lucide-react"

export default function BookingPage() {
    const router = useRouter()
    const { currentUser, logout, getAvailableSlots, createBooking, getUserBookings } = useStore()
    const [selectedDate, setSelectedDate] = useState("")
    const [availableSlots, setAvailableSlots] = useState<ReturnType<typeof getAvailableSlots>>([])
    const [myBookings, setMyBookings] = useState<ReturnType<typeof getUserBookings>>([])
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
        const today = new Date().toISOString().split('T')[0]
        setSelectedDate(today)
    }, [])

    // Load slots when date changes
    useEffect(() => {
        if (selectedDate && currentUser) {
            setAvailableSlots(getAvailableSlots(selectedDate))
            setMyBookings(getUserBookings(currentUser.id))
        }
    }, [selectedDate, currentUser, getAvailableSlots, getUserBookings])

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    const handleBooking = async (timeSlot: string) => {
        if (!currentUser) return

        try {
            await createBooking(currentUser.id, selectedDate, timeSlot)
            setSuccessMessage(`¡Reserva confirmada para ${timeSlot}!`)
            setErrorMessage("")
            // Refresh data
            setAvailableSlots(getAvailableSlots(selectedDate))
            setMyBookings(getUserBookings(currentUser.id))

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(""), 3000)
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : "Error al reservar")
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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
            {/* Header */}
            <header className="bg-slate-900/50 backdrop-blur-md border-b border-emerald-500/20 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Accessibility className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tighter uppercase text-white leading-none">KaiCenter SC</h1>
                            <p className="text-[10px] font-bold text-emerald-400 tracking-[0.3em] uppercase">Training Osteomuscular</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-white">{currentUser.name}</p>
                            <p className="text-xs text-slate-400">{currentUser.email}</p>
                        </div>
                        <Button onClick={handleLogout} variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Date Selector */}
                <Card className="border-emerald-500/20 bg-slate-900/50 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-black text-white flex items-center gap-2">
                            <Calendar className="h-6 w-6 text-emerald-400" />
                            Selecciona tu Fecha
                        </CardTitle>
                        <CardDescription className="text-slate-400">Elige el día para tu entrenamiento</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full md:w-auto px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white font-bold text-lg"
                        />
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
                    <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                        <Clock className="h-6 w-6 text-emerald-400" />
                        Turnos Disponibles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableSlots.map(slot => {
                            const status = getSlotStatus(slot.available, slot.capacity)
                            const isBooked = myBookings.some(b => b.timeSlot === slot.time && b.date === selectedDate)

                            return (
                                <Card key={slot.time} className="border-emerald-500/20 bg-slate-900/50 backdrop-blur-xl hover:border-emerald-500/40 transition-all">
                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-5 w-5 text-emerald-400" />
                                                <span className="text-xl font-black text-white">{slot.time}</span>
                                            </div>
                                            <div className={`w-3 h-3 rounded-full ${status.color} animate-pulse`} />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-400 font-medium">Disponibilidad</span>
                                                <span className="text-white font-bold">{slot.available}/{slot.capacity}</span>
                                            </div>
                                            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full ${status.color} transition-all`}
                                                    style={{ width: `${(slot.booked / slot.capacity) * 100}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium">{status.text}</p>
                                        </div>

                                        {isBooked ? (
                                            <Button disabled className="w-full bg-green-500/20 text-green-400 border border-green-500/30">
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                Ya Reservado
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => handleBooking(slot.time)}
                                                disabled={slot.available === 0}
                                                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Users className="mr-2 h-4 w-4" />
                                                Reservar
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>

                {/* My Bookings */}
                {myBookings.length > 0 && (
                    <Card className="border-emerald-500/20 bg-slate-900/50 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-2xl font-black text-white">Mis Reservas</CardTitle>
                            <CardDescription className="text-slate-400">Tus próximos entrenamientos</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {myBookings.map(booking => (
                                    <div key={booking.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                                <Calendar className="h-6 w-6 text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="font-black text-white">{booking.timeSlot}</p>
                                                <p className="text-sm text-slate-400">{new Date(booking.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
                                                <span className="text-green-400 font-bold text-sm">Confirmado</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm("¿Seguro que quieres cancelar tu reserva?")) {
                                                        const { cancelBooking } = useStore()
                                                        cancelBooking(booking.id)
                                                    }
                                                }}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
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
            </main>
        </div>
    )
}
