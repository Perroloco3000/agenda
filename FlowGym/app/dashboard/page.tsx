"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Users, Dumbbell, Calendar, TrendingUp } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function DashboardPage() {
    const { members, workouts, reservations, isLoaded } = useAppStore()
    const [stats, setStats] = useState([
        { name: 'Usuarios Activos', value: '0', icon: Users, color: 'bg-[#3B7552]' },
        { name: 'Rutinas Guardadas', value: '0', icon: Dumbbell, color: 'bg-stone-500' },
        { name: 'Reservas Hoy', value: '0', icon: Calendar, color: 'bg-[#3B7552]/80' },
        { name: 'Reservas Totales', value: '0', icon: Calendar, color: 'bg-stone-400' },
    ])

    useEffect(() => {
        if (isLoaded) {
            const today = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD local
            const activeMembers = members.filter(m => m.status === 'Activo').length
            const todayBookingsCount = reservations.filter(r => r.date === today && r.status === 'confirmed').length
            const totalReservations = reservations.length

            setStats([
                { name: 'Usuarios Activos', value: String(activeMembers), icon: Users, color: 'bg-[#3B7552]' },
                { name: 'Rutinas Guardadas', value: String(workouts.length), icon: Dumbbell, color: 'bg-stone-500' },
                { name: 'Reservas Hoy', value: String(todayBookingsCount), icon: Calendar, color: 'bg-[#3B7552]/80' },
                { name: 'Reservas Totales', value: String(totalReservations), icon: Calendar, color: 'bg-stone-400' },
            ])
        }
    }, [isLoaded, members, workouts, reservations])

    return (
        <DashboardShell>
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col gap-2">
                    <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-[#3B7552] uppercase">Dashboard</h2>
                    <p className="text-lg sm:text-xl text-[#3B7552]/60 font-bold uppercase tracking-widest pl-1">Gestión Centralizada</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat) => (
                        <div key={stat.name} className="relative bg-card p-8 rounded-[2.5rem] border border-border/10 hover:border-primary/30 transition-all duration-500 group shadow-[0_10px_40px_rgba(62,58,51,0.03)] overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                            <div className="flex items-center gap-6 relative z-10">
                                <div className={`${stat.color} p-4 rounded-2xl shadow-xl shadow-${stat.color.split('-')[1]}-500/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                    <stat.icon className="h-8 w-8 text-primary-foreground" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3B7552]/40 mb-1">{stat.name}</p>
                                    <p className="text-5xl font-black tracking-tight text-[#3B7552]">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12">
                    <div className="bg-card p-10 rounded-[3.5rem] border border-border/10 shadow-sm transition-all hover:border-primary/20">
                        <h3 className="text-2xl font-black mb-8 uppercase tracking-tight flex items-center gap-4 text-[#3B7552]">
                            <div className="p-2.5 bg-[#3B7552]/10 rounded-xl border border-[#3B7552]/20">
                                <Calendar className="h-5 w-5 text-[#3B7552]" />
                            </div>
                            Próximas Reservas
                        </h3>
                        <div className="space-y-6">
                            {reservations.filter(r => r.status === 'confirmed').slice(0, 4).map((res) => (
                                <div key={res.id} className="group flex items-center justify-between p-6 rounded-[2rem] bg-background/50 border border-border/5 hover:bg-background hover:border-primary/20 transition-all duration-300">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-[#3B7552]/10 border border-[#3B7552]/20 flex flex-col items-center justify-center font-black transition-transform">
                                            <span className="text-[#3B7552] text-[9px] font-black uppercase tracking-widest leading-none mb-1.5">HOY</span>
                                            <span className="text-2xl leading-none text-[#3B7552]">{res.timeSlot?.split(':')[0] || '12'}</span>
                                        </div>
                                        <div>
                                            <p className="font-black text-xl tracking-tight text-[#3B7552] uppercase">{res.memberName || 'Usuario'}</p>
                                            <p className="text-[#3B7552]/40 font-bold text-[10px] tracking-widest mt-1">{res.timeSlot} • {res.date}</p>
                                        </div>
                                    </div>
                                    <Link href={`/dashboard/reservations`}>
                                        <button className="bg-[#3B7552] hover:bg-[#3B7552]/90 text-white font-black px-6 py-3 rounded-xl shadow-lg shadow-[#3B7552]/10 hover:scale-105 transition-all active:scale-95 uppercase tracking-widest text-[10px]">
                                            Gestionar
                                        </button>
                                    </Link>
                                </div>
                            ))}
                            {reservations.filter(r => r.status === 'confirmed').length === 0 && (
                                <p className="text-center text-foreground/20 py-12 font-black italic uppercase tracking-widest">No hay reservas próximas.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-card p-10 rounded-[3.5rem] border border-border/10 shadow-sm transition-all hover:border-primary/20">
                        <h3 className="text-2xl font-black mb-8 uppercase tracking-tight flex items-center gap-4 text-[#3B7552]">
                            <div className="p-2.5 bg-[#3B7552]/10 rounded-xl border border-[#3B7552]/20">
                                <Users className="h-5 w-5 text-[#3B7552]" />
                            </div>
                            Nuevos Usuarios
                        </h3>
                        <div className="space-y-6">
                            {members.slice(0, 4).map((member) => (
                                <div key={member.id} className="group flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.07] hover:border-blue-500/20 transition-all duration-300">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 flex items-center justify-center font-black text-blue-400 text-2xl group-hover:scale-110 transition-transform">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-xl tracking-tight text-[#3B7552] uppercase">{member.name}</p>
                                            <p className="text-[#3B7552]/40 font-bold text-[10px] tracking-widest mt-1">PLAN {member.plan?.toUpperCase()} • {member.status?.toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <Link href={`/dashboard/members/profile?id=${member.id}`}>
                                        <button className="text-[#3B7552] font-black px-5 py-3 rounded-xl bg-[#3B7552]/5 border border-[#3B7552]/10 hover:bg-[#3B7552]/10 transition-all uppercase tracking-widest text-[10px]">
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
