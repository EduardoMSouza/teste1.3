"use client"

import { useState, useEffect } from "react"
import { Loader2, RefreshCw, Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { AgendaCalendar } from "./components/AgendaCalendar"
import { AgendaDayView } from "./components/AgendaDayView"
import { AgendaStats } from "./components/AgendaStats"
import AgendaFormDialog from "./components/AgendaFormDialog"
import { AgendaDataTable } from "./components/agenda-data-table"
import {Agenda, agendaService} from "@/services/agendaService"

// Adicione esta interface se necessário
interface Dentista {
    id: number;
    nome: string;
    especialidade: string;
}

export default function AgendamentosPage() {
    const [agendamentos, setAgendamentos] = useState<Agenda[]>([])
    const [dentistas, setDentistas] = useState<Dentista[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [selectedAgendamento, setSelectedAgendamento] = useState<Agenda | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [activeView, setActiveView] = useState<"calendar" | "table">("calendar")

    const loadAgendamentos = async () => {
        try {
            const data = await agendaService.getAgendamentos()
            setAgendamentos(data)
        } catch (error: any) {
            console.error("Erro ao carregar agendamentos:", error)
            toast.error("Erro ao carregar agendamentos")
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const loadDentistas = async () => {
        try {
            const data = await agendaService.getDentistas()
            setDentistas(data)
        } catch (error: any) {
            console.error("Erro ao carregar dentistas:", error)
        }
    }

    useEffect(() => {
        loadAgendamentos()
        loadDentistas()
    }, [])

    const handleRefresh = () => {
        setRefreshing(true)
        loadAgendamentos()
    }

    const handleEdit = (id: number) => {
        const agendamento = agendamentos.find(ag => ag.id === id)
        if (agendamento) {
            setSelectedAgendamento(agendamento)
            setShowForm(true)
        }
    }

    const handleFormSuccess = () => {
        setShowForm(false)
        setSelectedAgendamento(null)
        handleRefresh()
    }

    const handleDelete = async (id: number) => {
        try {
            await agendaService.deleteAgendamento(id)
            toast.success("Agendamento excluído com sucesso!")
            handleRefresh()
        } catch (error: any) {
            console.error("Erro ao excluir agendamento:", error)
            toast.error("Erro ao excluir agendamento")
        }
    }

    const handleStatusChange = async (id: number, status: string) => {
        try {
            await agendaService.updateStatus(id, status)
            toast.success("Status atualizado com sucesso!")
            handleRefresh()
        } catch (error: any) {
            console.error("Erro ao atualizar status:", error)
            toast.error("Erro ao atualizar status")
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4 animate-in fade-in zoom-in duration-500">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground">Carregando agendamentos...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-top duration-500">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        Agenda
                    </h1>
                    <p className="text-muted-foreground mt-1">Gerencie os agendamentos de consultas</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="gap-2 bg-transparent hover:bg-primary/10 hover:border-primary/50 hover:scale-105 transition-all duration-200"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                        Atualizar
                    </Button>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                    >
                        <Plus className="h-4 w-4" />
                        Novo Agendamento
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <AgendaStats agendamentos={agendamentos} />

            {/* Tabs para alternar entre visualizações */}
            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "calendar" | "table")}>
                <TabsList className="grid w-full max-w-md grid-cols-2 animate-in fade-in slide-in-from-bottom duration-500 delay-200">
                    <TabsTrigger value="calendar" className="transition-all duration-200 data-[state=active]:scale-105">
                        Calendário
                    </TabsTrigger>
                    <TabsTrigger value="table" className="transition-all duration-200 data-[state=active]:scale-105">
                        Lista
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="calendar" className="space-y-6 mt-6 animate-in fade-in slide-in-from-bottom duration-500">
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <AgendaCalendar agendamentos={agendamentos} onDateSelect={setSelectedDate} selectedDate={selectedDate} />
                        </div>
                        <div className="lg:col-span-1">
                            <AgendaDayView
                                selectedDate={selectedDate}
                                agendamentos={agendamentos}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onStatusChange={handleStatusChange}
                            />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="table" className="mt-6 animate-in fade-in slide-in-from-bottom duration-500">
                    <AgendaDataTable
                        data={agendamentos}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                    />
                </TabsContent>
            </Tabs>

            {/* Dialog de Formulário */}
            <AgendaFormDialog
                agendamento={selectedAgendamento}
                onSuccess={handleFormSuccess}
                open={showForm}
                onOpenChange={setShowForm}
            />
        </div>
    )
}
