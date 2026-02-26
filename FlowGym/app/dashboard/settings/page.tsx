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
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)

    // Load from localStorage on mount
    useEffect(() => {
        const savedGymName = localStorage.getItem("gymName")
        const savedSlogan = localStorage.getItem("slogan")
        const savedDarkMode = localStorage.getItem("darkMode")
        const savedSound = localStorage.getItem("soundEnabled")
        const savedNotifs = localStorage.getItem("notificationsEnabled")

        if (savedGymName) setGymName(savedGymName)
        if (savedSlogan) setSlogan(savedSlogan)
        if (savedDarkMode) setDarkMode(savedDarkMode === "true")
        if (savedSound) setSoundEnabled(savedSound === "true")
        if (savedNotifs) setNotificationsEnabled(savedNotifs === "true")
    }, [])

    const handleSave = async () => {
        setIsLoading(true)
        localStorage.setItem("gymName", gymName)
        localStorage.setItem("slogan", slogan)
        localStorage.setItem("darkMode", String(darkMode))
        localStorage.setItem("soundEnabled", String(soundEnabled))
        localStorage.setItem("notificationsEnabled", String(notificationsEnabled))
 
        // Trigger storage event for the DashboardShell
        window.dispatchEvent(new Event('storage'))
 
        const { toast } = await import("sonner")
 
        setTimeout(() => {
            setIsLoading(false)
            toast.success("¡Éxito!", {
                description: "Configuración guardada correctamente.",
                duration: 3000
            })
            // No reload needed if shell listens to storage events
        }, 800)
    }

    return (
        <DashboardShell>
            <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col gap-2">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase">Configuración</h2>
                    <p className="text-xl text-emerald-400 font-bold uppercase tracking-widest pl-1">Personalización del Sistema</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* General Settings */}
                    <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-8">
                        <div className="flex items-center gap-4 mb-2 text-white">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <Settings className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight">General</h3>
                        </div>
 
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 bg-white/[0.03] rounded-2xl border border-white/[0.05] hover:bg-white/[0.07] transition-all">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <Moon className="h-5 w-5 text-white/40" />
                                        <Label className="text-lg font-black uppercase tracking-tight text-white">Modo Oscuro</Label>
                                    </div>
                                    <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Interfaz en colores profundos</p>
                                </div>
                                <Switch checked={darkMode} onCheckedChange={setDarkMode} className="data-[state=checked]:bg-emerald-500" />
                            </div>
 
                            <div className="flex items-center justify-between p-6 bg-white/[0.03] rounded-2xl border border-white/[0.05] hover:bg-white/[0.07] transition-all">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <Volume2 className="h-5 w-5 text-white/40" />
                                        <Label className="text-lg font-black uppercase tracking-tight text-white">Efectos Audio</Label>
                                    </div>
                                    <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Sonidos de entrenamiento</p>
                                </div>
                                <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} className="data-[state=checked]:bg-emerald-500" />
                            </div>
 
                            <div className="flex items-center justify-between p-6 bg-white/[0.03] rounded-2xl border border-white/[0.05] hover:bg-white/[0.07] transition-all">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <Bell className="h-5 w-5 text-white/40" />
                                        <Label className="text-lg font-black uppercase tracking-tight text-white">Notificaciones</Label>
                                    </div>
                                    <p className="text-white/20 text-[10px) font-bold uppercase tracking-widest">Alertas de sistema</p>
                                </div>
                                <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} className="data-[state=checked]:bg-emerald-500" />
                            </div>
                        </div>
                    </div>

                    {/* Branding Settings */}
                    <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-8">
                        <div className="flex items-center gap-4 mb-2 text-white">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <Palette className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight">Branding</h3>
                        </div>
 
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Nombre del Centro</Label>
                                <input
                                    type="text"
                                    value={gymName}
                                    onChange={(e) => setGymName(e.target.value)}
                                    className="w-full h-16 px-6 rounded-xl bg-white/[0.03] border border-white/10 font-black text-xl tracking-tight focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all text-white"
                                />
                            </div>
 
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Eslogan Principal</Label>
                                <input
                                    type="text"
                                    value={slogan}
                                    onChange={(e) => setSlogan(e.target.value)}
                                    className="w-full h-16 px-6 rounded-xl bg-white/[0.03] border border-white/10 font-bold text-lg tracking-tight focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-12">
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        size="lg"
                        className="h-16 px-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xl shadow-xl shadow-emerald-500/40 hover:scale-105 transition-all active:scale-95 uppercase tracking-wider"
                    >
                        {isLoading ? "PROCESANDO..." : (
                            <>
                                <Save className="mr-3 h-6 w-6" />
                                GUARDAR CAMBIOS
                            </>
                        )}
                    </Button>
                </div>
            </section>
        </DashboardShell>
    )
}
