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
        { name: 'Crecimiento', value: '+12%', icon: TrendingUp, color: 'bg-orange-500' },
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
                { name: 'Crecimiento', value: '+12%', icon: TrendingUp, color: 'bg-orange-500' },
            ])
        }
    }, [isLoaded, members, workouts, reservations])

    return (
        <DashboardShell>
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase">Dashboard Overlook</h2>
                    <p className="text-lg sm:text-xl text-muted-foreground font-medium">Gestiona tu gimnasio con eficiencia y estilo.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.name} className="bg-card p-8 rounded-[2.5rem] border border-border/50 hover:border-primary/50 transition-all duration-300 group shadow-sm hover:shadow-xl hover:shadow-primary/5">
                            <div className="flex items-center gap-6">
                                <div className={`${stat.color} p-4 rounded-2xl shadow-lg shadow-${stat.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{stat.name}</p>
                                    <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                    <div className="bg-card p-10 rounded-[3rem] border border-border/50 shadow-sm transition-all hover:shadow-lg">
                        <h3 className="text-2xl font-black mb-8 uppercase tracking-tight flex items-center gap-3">
                            <Calendar className="h-6 w-6 text-primary" />
                            Próximas Reservas
                        </h3>
                        <div className="space-y-6">
                            {reservations.filter(r => r.status === 'confirmed').slice(0, 4).map((res) => (
                                <div key={res.id} className="flex items-center justify-between p-6 rounded-3xl bg-muted/30 border border-border/20 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex flex-col items-center justify-center font-black">
                                            <span className="text-primary text-[10px] uppercase leading-none mb-1">HOY</span>
                                            <span className="text-xl leading-none">{res.timeSlot?.split(':')[0] || '12'}</span>
                                        </div>
                                        <div>
                                            <p className="font-black text-xl tracking-tight uppercase">{res.member_name || 'Miembro'}</p>
                                            <p className="text-muted-foreground font-medium">{res.timeSlot} • {res.date}</p>
                                        </div>
                                    </div>
                                    <Link href={`/dashboard/reservations`}>
                                        <button className="bg-primary text-primary-foreground font-black px-6 py-3 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                                            Gestionar
                                        </button>
                                    </Link>
                                </div>
                            ))}
                            {reservations.filter(r => r.status === 'confirmed').length === 0 && (
                                <p className="text-center text-muted-foreground py-10 font-bold">No hay reservas próximas.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-card p-10 rounded-[3rem] border border-border/50 shadow-sm transition-all hover:shadow-lg">
                        <h3 className="text-2xl font-black mb-8 uppercase tracking-tight flex items-center gap-3">
                            <Users className="h-6 w-6 text-primary" />
                            Nuevos Miembros
                        </h3>
                        <div className="space-y-6">
                            {members.slice(0, 4).map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-6 rounded-3xl bg-muted/30 border border-border/20 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/10 flex items-center justify-center font-black text-primary text-xl">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-xl tracking-tight">{member.name}</p>
                                            <p className="text-muted-foreground font-medium">Plan {member.plan} • {member.status}</p>
                                        </div>
                                    </div>
                                    <Link href={`/dashboard/members/profile?id=${member.id}`}>
                                        <button className="text-primary font-black px-6 py-3 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors">
                                            Ver Perfil
                                        </button>
                                    </Link>
                                </div>
                            ))}
                            {members.length === 0 && (
                                <p className="text-center text-muted-foreground py-10 font-bold">No hay miembros registrados.</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </DashboardShell>
    )
}
