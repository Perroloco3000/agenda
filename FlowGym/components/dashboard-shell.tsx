"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Dumbbell,
    Users,
    Calendar,
    LayoutDashboard,
    LogOut,
    ChevronLeft,
    Settings,
    Menu,
    X,
    Accessibility,
    RefreshCw,
    Bell,
    ChevronRight,
    Search
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
    const { refreshData, notifications, clearNotifications, gymName, slogan, logoUrl } = useAppStore()
    const [isMounted, setIsMounted] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isNotifOpen, setIsNotifOpen] = useState(false)

    useEffect(() => {
        setIsMounted(true)

        const loadSettings = () => {
            const savedDarkMode = localStorage.getItem("darkMode")

            // Apply dark mode
            if (savedDarkMode === "false") {
                document.documentElement.classList.remove("dark")
            } else {
                document.documentElement.classList.add("dark")
            }
        }

        loadSettings()

        // Listen for internal storage events
        window.addEventListener('storage', loadSettings)
        return () => window.removeEventListener('storage', loadSettings)
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
                "fixed inset-y-0 left-0 bg-card/70 backdrop-blur-2xl border-r border-white/5 flex flex-col z-[60] transition-all duration-500 ease-in-out md:relative md:translate-x-0 shadow-[20px_0_40px_rgba(0,0,0,0.3)] md:shadow-none",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
                isCollapsed ? "w-24" : "w-80"
            )}>
                <div className={cn("p-8 border-b border-white/5 flex items-center transition-all duration-500", isCollapsed ? "justify-center" : "justify-between")}>
                    {!isCollapsed && (
                        <Link href="/" className="flex items-center gap-4 group animate-in fade-in slide-in-from-left-2">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/40 group-hover:scale-110 transition-all duration-500 overflow-hidden">
                                {logoUrl ? (
                                    <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <Accessibility className="h-7 w-7 text-white" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tight leading-none text-white">{gymName}</span>
                                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-[0.2em] leading-none mt-1.5 opacity-80">{slogan}</span>
                            </div>
                        </Link>
                    )}
                    {isCollapsed && (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/40 hover:scale-110 transition-all duration-500 overflow-hidden">
                            {logoUrl ? (
                                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <Accessibility className="h-7 w-7 text-white" />
                            )}
                        </div>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={cn("hidden md:flex h-8 w-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white/40 hover:text-white transition-all", isCollapsed ? "mt-4" : "")}
                    >
                        <ChevronLeft className={cn("h-4 w-4 transition-transform duration-500", isCollapsed ? "rotate-180" : "")} />
                    </Button>
                </div>

                <nav className="flex-1 p-6 space-y-3">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center transition-all duration-300 group relative overflow-hidden",
                                    isCollapsed ? "justify-center h-14 w-14 p-0 mx-auto rounded-xl" : "justify-between px-5 py-4 rounded-[1.5rem]",
                                    isActive
                                        ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10"
                                        : "text-white/40 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <div className={cn("flex items-center relative z-10", isCollapsed ? "justify-center" : "gap-4")}>
                                    <item.icon className={cn("transition-colors duration-300",
                                        isActive ? "text-emerald-400" : "group-hover:text-emerald-400",
                                        isCollapsed ? "h-6 w-6" : "h-5 w-5"
                                    )} />
                                    {!isCollapsed && <span className="font-bold tracking-tight uppercase text-xs">{item.name}</span>}
                                </div>
                                {isActive && !isCollapsed && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] relative z-10" />}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-6 border-t border-border">
                    <button className={cn("flex items-center rounded-2xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200", isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3 w-full")}>
                        <LogOut className="h-5 w-5" />
                        {!isCollapsed && <span className="font-bold">Cerrar Sesión</span>}
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
                                <div
                                    className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2"
                                    onMouseLeave={() => setIsNotifOpen(false)}
                                >
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
                                                <div
                                                    key={n.id}
                                                    className="p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer group/item"
                                                    onClick={() => {
                                                        const getRoute = () => {
                                                            const title = n.title.toLowerCase();
                                                            if (title.includes('reserva')) return '/dashboard/reservations';
                                                            if (title.includes('miembro') || title.includes('usuario')) return '/dashboard/members';
                                                            if (title.includes('rutina') || title.includes('entrenamiento')) return '/dashboard/workouts';
                                                            return '/dashboard';
                                                        }
                                                        window.location.href = getRoute();
                                                        setIsNotifOpen(false);
                                                    }}
                                                >
                                                    <p className="font-bold text-xs flex items-center gap-2 group-hover/item:text-primary transition-colors">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${n.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
                                                        {n.title}
                                                    </p>
                                                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{n.description}</p>
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
                                import("sonner").then(({ toast }) => toast.success("Sincronización completa", {
                                    description: "Los datos se han actualizado correctamente.",
                                    duration: 3000
                                }))
                            }}
                            className="h-12 px-6 rounded-2xl bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all font-black uppercase tracking-widest text-[10px] flex gap-3"
                        >
                            <RefreshCw className="h-4 w-4" />
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
