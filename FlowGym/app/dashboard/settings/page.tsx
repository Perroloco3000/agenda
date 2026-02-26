"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Settings, Save, Palette, Bell, Moon, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [gymName, setGymName] = useState("KaiCenter SC")
    const [slogan, setSlogan] = useState("Osteomuscular & Ecological")
    const [darkMode, setDarkMode] = useState(true)
    const [soundEnabled, setSoundEnabled] = useState(true)
    const [notifications, setNotifications] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        const savedGymName = localStorage.getItem("gymName")
        const savedSlogan = localStorage.getItem("slogan")
        const savedDarkMode = localStorage.getItem("darkMode")
        const savedSound = localStorage.getItem("soundEnabled")

        if (savedGymName) setGymName(savedGymName)
        if (savedSlogan) setSlogan(savedSlogan)
        if (savedDarkMode) setDarkMode(savedDarkMode === "true")
        if (savedSound) setSoundEnabled(savedSound === "true")
    }, [])

    const handleSave = () => {
        setIsLoading(true)
        localStorage.setItem("gymName", gymName)
        localStorage.setItem("slogan", slogan)
        localStorage.setItem("darkMode", String(darkMode))
        localStorage.setItem("soundEnabled", String(soundEnabled))

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            alert("¡Configuración guardada correctamente!")
            window.location.reload()
        }, 800)
    }

    return (
        <DashboardShell>
            <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                    <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Configuración</h2>
                    <p className="text-xl text-muted-foreground font-medium">Personaliza tu experiencia Kai Center.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* General Settings */}
                    <div className="bg-card rounded-[3rem] p-10 border border-border/50 shadow-sm space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Settings className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight">General</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 bg-muted/30 rounded-3xl border border-border/20">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Moon className="h-4 w-4 text-muted-foreground" />
                                        <Label className="text-lg font-bold">Modo Oscuro</Label>
                                    </div>
                                    <p className="text-muted-foreground text-sm">Interfaz en colores oscuros.</p>
                                </div>
                                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                            </div>

                            <div className="flex items-center justify-between p-6 bg-muted/30 rounded-3xl border border-border/20">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Volume2 className="h-4 w-4 text-muted-foreground" />
                                        <Label className="text-lg font-bold">Sonidos</Label>
                                    </div>
                                    <p className="text-muted-foreground text-sm">Beeps y efectos de audio.</p>
                                </div>
                                <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                            </div>

                            <div className="flex items-center justify-between p-6 bg-muted/30 rounded-3xl border border-border/20">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Bell className="h-4 w-4 text-muted-foreground" />
                                        <Label className="text-lg font-bold">Notificaciones</Label>
                                    </div>
                                    <p className="text-muted-foreground text-sm">Avisos de nuevas funciones.</p>
                                </div>
                                <Switch checked={notifications} onCheckedChange={setNotifications} />
                            </div>
                        </div>
                    </div>

                    {/* Branding Settings */}
                    <div className="bg-card rounded-[3rem] p-10 border border-border/50 shadow-sm space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <Palette className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight">Branding</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Nombre del Centro</Label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={gymName}
                                        onChange={(e) => setGymName(e.target.value)}
                                        className="w-full h-16 px-6 rounded-2xl bg-muted/30 border border-border/50 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-lg"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Eslogan</Label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={slogan}
                                        onChange={(e) => setSlogan(e.target.value)}
                                        className="w-full h-16 px-6 rounded-2xl bg-muted/30 border border-border/50 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-8">
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        size="lg"
                        className="h-20 px-12 rounded-3xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xl shadow-2xl shadow-emerald-500/20 hover:scale-105 transition-all active:scale-95"
                    >
                        {isLoading ? "Guardando..." : (
                            <>
                                <Save className="mr-3 h-6 w-6" />
                                Guardar Cambios
                            </>
                        )}
                    </Button>
                </div>
            </section>
        </DashboardShell>
    )
}
