"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Users, Search, Filter, Plus, Mail, Phone, MoreHorizontal, UserPlus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore, Member } from "@/lib/store"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function MembersPage() {
    const { members, addMember, removeMember, toggleMemberStatus, isLoaded } = useAppStore()
    console.log("RENDER MembersPage:", members.length, "members, loaded:", isLoaded)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [newMember, setNewMember] = useState<Partial<Member>>({
        name: "", email: "", phone: "", plan: "Premium", status: "Activo"
    })

    const handleCreate = async () => {
        if (newMember.name && newMember.email) {
            try {
                await addMember({
                    name: newMember.name,
                    email: newMember.email,
                    phone: newMember.phone || "",
                    plan: newMember.plan as any || "Premium",
                    status: newMember.status as any || "Activo"
                })
                setIsCreateOpen(false)
                setNewMember({ name: "", email: "", phone: "", plan: "Premium", status: "Activo" })
            } catch (err) {
                console.error("Error adding member:", err)
            }
        }
    }

    const filteredMembers = members.filter(m =>
        (m.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (!isLoaded) {
        return (
            <DashboardShell>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="font-bold text-muted-foreground italic">Cargando base de datos...</p>
                    </div>
                </div>
            </DashboardShell>
        )
    }

    return (
        <DashboardShell>
            <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Miembros</h2>
                        <p className="text-xl text-muted-foreground font-medium">Gestiona la comunidad de tu gimnasio.</p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="h-16 px-8 rounded-3xl bg-primary text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                                <UserPlus className="mr-2 h-6 w-6" />
                                Añadir Miembro
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Registrar Nuevo Miembro</DialogTitle>
                                <DialogDescription>Ingresa los datos del nuevo socio.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Nombre Completo</Label>
                                    <Input value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Email</Label>
                                    <Input type="email" value={newMember.email} onChange={e => setNewMember({ ...newMember, email: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Teléfono</Label>
                                    <Input type="tel" value={newMember.phone} onChange={e => setNewMember({ ...newMember, phone: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Plan</Label>
                                        <Select value={newMember.plan} onValueChange={v => setNewMember({ ...newMember, plan: v as any })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Premium">Premium</SelectItem>
                                                <SelectItem value="VIP">VIP</SelectItem>
                                                <SelectItem value="Básico">Básico</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Estado Inicial</Label>
                                        <Select value={newMember.status} onValueChange={v => setNewMember({ ...newMember, status: v as any })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Activo">Activo</SelectItem>
                                                <SelectItem value="Inactivo">Inactivo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreate}>Registrar Miembro</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-14 pl-14 rounded-2xl bg-muted/30 border-none text-lg font-medium focus-visible:ring-primary/20"
                        />
                    </div>
                    <Button variant="outline" className="h-16 px-8 rounded-2xl border-border bg-muted/10 font-bold flex gap-2">
                        <Filter className="h-5 w-5" />
                        Filtros
                    </Button>
                </div>

                {/* Members List */}
                <div className="bg-card rounded-[3rem] border border-border/50 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border bg-muted/20">
                                <th className="px-10 py-6 font-black uppercase tracking-tight text-muted-foreground">Miembro</th>
                                <th className="px-10 py-6 font-black uppercase tracking-tight text-muted-foreground">Contacto</th>
                                <th className="px-10 py-6 font-black uppercase tracking-tight text-muted-foreground">Plan/Suscripción</th>
                                <th className="px-10 py-6 font-black uppercase tracking-tight text-muted-foreground">Estado</th>
                                <th className="px-10 py-6 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="group hover:bg-muted/10 transition-colors">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center font-black text-primary text-xl border border-primary/10 group-hover:scale-110 transition-transform">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-xl tracking-tight">{member.name}</p>
                                                <p className="text-sm text-muted-foreground font-medium">Desde: {member.joinDate}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3 text-muted-foreground group/mail">
                                                <Mail className="h-4 w-4 group-hover/mail:text-primary transition-colors" />
                                                <span className="font-medium">{member.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-muted-foreground group/phone">
                                                <Phone className="h-4 w-4 group-hover/phone:text-primary transition-colors" />
                                                <span className="font-medium">{member.phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="inline-flex items-center px-5 py-2 rounded-2xl bg-primary/5 border border-primary/10">
                                            <span className="font-black text-primary uppercase text-sm tracking-widest">{member.plan}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <button onClick={async () => await toggleMemberStatus(member.id)} className="flex items-center gap-3 hover:opacity-80">
                                            <div className={`w-3 h-3 rounded-full ${member.status === 'Activo' ? 'bg-green-500 animate-pulse' : 'bg-destructive/50'}`} />
                                            <span className="font-bold">{member.status}</span>
                                        </button>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center gap-2 justify-end">
                                            <Link href={`/dashboard/members/profile?id=${member.id}`}>
                                                <Button variant="outline" className="h-12 px-6 rounded-xl font-bold hover:bg-primary hover:text-primary-foreground">
                                                    Ver Perfil
                                                </Button>
                                            </Link>
                                            <Button onClick={async () => await removeMember(member.id)} variant="ghost" size="icon" className="h-12 w-12 rounded-xl border border-transparent hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500">
                                                <Trash2 className="h-6 w-6" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-10 border-t border-border bg-muted/10 text-center">
                        <p className="text-muted-foreground font-medium">Mostrando {filteredMembers.length} miembros</p>
                    </div>
                </div>
            </section>
        </DashboardShell>
    )
}
