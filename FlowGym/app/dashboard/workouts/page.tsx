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
        name: "",
        type: "Hybrid",
        stations: 0,
        work: "45s",
        rest: "15s",
        color: "bg-purple-500",
        day: "Lunes",
        difficulty: "Power"
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
                    color: getColorByDifficulty(newWorkout.difficulty || "Power"),
                    day: newWorkout.day || "Lunes",
                    difficulty: newWorkout.difficulty || "Power",
                    video_url: newWorkout.videoUrl,
                    exercises: newWorkout.exercises || []
                } as any)
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
                    color: getColorByDifficulty(editingWorkout.difficulty || "Power"),
                    day: editingWorkout.day,
                    difficulty: editingWorkout.difficulty,
                    video_url: editingWorkout.videoUrl,
                    exercises: editingWorkout.exercises || []
                } as any)
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
                        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
                                        <Label>Día</Label>
                                        <Select value={newWorkout.day} onValueChange={v => setNewWorkout({ ...newWorkout, day: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map(d => (
                                                    <SelectItem key={d} value={d}>{d}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Dificultad</Label>
                                        <Select value={newWorkout.difficulty} onValueChange={v => setNewWorkout({ ...newWorkout, difficulty: v as any })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Intro">Intro (Verde)</SelectItem>
                                                <SelectItem value="Power">Power (Azul)</SelectItem>
                                                <SelectItem value="Elite">Elite (Rojo)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Trabajo (ej: 45s)</Label>
                                        <Input value={newWorkout.work} onChange={e => setNewWorkout({ ...newWorkout, work: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Descanso (ej: 15s)</Label>
                                        <Input value={newWorkout.rest} onChange={e => setNewWorkout({ ...newWorkout, rest: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Video Tutorial Principal (Link)</Label>
                                    <Input placeholder="https://youtube.com/..." value={newWorkout.videoUrl} onChange={e => setNewWorkout({ ...newWorkout, videoUrl: e.target.value })} />
                                </div>

                                <div className="mt-4 border-t pt-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <Label className="text-lg font-bold">Ejercicios</Label>
                                        <Button variant="outline" size="sm" onClick={() => {
                                            const exs = [...(newWorkout.exercises || [])]
                                            exs.push({ id: Math.random().toString(36).substr(2, 9), name: "Nuevo Ejercicio", videoUrl: "" })
                                            setNewWorkout({ ...newWorkout, exercises: exs })
                                        }}>
                                            <Plus className="h-4 w-4 mr-2" /> Añadir
                                        </Button>
                                    </div>
                                    <div className="space-y-3">
                                        {(newWorkout.exercises || []).map((ex: any, idx: number) => (
                                            <div key={ex.id} className="p-3 border rounded-xl bg-muted/50 space-y-2 relative">
                                                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:text-red-500" onClick={() => {
                                                    const exs = (newWorkout.exercises || []).filter((_: any, i: number) => i !== idx)
                                                    setNewWorkout({ ...newWorkout, exercises: exs })
                                                }}>
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                                <div className="grid gap-1">
                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Nombre</Label>
                                                    <Input className="h-8 text-sm" value={ex.name} onChange={e => {
                                                        const exs = [...(newWorkout.exercises || [])]
                                                        exs[idx].name = e.target.value
                                                        setNewWorkout({ ...newWorkout, exercises: exs })
                                                    }} />
                                                </div>
                                                <div className="grid gap-1">
                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Link Video (Opcional)</Label>
                                                    <Input className="h-8 text-sm" placeholder="https://..." value={ex.videoUrl} onChange={e => {
                                                        const exs = [...(newWorkout.exercises || [])]
                                                        exs[idx].videoUrl = e.target.value
                                                        setNewWorkout({ ...newWorkout, exercises: exs })
                                                    }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreate} className="w-full">Crear Rutina</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Workout Dialog */}
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
                                        <Label>Día</Label>
                                        <Select value={editingWorkout?.day} onValueChange={v => setEditingWorkout(editingWorkout ? { ...editingWorkout, day: v } : null)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map(d => (
                                                    <SelectItem key={d} value={d}>{d}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Dificultad</Label>
                                        <Select value={editingWorkout?.difficulty} onValueChange={v => setEditingWorkout(editingWorkout ? { ...editingWorkout, difficulty: v as any } : null)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Intro">Intro (Verde)</SelectItem>
                                                <SelectItem value="Power">Power (Azul)</SelectItem>
                                                <SelectItem value="Elite">Elite (Rojo)</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                <div className="grid gap-2">
                                    <Label>Video Tutorial Principal (Link)</Label>
                                    <Input placeholder="https://youtube.com/..." value={editingWorkout?.videoUrl || ""} onChange={e => setEditingWorkout(editingWorkout ? { ...editingWorkout, videoUrl: e.target.value } : null)} />
                                </div>

                                <div className="mt-4 border-t pt-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <Label className="text-lg font-bold">Ejercicios</Label>
                                        <Button variant="outline" size="sm" onClick={() => {
                                            if (!editingWorkout) return
                                            const exs = [...(editingWorkout.exercises || [])]
                                            exs.push({ id: Math.random().toString(36).substr(2, 9), name: "Nuevo Ejercicio", videoUrl: "" })
                                            setEditingWorkout({ ...editingWorkout, exercises: exs })
                                        }}>
                                            <Plus className="h-4 w-4 mr-2" /> Añadir
                                        </Button>
                                    </div>
                                    <div className="space-y-3">
                                        {(editingWorkout?.exercises || []).map((ex: any, idx: number) => (
                                            <div key={ex.id} className="p-3 border rounded-xl bg-muted/50 space-y-2 relative">
                                                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:text-red-500" onClick={() => {
                                                    if (!editingWorkout) return
                                                    const exs = (editingWorkout.exercises || []).filter((_: any, i: number) => i !== idx)
                                                    setEditingWorkout({ ...editingWorkout, exercises: exs })
                                                }}>
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                                <div className="grid gap-1">
                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Nombre</Label>
                                                    <Input className="h-8 text-sm" value={ex.name} onChange={e => {
                                                        if (!editingWorkout) return
                                                        const exs = [...(editingWorkout.exercises || [])]
                                                        exs[idx].name = e.target.value
                                                        setEditingWorkout({ ...editingWorkout, exercises: exs })
                                                    }} />
                                                </div>
                                                <div className="grid gap-1">
                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Link Video (Opcional)</Label>
                                                    <Input className="h-8 text-sm" placeholder="https://..." value={ex.videoUrl} onChange={e => {
                                                        if (!editingWorkout) return
                                                        const exs = [...(editingWorkout.exercises || [])]
                                                        exs[idx].videoUrl = e.target.value
                                                        setEditingWorkout({ ...editingWorkout, exercises: exs })
                                                    }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleUpdate} className="w-full">Guardar Cambios</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {workouts.map((workout) => (
                        <div key={workout.id} className="group relative bg-card rounded-[3rem] border border-border/50 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2">
                            {/* Card Header */}
                            <div className={`${workout.color} p-10 relative overflow-hidden`}>
                                <div className="flex items-center gap-2">
                                    <Link href={`/dashboard/workouts/play?id=${workout.id}`} className="flex-1">
                                        <Button className="w-full h-14 rounded-2xl bg-white text-black hover:bg-white/90 font-black uppercase tracking-tighter italic flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
                                            <Play className="h-5 w-5 fill-current" /> Entrenar Ahora
                                        </Button>
                                    </Link>
                                    <Button onClick={() => handleEdit(workout)} variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-white/20 bg-white/10 text-white hover:bg-white hover:text-black transition-all">
                                        <Settings2 className="h-5 w-5" />
                                    </Button>
                                </div>
                                <div className="relative z-10 mt-8">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-md text-white uppercase tracking-tighter decoration-emerald-500">
                                            {workout.day}
                                        </span>
                                        <span className="text-[10px] font-black bg-black/20 px-2 py-0.5 rounded-md text-white uppercase tracking-tighter">
                                            {workout.difficulty}
                                        </span>
                                        {workout.videoUrl && (
                                            <span className="text-[10px] font-black bg-rose-600 px-2 py-0.5 rounded-md text-white uppercase tracking-tighter flex items-center gap-1">
                                                <Play className="h-2 w-2 fill-current" /> VIDEO
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2">{workout.name}</h3>
                                    <p className="text-white/80 font-bold uppercase tracking-widest text-sm italic">KaiCenter SC Signature</p>
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
                                    <Link href={`/dashboard/workouts/play?id=${workout.id}`} className="flex-1">
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
        </DashboardShell >
    )
}

function getColorByDifficulty(difficulty: string) {
    switch (difficulty) {
        case "Intro": return "bg-emerald-500";
        case "Power": return "bg-blue-600";
        case "Elite": return "bg-rose-600";
        default: return "bg-purple-500";
    }
}
