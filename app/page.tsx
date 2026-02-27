"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accessibility, UserPlus, LogIn, ChevronRight, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function LoginPage() {
    const router = useRouter()
    const { login, register, currentUser, gymName, slogan, logoUrl } = useStore()
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Redirect if already logged in
    useEffect(() => {
        if (currentUser) {
            router.push("/booking")
        }
    }, [currentUser, router])

    if (currentUser) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            await login(formData.email, formData.password)
            router.push("/booking")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al procesar")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 overflow-hidden flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-lg relative z-10"
            >
                {/* Brand Header */}
                <div className="flex flex-col items-center mb-12">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-[0_0_50px_-10px_rgba(16,185,129,0.4)] mb-6 cursor-pointer overflow-hidden"
                    >
                        {logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <Accessibility className="h-12 w-12 text-white" />
                        )}
                    </motion.div>
                    <div className="text-center space-y-2">
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl font-black tracking-tighter uppercase leading-none text-white text-center"
                        >
                            {gymName.split(' ')[0]} <span className="text-emerald-500">{gymName.split(' ').slice(1).join(' ')}</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-emerald-400/60 font-medium tracking-[0.4em] uppercase text-[10px] text-center"
                        >
                            {slogan}
                        </motion.p>
                    </div>
                </div>

                {/* Form Container */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <Card className="relative border-white/5 bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] shadow-2xl overflow-hidden">
                        <CardHeader className="pt-10 px-10 pb-4">
                            <div className="flex justify-between items-center mb-2">
                                <CardTitle className="text-3xl font-black tracking-tight text-white uppercase">
                                    Bienvenido
                                </CardTitle>
                                <Sparkles className="h-5 w-5 text-emerald-500 animate-pulse" />
                            </div>
                            <CardDescription className="text-white/40 font-medium text-sm">
                                Accede a tu cuenta para continuar
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 pt-4">
                            <form onSubmit={handleSubmit} className="space-y-6">


                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Correo Electrónico</Label>
                                    <Input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="h-14 rounded-2xl bg-white/[0.03] border-white/10 text-white placeholder:text-white/10 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all text-lg"
                                        placeholder="usuario@kaicenter.com"
                                    />
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-3"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        {error}
                                    </motion.div>
                                )}

                                <Button
                                    disabled={isLoading}
                                    type="submit"
                                    className="w-full h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 border-t border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                            Procesando...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            Iniciar Sesión
                                            <ChevronRight className="h-5 w-5" />
                                        </div>
                                    )}
                                </Button>

                                <div className="text-center pt-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                                        Acceso exclusivo para miembros registrados por el administrador
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer Quote */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-8 text-white/20 text-[10px] font-medium uppercase tracking-[0.4em]"
                >
                    Excellence is not an act, but a habit.
                </motion.p>
            </motion.div>
        </div>
    )
}
