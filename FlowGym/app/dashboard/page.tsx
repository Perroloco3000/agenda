"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Users, Dumbbell, Calendar, TrendingUp } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function DashboardPage() {
    const { members, workouts, reservations, isLoaded } = useAppStore()
    const [stats, setStats] = useState([
        { name: 'Miembros Activos', value: '0', icon: Users, color: 'bg-blue-500' },
        { name: 'Rutinas Guardadas', value: '0', icon: Dumbbell, color: 'bg-purple-500' },
        { name: 'Reservas Hoy', value: '0', icon: Calendar, color: 'bg-green-500' },
        { name: 'Reservas Totales', value: '0', icon: Calendar, color: 'bg-orange-500' },
    ])

    useEffect(() => {
        if (isLoaded) {
            const today = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD local
            const activeMembers = members.filter(m => m.status === 'Activo').length
            const todayBookingsCount = reservations.filter(r => r.date === today && r.status === 'confirmed').length
            const totalReservations = reservations.length

            setStats([
                { name: 'Miembros Activos', value: String(activeMembers), icon: Users, color: 'bg-blue-500' },
                { name: 'Rutinas Guardadas', value: String(workouts.length), icon: Dumbbell, color: 'bg-purple-500' },
                { name: 'Reservas Hoy', value: String(todayBookingsCount), icon: Calendar, color: 'bg-green-500' },
                { name: 'Reservas Totales', value: String(totalReservations), icon: Calendar, color: 'bg-orange-500' },
            ])
        }
    }, [isLoaded, members, workouts, reservations])

    return (
        <DashboardShell>
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col gap-4">
                    <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase italic leading-none bg-clip-text text-transparent bg-gradient-to-br from-white to-white/40">Dashboard</h2>
                    <p className="text-lg sm:text-xl text-white/40 font-bold uppercase tracking-widest italic">Gestión de Alto Rendimiento</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat) => (
                        <div key={stat.name} className="relative bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 hover:border-emerald-500/30 transition-all duration-500 group shadow-2xl overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
                            <div className="flex items-center gap-6 relative z-10">
                                <div className={`${stat.color} p-4 rounded-2xl shadow-xl shadow-${stat.color.split('-')[1]}-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                    <stat.icon className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">{stat.name}</p>
                                    <p className="text-5xl font-black tracking-tighter italic">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12">
                    <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl transition-all hover:border-emerald-500/20">
                        <h3 className="text-3xl font-black mb-10 uppercase italic tracking-tighter flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                <Calendar className="h-6 w-6 text-emerald-400" />
                            </div>
                            Próximas Reservas
                        </h3>
                        <div className="space-y-6">
                            {reservations.filter(r => r.status === 'confirmed').slice(0, 4).map((res) => (
                                <div key={res.id} className="group flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.07] hover:border-emerald-500/20 transition-all duration-300">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center font-black group-hover:scale-105 transition-transform">
                                            <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest leading-none mb-1.5">HOY</span>
                                            <span className="text-2xl leading-none italic">{res.timeSlot?.split(':')[0] || '12'}</span>
                                        </div>
                                        <div>
                                            <p className="font-black text-2xl tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">{res.memberName || 'Miembro'}</p>
                                            <p className="text-white/30 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">{res.timeSlot} • {res.date}</p>
                                        </div>
                                    </div>
                                    <Link href={`/dashboard/reservations`}>
                                        <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all active:scale-95 uppercase italic tracking-widest text-[10px]">
                                            Gestionar
                                        </button>
                                    </Link>
                                </div>
                            ))}
                            {reservations.filter(r => r.status === 'confirmed').length === 0 && (
                                <p className="text-center text-white/20 py-12 font-black italic uppercase tracking-widest">No hay reservas próximas.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl transition-all hover:border-emerald-500/20">
                        <h3 className="text-3xl font-black mb-10 uppercase italic tracking-tighter flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                <Users className="h-6 w-6 text-blue-400" />
                            </div>
                            Nuevos Miembros
                        </h3>
                        <div className="space-y-6">
                            {members.slice(0, 4).map((member) => (
                                <div key={member.id} className="group flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.07] hover:border-blue-500/20 transition-all duration-300">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 flex items-center justify-center font-black text-blue-400 text-2xl italic group-hover:scale-110 transition-transform">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-2xl tracking-tighter italic bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">{member.name}</p>
                                            <p className="text-white/30 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Plan {member.plan} • {member.status}</p>
                                        </div>
                                    </div>
                                    <Link href={`/dashboard/members/profile?id=${member.id}`}>
                                        <button className="text-blue-400 font-black px-6 py-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-all uppercase italic tracking-widest text-[10px]">
                                            Ver Perfil
                                        </button>
                                    </Link>
                                </div>
                            ))}
                            {members.length === 0 && (
                                <p className="text-center text-white/20 py-12 font-black italic uppercase tracking-widest">No hay miembros registrados.</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </DashboardShell>
    )
}
