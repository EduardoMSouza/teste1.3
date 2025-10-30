// src/app/dashboard/agendamentos/components/agenda-data-table.tsx (Atualizado para corrigir acento no status)
"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Download,
    MoreHorizontal,
    Edit,
    Trash2,
    Calendar,
    User,
    Clock,
    CheckCircle2,
    XCircle,
    Check,
} from "lucide-react"

interface TableData {
    id: number
    pacienteNome: string
    dentistaNome: string
    dataHora: string
    status: string
    observacoes: string
}

interface AgendaDataTableProps {
    data: TableData[]
    onEdit?: (id: number) => void  // ✅ Correto
    onDelete?: (id: number) => void
    onStatusChange?: (id: number, status: string) => void
}

export function AgendaDataTable({ data, onEdit, onDelete, onStatusChange }: AgendaDataTableProps) {
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    const filteredData = data.filter(
        (item) =>
            item.pacienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.dentistaNome.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const toggleRowSelection = (id: number) => {
        setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
    }

    const toggleAllSelection = () => {
        setSelectedRows((prev) => (prev.length === filteredData.length ? [] : filteredData.map((item) => item.id)))
    }

    const exportToCSV = () => {
        const headers = ["ID", "Paciente", "Dentista", "Data/Hora", "Status", "Observações"]
        const csvContent = [
            headers.join(","),
            ...filteredData.map((row) =>
                [
                    row.id,
                    `"${row.pacienteNome}"`,
                    `"${row.dentistaNome}"`,
                    row.dataHora,
                    row.status,
                    `"${row.observacoes}"`,
                ].join(","),
            ),
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "agendamentos.csv"
        link.click()
        window.URL.revokeObjectURL(url)
    }

    const formatDateTime = (dateTimeString: string) => {
        if (!dateTimeString || dateTimeString === "N/A") return "N/A"
        const date = new Date(dateTimeString)
        if (isNaN(date.getTime())) return "N/A"
        return `${date.toLocaleDateString("pt-BR")} às ${date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        })}`
    }

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            AGENDADO: { variant: "secondary" as const, label: "Agendado" },
            CONFIRMADO: { variant: "default" as const, label: "Confirmado" },
            CONCLUIDO: { variant: "success" as const, label: "Concluído" }, // Sem acento no valor, label com acento
            CANCELADO: { variant: "destructive" as const, label: "Cancelado" },
        } as const

        const config = statusConfig[status as keyof typeof statusConfig] || { variant: "secondary" as const, label: status }
        return (
            <Badge variant={config.variant} className="font-normal">
                {config.label}
            </Badge>
        )
    }

    const handleStatusUpdate = (id: number, newStatus: string) => {
        if (onStatusChange) {
            onStatusChange(id, newStatus)
        }
    }

    // Ações de status sem acento no valor (compatível com enum Java: CONCLUIDO)
    const statusActions = [
        { status: "CONFIRMADO", label: "Confirmar", icon: CheckCircle2 },
        { status: "CANCELADO", label: "Cancelar", icon: XCircle },
        { status: "CONCLUIDO", label: "Concluir", icon: Check }, // Sem acento no status
    ]

    return (
        <div className="bg-card rounded-lg">
            {/* Header da Tabela */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Agenda de Consultas</h3>
                        <p className="text-sm text-muted-foreground">
                            {filteredData.length} {filteredData.length === 1 ? "agendamento" : "agendamentos"}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    {/* Dropdown de ações */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-10 gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all bg-transparent"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                                Ações
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={exportToCSV} className="flex items-center gap-2 cursor-pointer">
                                <Download className="h-4 w-4" />
                                Exportar CSV
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Corpo da Tabela */}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b">
                            <TableHead className="font-semibold text-foreground bg-muted/50">Paciente</TableHead>
                            <TableHead className="font-semibold text-foreground bg-muted/50">Dentista</TableHead>
                            <TableHead className="font-semibold text-foreground bg-muted/50">Data/Hora</TableHead>
                            <TableHead className="font-semibold text-foreground bg-muted/50">Status</TableHead>
                            <TableHead className="font-semibold text-foreground bg-muted/50 text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredData.map((item) => (
                            <TableRow
                                key={item.id}
                                className="group hover:bg-muted/30 transition-colors duration-200 border-b last:border-0"
                            >
                                <TableCell className="font-medium text-foreground">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <span className="truncate max-w-[200px]" title={item.pacienteNome}>
                      {item.pacienteNome}
                    </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                  <span className="truncate max-w-[180px] block" title={item.dentistaNome}>
                    {item.dentistaNome}
                  </span>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        {formatDateTime(item.dataHora)}
                                    </div>
                                </TableCell>
                                <TableCell>{getStatusBadge(item.status)}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem
                                                onClick={() => onEdit?.(item.id)}
                                                className="flex items-center gap-2 cursor-pointer"
                                            >
                                                <Edit className="h-4 w-4" />
                                                Editar
                                            </DropdownMenuItem>
                                            {statusActions.map(({ status, label, icon: Icon }) => (
                                                <DropdownMenuItem
                                                    key={status}
                                                    onClick={() => handleStatusUpdate(item.id, status)}
                                                    className="flex items-center gap-2 cursor-pointer"
                                                    disabled={item.status === status}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                    {label}
                                                </DropdownMenuItem>
                                            ))}
                                            <DropdownMenuItem
                                                onClick={() => onDelete?.(item.id)}
                                                className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive border-t"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Excluir
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Rodapé */}
            {filteredData.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium">Nenhum agendamento encontrado</p>
                    <p className="text-sm mt-1">Tente ajustar os filtros de busca</p>
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t bg-muted/20 text-sm text-muted-foreground">
                    <div className="font-medium">
                        {selectedRows.length > 0 ? (
                            <span className="text-primary">
                {selectedRows.length} de {filteredData.length} selecionado(s)
              </span>
                        ) : (
                            <span>
                Mostrando {filteredData.length} {filteredData.length === 1 ? "resultado" : "resultados"}
              </span>
                        )}
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-sm">Linhas por página:</span>
                            <Select defaultValue="10">
                                <SelectTrigger className="w-20 h-9 border bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="font-medium">Página 1 de 1</div>
                    </div>
                </div>
            )}
        </div>
    )
}
