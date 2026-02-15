"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accessibility, UserPlus, LogIn } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const { login, register, currentUser } = useStore()
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "123456" // Simple password for demo
    })
    const [error, setError] = useState("")

    // Redirect if already logged in
    if (currentUser) {
        router.push("/booking")
        return null
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        try {
            if (isLogin) {
                login(formData.email, formData.password)
                router.push("/booking")
            } else {
                register({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                })
                router.push("/booking")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al procesar")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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

                {/* Login/Register Card */}
                <Card className="border-emerald-500/20 bg-slate-900/50 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-black text-white">
                            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            {isLogin ? "Accede a tu cuenta para reservar" : "Regístrate para comenzar"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-white">Nombre Completo</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-slate-800/50 border-slate-700 text-white"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="bg-slate-800/50 border-slate-700 text-white"
                                    placeholder="tu@email.com"
                                />
                            </div>

                            {!isLogin && (
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-white">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="bg-slate-800/50 border-slate-700 text-white"
                                        placeholder="555-1234"
                                    />
                                </div>
                            )}

                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black uppercase tracking-wider shadow-lg shadow-emerald-500/20">
                                {isLogin ? (
                                    <>
                                        <LogIn className="mr-2 h-5 w-5" />
                                        Entrar
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 h-5 w-5" />
                                        Registrarse
                                    </>
                                )}
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(!isLogin)
                                        setError("")
                                    }}
                                    className="text-sm text-emerald-400 hover:text-emerald-300 font-medium"
                                >
                                    {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
