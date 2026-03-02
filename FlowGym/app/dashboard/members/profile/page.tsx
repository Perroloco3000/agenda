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
                    <div className="text-6xl italic font-black text-primary">?</div>
                    <h2 className="text-3xl font-black text-foreground uppercase">Usuario no encontrado</h2>
                    <Link href="/dashboard/members">
                        <Button className="bg-primary text-primary-foreground rounded-xl">Volver a Usuarios</Button>
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
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-border/10 text-primary">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter uppercase text-foreground">Perfil de Usuario</h2>
                        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Expediente de Élite</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info Card */}
                    <div className="lg:col-span-2 bg-card p-10 rounded-[3rem] border border-border/10 shadow-2xl space-y-8">
                        <div className="flex items-center gap-8">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-black text-primary text-5xl border-4 border-primary/10 transition-transform hover:scale-105">
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
                                        <h3 className="text-4xl font-black tracking-tight mb-2 text-foreground uppercase">{member.name}</h3>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${member.status === 'Activo' ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'} animate-pulse`} />
                                            <span className="font-black uppercase tracking-widest text-xs text-muted-foreground">{member.status}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-3xl bg-background border border-border/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <Mail className="h-5 w-5 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Email Principal</span>
                                </div>
                                {isEditing ? (
                                    <Input
                                        type="email"
                                        value={editData.email}
                                        onChange={(e: any) => setEditData({ ...editData, email: e.target.value })}
                                        className="font-bold rounded-xl border-border/20 text-foreground"
                                    />
                                ) : (
                                    <p className="font-black text-lg text-foreground">{member.email}</p>
                                )}
                            </div>

                            <div className="p-6 rounded-3xl bg-background border border-border/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <Phone className="h-5 w-5 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Teléfono</span>
                                </div>
                                {isEditing ? (
                                    <Input
                                        type="tel"
                                        value={editData.phone}
                                        onChange={(e: any) => setEditData({ ...editData, phone: e.target.value })}
                                        className="font-bold rounded-xl border-border/20 text-foreground"
                                    />
                                ) : (
                                    <p className="font-black text-lg text-foreground">{member.phone}</p>
                                )}
                            </div>

                            <div className="p-6 rounded-3xl bg-background border border-border/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Fecha de Ingreso</span>
                                </div>
                                <p className="font-black text-lg text-foreground">{member.joinDate}</p>
                            </div>

                            <div className="p-6 rounded-3xl bg-background border border-border/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <CreditCard className="h-5 w-5 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Plan de Élite</span>
                                </div>
                                {isEditing ? (
                                    <Select value={editData.plan} onValueChange={v => setEditData({ ...editData, plan: v })}>
                                        <SelectTrigger className="h-10 rounded-xl font-bold border-border/20 text-foreground">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="GYM">GYM</SelectItem>
                                            <SelectItem value="Cognitivo">Cognitivo</SelectItem>
                                            <SelectItem value="Premium">Premium</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="inline-flex items-center px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20">
                                        <span className="font-black text-primary uppercase tracking-widest">{member.plan}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-card p-8 rounded-[3rem] border border-border/10 shadow-2xl">
                            <h4 className="text-xl font-black uppercase tracking-tight mb-6 text-foreground">Estadísticas</h4>
                            <div className="space-y-6">
                                <div className="text-center p-6 rounded-3xl bg-primary/5 border border-primary/10">
                                    <div className="text-5xl font-black text-primary mb-2">0</div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Clases Asistidas</p>
                                </div>
                                <div className="text-center p-6 rounded-3xl bg-background border border-border/5">
                                    <div className="text-5xl font-black mb-2 text-primary">0</div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Días Activo</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card p-8 rounded-[3rem] border border-border/10 shadow-2xl">
                            <h4 className="text-xl font-black uppercase tracking-tight mb-6 text-foreground">Acciones Rápidas</h4>
                            <div className="space-y-4">
                                <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90">
                                    <Activity className="mr-2 h-5 w-5" />
                                    Ver Historial
                                </Button>
                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest border-border/20 text-foreground"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90"
                                        >
                                            Guardar
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditing(true)}
                                        className="w-full h-14 rounded-2xl font-black uppercase tracking-widest border-border/20 text-foreground"
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
