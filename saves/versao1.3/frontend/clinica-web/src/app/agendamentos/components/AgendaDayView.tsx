"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, User, Edit, Trash2, MoreHorizontal, CheckCircle2, XCircle, Check } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Agenda } from "@/services/agendaService"

interface AgendaDayViewProps {
    selectedDate: Date | null
    agendamentos: Agenda[]
    onEdit?: (id: number) => void  // Mude para receber ID
    onDelete?: (id: number) => void
    onStatusChange?: (id: number, status: string) => void
}


export function AgendaDayView({ selectedDate, agendamentos, onEdit, onDelete, onStatusChange }: AgendaDayViewProps) {
    if (!selectedDate) {
        return (
            <Card className="h-full shadow-lg border-2">
                <CardContent className="flex items-center justify-center h-[400px]">
                    <div className="text-center space-y-3 animate-in fade-in zoom-in duration-500">
                        <div className="h-16 w-16 rounded-full bg-muted mx-auto flex items-center justify-center animate-pulse">
                            <Calendar className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-lg font-medium">Selecione uma data</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Clique em um dia no calendário para ver os agendamentos
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const dayAgendamentos = agendamentos
        .filter((ag) => {
            const agDate = new Date(ag.dataHora)
            return agDate.toDateString() === selectedDate.toDateString()
        })
        .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString)
        return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    }

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            AGENDADO: { variant: "secondary" as const, label: "Agendado" },
            CONFIRMADO: { variant: "default" as const, label: "Confirmado" },
            CONCLUIDO: { variant: "success" as const, label: "Concluído" },
            CANCELADO: { variant: "destructive" as const, label: "Cancelado" },
        } as const

        const config = statusConfig[status as keyof typeof statusConfig] || {
            variant: "secondary" as const,
            label: status,
        }

        return (
            <Badge variant={config.variant} className="font-normal">
                {config.label}
            </Badge>
        )
    }

    const statusActions = [
        { status: "CONFIRMADO", label: "Confirmar", icon: CheckCircle2 },
        { status: "CANCELADO", label: "Cancelar", icon: XCircle },
        { status: "CONCLUIDO", label: "Concluir", icon: Check },
    ]

    return (
        <Card className="h-full shadow-lg border-2 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right duration-500">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-lg capitalize">{formatDate(selectedDate)}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {dayAgendamentos.length} {dayAgendamentos.length === 1 ? "agendamento" : "agendamentos"}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {dayAgendamentos.length === 0 ? (
                    <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                        <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center animate-pulse">
                            <Calendar className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-base font-medium">Nenhum agendamento</p>
                        <p className="text-sm text-muted-foreground mt-1">Este dia está livre para novos agendamentos</p>
                    </div>
                ) : (
                    <ScrollArea className="h-[500px] pr-4">
                        <div className="space-y-3">
                            {dayAgendamentos.map((agendamento, index) => (
                                <Card
                                    key={agendamento.id}
                                    className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-in fade-in slide-in-from-left"
                                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: "backwards" }}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 space-y-3">
                                                {/* Horário e Status */}
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                                        <Clock className="h-4 w-4 text-primary animate-pulse" />
                                                        {formatTime(agendamento.dataHora)}
                                                    </div>
                                                    {getStatusBadge(agendamento.status)}
                                                </div>

                                                {/* Paciente */}
                                                <div className="flex items-center gap-2 group/patient">
                                                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center transition-transform duration-300 group-hover/patient:scale-110 group-hover/patient:rotate-6">
                                                        <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">{agendamento.pacienteNome}</p>
                                                        <p className="text-xs text-muted-foreground">Paciente</p>
                                                    </div>
                                                </div>

                                                {/* Dentista */}
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <User className="h-3.5 w-3.5" />
                                                    <span>Dr(a). {agendamento.dentistaNome}</span>
                                                </div>

                                                {/* Observações */}
                                                {agendamento.observacoes && (
                                                    <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded transition-colors duration-200 hover:bg-muted">
                                                        {agendamento.observacoes}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Menu de Ações */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-primary/10 hover:scale-110 transition-all duration-200"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 animate-in fade-in zoom-in duration-200">
                                                    <DropdownMenuItem
                                                        onClick={() => onEdit?.(agendamento.id)}
                                                        className="flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    {statusActions.map(({ status, label, icon: Icon }) => (
                                                        <DropdownMenuItem
                                                            key={status}
                                                            onClick={() => onStatusChange?.(agendamento.id, status)}
                                                            className="flex items-center gap-2 cursor-pointer"
                                                            disabled={agendamento.status === status}
                                                        >
                                                            <Icon className="h-4 w-4" />
                                                            {label}
                                                        </DropdownMenuItem>
                                                    ))}
                                                    <DropdownMenuItem
                                                        onClick={() => onDelete?.(agendamento.id)}
                                                        className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive border-t"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    )
}
