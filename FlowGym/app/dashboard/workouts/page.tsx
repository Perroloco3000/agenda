"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Dumbbell, Plus, Timer, Zap, Play, Settings2, MoreVertical, Layers, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore, WorkoutStat } from "@/lib/store"
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function WorkoutsPage() {
    const { workouts, addWorkout, deleteWorkout, updateWorkout } = useAppStore()
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingWorkout, setEditingWorkout] = useState<WorkoutStat | null>(null)
    const [newWorkout, setNewWorkout] = useState<Partial<WorkoutStat>>({
        name: "", type: "Hybrid", stations: 0, work: "45s", rest: "15s", color: "bg-purple-500"
    })

    const handleCreate = async () => {
        if (newWorkout.name && newWorkout.stations) {
            try {
                await addWorkout({
                    name: newWorkout.name,
                    type: newWorkout.type || "Hybrid",
                    stations: Number(newWorkout.stations),
                    work: newWorkout.work || "45s",
                    rest: newWorkout.rest || "15s",
                    color: newWorkout.color || "bg-purple-500"
                })
                setIsCreateOpen(false)
                setNewWorkout({ name: "", type: "Hybrid", stations: 0, work: "45s", rest: "15s", color: "bg-purple-500" })
            } catch (err) {
                console.error("Error adding workout:", err)
            }
        }
    }

    const handleEdit = (workout: WorkoutStat) => {
        setEditingWorkout(workout)
        setIsEditOpen(true)
    }

    const handleUpdate = async () => {
        if (editingWorkout && editingWorkout.name && editingWorkout.stations) {
            try {
                await updateWorkout(editingWorkout.id, {
                    name: editingWorkout.name,
                    type: editingWorkout.type,
                    stations: editingWorkout.stations,
                    work: editingWorkout.work,
                    rest: editingWorkout.rest,
                    color: editingWorkout.color
                })
                setIsEditOpen(false)
                setEditingWorkout(null)
            } catch (err) {
                console.error("Error updating workout:", err)
            }
        }
    }

    return (
        <DashboardShell>
            <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Rutinas</h2>
                        <p className="text-xl text-muted-foreground font-medium">Crea y edita los entrenamientos del día.</p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="h-16 px-8 rounded-3xl bg-primary text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                                <Plus className="mr-2 h-6 w-6" />
                                Nueva Rutina
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Crear Nueva Rutina</DialogTitle>
                                <DialogDescription>Configura los detalles del entrenamiento.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Nombre</Label>
                                    <Input value={newWorkout.name} onChange={e => setNewWorkout({ ...newWorkout, name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Tipo</Label>
                                        <Select value={newWorkout.type} onValueChange={v => setNewWorkout({ ...newWorkout, type: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Cardio">Cardio</SelectItem>
                                                <SelectItem value="Resistance">Resistance</SelectItem>
                                                <SelectItem value="Hybrid">Hybrid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Estaciones</Label>
                                        <Input type="number" value={newWorkout.stations} onChange={e => setNewWorkout({ ...newWorkout, stations: Number(e.target.value) })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Trabajo</Label>
                                        <Input value={newWorkout.work} onChange={e => setNewWorkout({ ...newWorkout, work: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Descanso</Label>
                                        <Input value={newWorkout.rest} onChange={e => setNewWorkout({ ...newWorkout, rest: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreate}>Crear Rutina</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Workout Dialog */}
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Editar Rutina</DialogTitle>
                                <DialogDescription>Modifica los detalles del entrenamiento.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Nombre</Label>
                                    <Input value={editingWorkout?.name || ""} onChange={e => setEditingWorkout(editingWorkout ? { ...editingWorkout, name: e.target.value } : null)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Tipo</Label>
                                        <Select value={editingWorkout?.type} onValueChange={v => setEditingWorkout(editingWorkout ? { ...editingWorkout, type: v } : null)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Cardio">Cardio</SelectItem>
                                                <SelectItem value="Resistance">Resistance</SelectItem>
                                                <SelectItem value="Hybrid">Hybrid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Estaciones</Label>
                                        <Input type="number" value={editingWorkout?.stations || 0} onChange={e => setEditingWorkout(editingWorkout ? { ...editingWorkout, stations: Number(e.target.value) } : null)} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Trabajo</Label>
                                        <Input value={editingWorkout?.work || ""} onChange={e => setEditingWorkout(editingWorkout ? { ...editingWorkout, work: e.target.value } : null)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Descanso</Label>
                                        <Input value={editingWorkout?.rest || ""} onChange={e => setEditingWorkout(editingWorkout ? { ...editingWorkout, rest: e.target.value } : null)} />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleUpdate}>Guardar Cambios</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {workouts.map((workout) => (
                        <div key={workout.id} className="group relative bg-card rounded-[3rem] border border-border/50 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2">
                            {/* Card Header */}
                            <div className={`${workout.color} p-10 relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-700" />
                                <div className="relative z-10 flex justify-between items-start">
                                    <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl text-white font-black text-xs uppercase tracking-widest border border-white/10">
                                        {workout.type}
                                    </div>
                                    <Button onClick={async () => await deleteWorkout(workout.id)} variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-white/10 border border-white/10 text-white hover:bg-red-500/80 hover:border-red-500">
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                                <div className="relative z-10 mt-8">
                                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2">{workout.name}</h3>
                                    <p className="text-white/80 font-bold uppercase tracking-widest text-sm">KaiCenter SC Signature</p>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-10 space-y-8">
                                <div className="flex justify-between items-center bg-muted/30 p-6 rounded-3xl border border-border/20">
                                    <div className="flex flex-col items-center">
                                        <Layers className="h-5 w-5 text-primary mb-2" />
                                        <span className="text-2xl font-black leading-none">{workout.stations}</span>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Estaciones</span>
                                    </div>
                                    <div className="w-px h-10 bg-border/50" />
                                    <div className="flex flex-col items-center">
                                        <Timer className="h-5 w-5 text-primary mb-2" />
                                        <span className="text-2xl font-black leading-none">{workout.work}</span>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Trabajo</span>
                                    </div>
                                    <div className="w-px h-10 bg-border/50" />
                                    <div className="flex flex-col items-center">
                                        <Zap className="h-5 w-5 text-primary mb-2" />
                                        <span className="text-2xl font-black leading-none">{workout.rest}</span>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Descanso</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button onClick={() => handleEdit(workout)} variant="outline" className="flex-1 h-14 rounded-2xl border-border font-black uppercase tracking-widest hover:bg-muted transition-colors">
                                        <Settings2 className="mr-2 h-5 w-5" />
                                        Editar
                                    </Button>
                                    <Link href={`/?day=${workout.name.toLowerCase()}`} className="flex-1">
                                        <Button className="w-full h-14 rounded-2xl bg-primary shadow-lg shadow-primary/20 font-black uppercase tracking-widest hover:scale-105 transition-transform active:scale-95">
                                            <Play className="mr-2 h-5 w-5 fill-current" />
                                            Iniciar
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Next Workout Indicator */}
                            <div className="px-10 pb-8 flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-card" />
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-muted-foreground">3 Instructores asignados</span>
                            </div>
                        </div>
                    ))}

                    {/* New Workout Card Turn into Button that opens Modal */}
                    <button onClick={() => setIsCreateOpen(true)} className="h-[580px] rounded-[3rem] border-4 border-dashed border-muted flex flex-col items-center justify-center p-12 text-muted-foreground hover:bg-muted/10 hover:border-primary/30 hover:text-primary transition-all group">
                        <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                            <Plus className="h-12 w-12" />
                        </div>
                        <span className="text-2xl font-black uppercase tracking-tighter">Crear Nueva Rutina</span>
                        <p className="text-center mt-2 font-medium">Personaliza tiempos, ejercicios y laps.</p>
                    </button>
                </div>
            </section>
        </DashboardShell>
    )
}
