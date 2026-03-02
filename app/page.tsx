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
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

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
        <div className="min-h-screen bg-[#F5F1E6] selection:bg-[#3B7552]/30 overflow-hidden flex items-center justify-center p-4 transition-colors duration-1000">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-lg relative z-10"
            >
                {/* Brand Header */}
                <div className="flex flex-col items-center mb-10">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full max-w-[500px] h-40 flex items-center justify-center mb-0 cursor-pointer"
                    >
                        {logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                            <Accessibility className="h-16 w-16 text-[#3B7552]" />
                        )}
                    </motion.div>
                </div>

                {/* Form Container */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-[#3B7552]/10 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <Card className="relative border-[#9B8C7A]/10 bg-[#FCFBF6] rounded-[2.5rem] shadow-xl overflow-hidden">
                        <CardHeader className="pt-10 px-10 pb-4">
                            <div className="flex justify-between items-center mb-2">
                                <CardTitle className="text-3xl font-black tracking-tight text-[#3E3A33] uppercase">
                                    Bienvenido
                                </CardTitle>
                                <Sparkles className="h-5 w-5 text-[#3B7552] animate-pulse" />
                            </div>
                            <CardDescription className="text-[#3E3A33]/50 font-medium text-sm">
                                Accede a tu cuenta para continuar
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 pt-4">
                            <form onSubmit={handleSubmit} className="space-y-6">

                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-[#3B7552]/70 ml-1">Correo Electrónico</Label>
                                    <Input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="h-14 rounded-2xl bg-white border-[#9B8C7A]/20 text-[#3E3A33] placeholder:text-[#9B8C7A]/30 focus:ring-[#3B7552]/20 focus:border-[#3B7552]/50 transition-all text-lg"
                                        placeholder="usuario@kaicenter.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-[#3B7552]/70 ml-1">Contraseña</Label>
                                    <Input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="h-14 rounded-2xl bg-white border-[#9B8C7A]/20 text-[#3E3A33] placeholder:text-[#9B8C7A]/30 focus:ring-[#3B7552]/20 focus:border-[#3B7552]/50 transition-all text-lg"
                                        placeholder="••••••••"
                                    />
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 text-sm font-medium flex items-center gap-3"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        {error}
                                    </motion.div>
                                )}

                                <Button
                                    disabled={isLoading}
                                    type="submit"
                                    className="w-full h-16 rounded-2xl bg-[#3B7552] hover:bg-[#2d5a3f] text-white font-black uppercase tracking-[0.2em] shadow-lg shadow-[#3B7552]/20 border-t border-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
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
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3B7552]/50">
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
                    className="text-center mt-8 text-[#9B8C7A] text-[10px] font-medium uppercase tracking-[0.4em]"
                >
                    Excellence is not an act, but a habit.
                </motion.p>
            </motion.div>
        </div>
    )
}
