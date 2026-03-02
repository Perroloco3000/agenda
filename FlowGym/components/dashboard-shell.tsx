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
import { motion, AnimatePresence } from "framer-motion"

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
    { name: 'Usuarios', href: '/dashboard/members', icon: Users },
    { name: 'Reservas', href: '/dashboard/reservations', icon: Calendar },
    { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { refreshData, notifications, markAllAsRead, clearNotifications, gymName, slogan } = useAppStore()
    const adminLogoUrl = "https://ympbzkquwhylijdqaktl.supabase.co/storage/v1/object/public/exercise-videos/logocircular.png"
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
        <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/20">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                < AnimatePresence >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-foreground/20 z-50 md:hidden backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                </AnimatePresence>
            )}

            {/* Sidebar (Desktop & Mobile) */}
            <aside className={cn(
                "fixed inset-y-0 left-0 bg-card border-r border-border/10 flex flex-col z-[60] transition-all duration-500 ease-in-out md:relative md:translate-x-0 shadow-[0_0_30px_rgba(62,58,51,0.03)] md:shadow-none",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
                isCollapsed ? "w-24" : "w-80"
            )}>
                <div className={cn("p-8 border-b border-border/10 flex items-center transition-all duration-500", isCollapsed ? "justify-center" : "justify-between")}>
                    {!isCollapsed && (
                        <Link href="/" className="flex items-center gap-4 group animate-in fade-in slide-in-from-left-2">
                            <div className="w-32 h-32 flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                                <img src={adminLogoUrl} alt="Logo Admin" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tight leading-none text-foreground">{gymName}</span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] leading-none mt-2 opacity-80 text-foreground">
                                    Training <span className="text-primary">Osteomuscular</span>
                                </span>
                            </div>
                        </Link>
                    )}
                    {isCollapsed && (
                        <div className="w-32 h-32 flex items-center justify-center hover:scale-110 transition-all duration-500">
                            <img src={adminLogoUrl} alt="Logo Admin" className="w-full h-full object-contain" />
                        </div>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={cn("hidden md:flex h-8 w-8 rounded-lg bg-background/50 border border-border/10 hover:bg-background text-muted-foreground hover:text-primary transition-all", isCollapsed ? "mt-4" : "")}
                    >
                        <ChevronLeft className={cn("h-4 w-4 transition-transform duration-500", isCollapsed ? "rotate-180" : "")} />
                    </Button>
                </div>

                <nav className="flex-1 p-6 space-y-3 overflow-y-auto custom-scrollbar">
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
                                        ? "bg-primary/10 text-primary shadow-[0_10px_20px_rgba(59,117,82,0.05)] border border-primary/10"
                                        : "text-foreground/40 hover:bg-background/50 hover:text-primary"
                                )}
                            >
                                <div className={cn("flex items-center relative z-10", isCollapsed ? "justify-center" : "gap-4")}>
                                    <item.icon className={cn("transition-colors duration-300",
                                        isActive ? "text-primary" : "group-hover:text-primary",
                                        isCollapsed ? "h-6 w-6" : "h-5 w-5"
                                    )} />
                                    {!isCollapsed && <span className="font-bold tracking-tight uppercase text-xs">{item.name}</span>}
                                </div>
                                {isActive && !isCollapsed && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(59,117,82,0.5)] relative z-10" />}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-6 border-t border-border/10">
                    <button className={cn("flex items-center rounded-2xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200", isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3 w-full")}>
                        <LogOut className="h-5 w-5" />
                        {!isCollapsed && <span className="font-bold">Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden w-full relative">
                <header className="sticky top-0 z-50 h-20 bg-background/60 backdrop-blur-2xl border-b border-border/5 flex items-center justify-between px-6 md:px-12 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            className="p-2 md:hidden hover:bg-background rounded-xl transition-colors"
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
                            <p className="font-bold leading-none text-foreground">Admin Eduardo</p>
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-tighter">Gym Owner</p>
                        </div>
                        <div className="relative group">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-xl hover:bg-primary/10 relative transition-all"
                                onClick={() => {
                                    if (!isNotifOpen) markAllAsRead()
                                    setIsNotifOpen(!isNotifOpen)
                                }}
                            >
                                <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                {notifications.filter(n => !n.read).length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-background">
                                        {notifications.filter(n => !n.read).length}
                                    </span>
                                )}
                            </Button>

                            {/* Notifications Dropdown */}
                            {isNotifOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-80 bg-card border border-border/10 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2"
                                    onMouseLeave={() => setIsNotifOpen(false)}
                                >
                                    <div className="p-4 border-b border-border/10 flex justify-between items-center bg-background/50">
                                        <h3 className="font-bold text-sm text-foreground">Notificaciones</h3>
                                        {notifications.length > 0 && (
                                            <button onClick={clearNotifications} className="text-[10px] text-primary hover:underline font-bold uppercase">Limpiar</button>
                                        )}
                                    </div>
                                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-muted-foreground text-xs italic">
                                                No hay notificaciones nuevas
                                            </div>
                                        ) : (
                                            notifications.map(n => (
                                                <div
                                                    key={n.id}
                                                    className="p-4 border-b border-border/10 last:border-0 hover:bg-background/50 transition-colors cursor-pointer group/item"
                                                >
                                                    <p className={`font-bold text-xs flex items-center gap-2 group-hover/item:text-primary transition-colors ${!n.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${n.type === 'success' ? 'bg-primary' : 'bg-secondary'} ${!n.read ? 'opacity-100' : 'opacity-30'}`} />
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
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                                await refreshData()
                                import("sonner").then(({ toast }) => toast.success("Sincronización completa", {
                                    description: "Los datos se han actualizado correctamente.",
                                    duration: 3000
                                }))
                            }}
                            className="h-12 px-6 rounded-2xl text-primary hover:bg-primary/10 transition-all font-black uppercase tracking-widest text-[10px] flex gap-3"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Actualizar
                        </Button>
                        <div className="w-10 h-10 rounded-full bg-primary-foreground/50 flex items-center justify-center shadow-lg shadow-primary/5">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-12 custom-scrollbar bg-background/30">
                    <div className="max-w-full mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
