"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Dumbbell,
    Users,
    Calendar,
    LayoutDashboard,
    LogOut,
    ChevronRight,
    Settings,
    Menu,
    X,
    Accessibility,
    RefreshCw,
    Bell
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"

function SyncStatus() {
    const { syncStatus } = useAppStore()

    if (syncStatus === "connecting") return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">Sincronizando...</span>
        </div>
    )

    if (syncStatus === "error") return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Error de Conexión</span>
        </div>
    )

    return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">En Línea</span>
        </div>
    )
}

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Entrenamientos', href: '/dashboard/workouts', icon: Dumbbell },
    { name: 'Miembros', href: '/dashboard/members', icon: Users },
    { name: 'Reservas', href: '/dashboard/reservations', icon: Calendar },
    { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { refreshData, notifications, clearNotifications } = useAppStore()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isNotifOpen, setIsNotifOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return <div className="min-h-screen bg-muted/30" />
    }

    return (
        <div className="flex h-screen bg-muted/30 overflow-hidden">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar (Desktop & Mobile) */}
            <aside className={cn(
                "fixed inset-y-0 left-0 w-72 bg-card border-r border-border flex flex-col z-[60] transition-transform duration-300 md:relative md:translate-x-0 shadow-2xl md:shadow-none",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-8 border-b border-border">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Accessibility className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black tracking-tighter leading-none">KAICENTER SC</span>
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest leading-none mt-0.5">Training Osteomuscular</span>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "group-hover:text-primary")} />
                                    <span className="font-bold">{item.name}</span>
                                </div>
                                {isActive && <ChevronRight className="h-4 w-4" />}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-6 border-t border-border">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200">
                        <LogOut className="h-5 w-5" />
                        <span className="font-bold">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden w-full">
                <header className="h-20 bg-card/50 backdrop-blur-md border-b border-border flex items-center justify-between px-6 md:px-12 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            className="p-2 md:hidden hover:bg-muted rounded-xl transition-colors"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg md:text-xl font-black uppercase tracking-widest text-muted-foreground">Admin Panel</h1>
                            <SyncStatus />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="font-bold leading-none">Admin Eduardo</p>
                            <p className="text-sm text-muted-foreground">Gym Owner</p>
                        </div>
                        <div className="relative group">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 rounded-xl bg-card border-border hover:bg-muted relative"
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                            >
                                <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                {notifications.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-card">
                                        {notifications.length}
                                    </span>
                                )}
                            </Button>

                            {/* Notifications Dropdown */}
                            {isNotifOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                                        <h3 className="font-bold text-sm">Notificaciones</h3>
                                        {notifications.length > 0 && (
                                            <button onClick={clearNotifications} className="text-[10px] text-primary hover:underline font-bold uppercase">Limpiar</button>
                                        )}
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-muted-foreground text-xs italic">
                                                No hay notificaciones nuevas
                                            </div>
                                        ) : (
                                            notifications.map(n => (
                                                <div key={n.id} className="p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                                                    <p className="font-bold text-xs flex items-center gap-2">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${n.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
                                                        {n.title}
                                                    </p>
                                                    <p className="text-[11px] text-muted-foreground mt-1">{n.description}</p>
                                                    <p className="text-[9px] text-muted-foreground/60 mt-1 uppercase font-bold">{n.time}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                                await refreshData()
                                alert("Datos actualizados desde Supabase")
                            }}
                            className="h-10 rounded-xl hover:bg-muted font-bold flex gap-2 border-primary/20"
                        >
                            <RefreshCw className="h-4 w-4 text-primary" />
                            Actualizar
                        </Button>
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-12 custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-12">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
