"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Accessibility, ArrowRight, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Mock login delay
        setTimeout(() => {
            router.push("/dashboard")
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

            <div className="w-full max-w-md relative z-10 flex flex-col gap-8 animate-in fade-in zoom-in duration-500">

                {/* Logo Section */}
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]">
                        <Accessibility className="h-10 w-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase">KaiCenter SC</h1>
                        <p className="text-emerald-400 font-bold tracking-[0.2em] uppercase text-xs mt-1">Training Osteomuscular</p>
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-white/60 font-medium uppercase tracking-wider text-xs ml-1">Email</Label>
                            <Input
                                type="email"
                                placeholder="admin@kaicenter.com"
                                className="bg-black/20 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus:ring-emerald-500/50 focus:border-emerald-500"
                                defaultValue="admin@kaicenter.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white/60 font-medium uppercase tracking-wider text-xs ml-1">Contraseña</Label>
                            <div className="relative">
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-black/20 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus:ring-emerald-500/50 focus:border-emerald-500 pr-10"
                                    defaultValue="password"
                                />
                                <Lock className="absolute right-3 top-3 h-5 w-5 text-white/20" />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-wide text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                                    Accediendo...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Entrar <ArrowRight className="h-5 w-5" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-white/30 text-xs">Protected by FlowGym™ Secure Auth</p>
                    </div>
                </div>

            </div>
        </div>
    )
}
