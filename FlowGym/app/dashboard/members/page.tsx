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
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase">Miembros</h2>
                        <p className="text-xl text-emerald-400 font-bold uppercase tracking-widest pl-1">Comunidad Kai Center</p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="h-16 px-10 rounded-2xl bg-emerald-500 text-black font-black text-lg shadow-xl shadow-emerald-500/30 hover:scale-105 hover:bg-emerald-400 transition-all active:scale-95 uppercase tracking-wider">
                                <UserPlus className="mr-3 h-6 w-6" />
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
                                                <SelectItem value="Plan Plus">Plan Plus</SelectItem>
                                                <SelectItem value="Plan Basic">Plan Basic</SelectItem>
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
                <div className="flex flex-col md:flex-row gap-6 bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-6 w-6 text-white/20 group-hover:text-emerald-400 transition-colors" />
                        <Input
                            placeholder="Buscar por nombre, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-16 pl-20 pr-10 rounded-2xl bg-white/[0.03] border-white/10 text-lg font-bold focus-visible:ring-emerald-500/20 transition-all text-white"
                        />
                    </div>
                    <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 font-black uppercase tracking-widest text-xs flex gap-4 hover:bg-white/10">
                        <Filter className="h-5 w-5 text-emerald-400" />
                        Filtros
                    </Button>
                </div>

                {/* Members List */}
                <div className="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-12 py-8 font-black uppercase tracking-[0.2em] text-white/20 text-[10px]">Miembro</th>
                                    <th className="px-12 py-8 font-black uppercase tracking-[0.2em] text-white/20 text-[10px]">Contacto</th>
                                    <th className="px-12 py-8 font-black uppercase tracking-[0.2em] text-white/20 text-[10px]">Plan</th>
                                    <th className="px-12 py-8 font-black uppercase tracking-[0.2em] text-white/20 text-[10px]">Estado</th>
                                    <th className="px-12 py-8 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {filteredMembers.map((member) => (
                                    <tr key={member.id} className="group hover:bg-white/[0.03] transition-all duration-300">
                                        <td className="px-12 py-10">
                                            <div className="flex items-center gap-8">
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center font-black text-emerald-400 text-2xl border border-emerald-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-2xl tracking-tight text-white uppercase">{member.name}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mt-1">Desde: {member.joinDate}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-4 text-white/40 group/mail">
                                                    <div className="p-2 rounded-lg bg-white/5 group-hover/mail:bg-emerald-500/20 transition-all">
                                                        <Mail className="h-4 w-4 group-hover/mail:text-emerald-400" />
                                                    </div>
                                                    <span className="font-bold text-base">{member.email}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-white/40 group/phone">
                                                    <div className="p-2 rounded-lg bg-white/5 group-hover/phone:bg-blue-500/20 transition-all">
                                                        <Phone className="h-4 w-4 group-hover/phone:text-blue-400" />
                                                    </div>
                                                    <span className="font-bold text-base">{member.phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="inline-flex items-center px-5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                                                <span className="font-black text-emerald-400 uppercase text-[10px] tracking-widest">{member.plan}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <button onClick={async () => await toggleMemberStatus(member.id)} className="flex items-center gap-4 hover:scale-105 transition-transform">
                                                <div className={`w-3 h-3 rounded-full ${member.status === 'Activo' ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-red-500 shadow-[0_0_15px_#ef4444]'} animate-pulse`} />
                                                <span className="font-black uppercase tracking-widest text-[10px] text-white">{member.status}</span>
                                            </button>
                                        </td>
                                        <td className="px-12 py-10 text-right">
                                            <div className="flex items-center gap-4 justify-end">
                                                <Link href={`/dashboard/members/profile?id=${member.id}`}>
                                                    <Button variant="outline" className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all">
                                                        Ver Perfil
                                                    </Button>
                                                </Link>
                                                <Button onClick={async () => await removeMember(member.id)} variant="ghost" size="icon" className="h-12 w-12 rounded-xl border border-transparent hover:border-red-500/30 hover:bg-red-500/20 hover:text-red-400 transition-all">
                                                    <Trash2 className="h-6 w-6" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-12 border-t border-white/5 bg-white/[0.01] text-center">
                        <p className="text-white/20 font-black uppercase tracking-[0.3em] text-xs">Total de {filteredMembers.length} Miembros de Élite</p>
                    </div>
                </div>
            </section>
        </DashboardShell>
    )
}
