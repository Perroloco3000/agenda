"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { useAppStore } from "@/lib/store"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Mail, Phone, Calendar, CreditCard, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Suspense, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

function MemberProfileContent() {
    const { members, updateMember } = useAppStore()
    const searchParams = useSearchParams()
    const memberId = searchParams.get("id")

    const member = members.find(m => m.id === memberId)
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState<any>(null)

    useEffect(() => {
        if (member) setEditData({ ...member })
    }, [member])

    const handleSave = async () => {
        if (!memberId || !editData) return
        try {
            await updateMember(memberId, {
                name: editData.name,
                email: editData.email,
                phone: editData.phone,
                plan: editData.plan,
                status: editData.status,
                password: editData.password
            })
            setIsEditing(false)
            toast.success("Perfil actualizado correctamente")
        } catch (err) {
            console.error(err)
            toast.error("Error al actualizar perfil")
        }
    }

    if (!member) {
        return (
            <DashboardShell>
                <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
                    <div className="text-6xl italic font-black text-[#3B7552]">?</div>
                    <h2 className="text-3xl font-black text-[#3B7552] uppercase">Usuario no encontrado</h2>
                    <Link href="/dashboard/members">
                        <Button className="bg-[#3B7552] text-white rounded-xl">Volver a Usuarios</Button>
                    </Link>
                </div>
            </DashboardShell>
        )
    }

    return (
        <DashboardShell>
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/members">
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-[#3B7552]/10 text-[#3B7552]">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter uppercase text-[#3B7552]">Perfil de Usuario</h2>
                        <p className="text-[#3B7552]/60 font-black uppercase tracking-widest text-[10px]">Expediente de Élite</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info Card */}
                    <div className="lg:col-span-2 bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-[#3B7552]/10 shadow-2xl space-y-8">
                        <div className="flex items-center gap-8">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#3B7552]/20 to-[#3B7552]/5 flex items-center justify-center font-black text-[#3B7552] text-5xl border-4 border-[#3B7552]/10 transition-transform hover:scale-105">
                                {editData?.name?.charAt(0) || "U"}
                            </div>
                            <div className="flex-1">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nombre Completo</Label>
                                            <Input
                                                value={editData.name}
                                                onChange={e => setEditData({ ...editData, name: e.target.value })}
                                                className="text-2xl font-black h-12 rounded-xl"
                                            />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Estado</Label>
                                                <Select value={editData.status} onValueChange={v => setEditData({ ...editData, status: v })}>
                                                    <SelectTrigger className="h-10 rounded-xl font-bold">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Activo">Activo</SelectItem>
                                                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex-1">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nueva Contraseña</Label>
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={editData.password || ""}
                                                    onChange={e => setEditData({ ...editData, password: e.target.value })}
                                                    className="h-10 rounded-xl font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-4xl font-black tracking-tight mb-2 text-[#3B7552] uppercase">{member.name}</h3>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${member.status === 'Activo' ? 'bg-[#3B7552] shadow-[0_0_10px_rgba(59,117,82,0.3)]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'} animate-pulse`} />
                                            <span className="font-black uppercase tracking-widest text-xs text-[#3B7552]">{member.status}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-3xl bg-white/[0.03] border border-[#3B7552]/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <Mail className="h-5 w-5 text-[#3B7552]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#3B7552]/40">Email Principal</span>
                                </div>
                                {isEditing ? (
                                    <Input
                                        type="email"
                                        value={editData.email}
                                        onChange={(e: any) => setEditData({ ...editData, email: e.target.value })}
                                        className="font-bold rounded-xl border-[#3B7552]/20 text-[#3B7552]"
                                    />
                                ) : (
                                    <p className="font-black text-lg text-[#3B7552]">{member.email}</p>
                                )}
                            </div>

                            <div className="p-6 rounded-3xl bg-white/[0.03] border border-[#3B7552]/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <Phone className="h-5 w-5 text-[#3B7552]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#3B7552]/40">Teléfono</span>
                                </div>
                                {isEditing ? (
                                    <Input
                                        type="tel"
                                        value={editData.phone}
                                        onChange={(e: any) => setEditData({ ...editData, phone: e.target.value })}
                                        className="font-bold rounded-xl border-[#3B7552]/20 text-[#3B7552]"
                                    />
                                ) : (
                                    <p className="font-black text-lg text-[#3B7552]">{member.phone}</p>
                                )}
                            </div>

                            <div className="p-6 rounded-3xl bg-white/[0.03] border border-[#3B7552]/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <Calendar className="h-5 w-5 text-[#3B7552]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#3B7552]/40">Fecha de Ingreso</span>
                                </div>
                                <p className="font-black text-lg text-[#3B7552]">{member.joinDate}</p>
                            </div>

                            <div className="p-6 rounded-3xl bg-white/[0.03] border border-[#3B7552]/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <CreditCard className="h-5 w-5 text-[#3B7552]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#3B7552]/40">Plan de Élite</span>
                                </div>
                                {isEditing ? (
                                    <Select value={editData.plan} onValueChange={v => setEditData({ ...editData, plan: v })}>
                                        <SelectTrigger className="h-10 rounded-xl font-bold border-[#3B7552]/20 text-[#3B7552]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="GYM">GYM</SelectItem>
                                            <SelectItem value="Cognitivo">Cognitivo</SelectItem>
                                            <SelectItem value="Premium">Premium</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="inline-flex items-center px-4 py-2 rounded-2xl bg-[#3B7552]/10 border border-[#3B7552]/20">
                                        <span className="font-black text-[#3B7552] uppercase tracking-widest">{member.plan}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[3rem] border border-[#3B7552]/10 shadow-2xl">
                            <h4 className="text-xl font-black uppercase tracking-tight mb-6 text-[#3B7552]">Estadísticas</h4>
                            <div className="space-y-6">
                                <div className="text-center p-6 rounded-3xl bg-[#3B7552]/5 border border-[#3B7552]/10">
                                    <div className="text-5xl font-black text-[#3B7552] mb-2">0</div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#3B7552]/40">Clases Asistidas</p>
                                </div>
                                <div className="text-center p-6 rounded-3xl bg-white/[0.03] border border-[#3B7552]/5">
                                    <div className="text-5xl font-black mb-2 text-[#3B7552]">0</div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#3B7552]/40">Días Activo</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[3rem] border border-[#3B7552]/10 shadow-2xl">
                            <h4 className="text-xl font-black uppercase tracking-tight mb-6 text-[#3B7552]">Acciones Rápidas</h4>
                            <div className="space-y-4">
                                <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest bg-[#3B7552] text-white hover:bg-[#3B7552]/90">
                                    <Activity className="mr-2 h-5 w-5" />
                                    Ver Historial
                                </Button>
                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest border-[#3B7552]/20 text-[#3B7552]"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest bg-[#3B7552] text-white hover:bg-[#3B7552]/90"
                                        >
                                            Guardar
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditing(true)}
                                        className="w-full h-14 rounded-2xl font-black uppercase tracking-widest border-[#3B7552]/20 text-[#3B7552]"
                                    >
                                        Editar Perfil
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </DashboardShell>
    )
}

export default function MemberProfilePage() {
    return (
        <Suspense fallback={
            <DashboardShell>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="text-2xl font-black text-muted-foreground">Cargando...</div>
                </div>
            </DashboardShell>
        }>
            <MemberProfileContent />
        </Suspense>
    )
}
