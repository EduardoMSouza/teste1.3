// src/app/dashboard/dentistas/components/DentistasTable.tsx
"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Phone, Mail, User, Stethoscope } from "lucide-react"

interface Dentista {
    id: number;
    nome: string;
    cro: string;
    especialidade?: string;
    telefone?: string;
    email?: string;
    ativo: boolean;
}

interface DentistasTableProps {
    dentistas: Dentista[]
    loading: boolean
    onEdit: (dentista: Dentista) => void
    onDelete: (id: number) => void
    onToggleStatus: (id: number, ativo: boolean) => void
}

export default function DentistasTable({
                                           dentistas,
                                           loading,
                                           onEdit,
                                           onDelete,
                                           onToggleStatus
                                       }: DentistasTableProps) {

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (dentistas.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Nenhum dentista encontrado
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Dentista</TableHead>
                        <TableHead>CRO</TableHead>
                        <TableHead>Especialidade</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[150px]">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dentistas.map((dentista) => (
                        <TableRow key={dentista.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{dentista.nome}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {dentista.email}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="font-mono font-medium">
                                {dentista.cro}
                            </TableCell>
                            <TableCell>
                                {dentista.especialidade ? (
                                    <div className="flex items-center gap-2">
                                        <Stethoscope className="h-3 w-3" />
                                        {dentista.especialidade}
                                    </div>
                                ) : (
                                    '-'
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    {dentista.telefone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-3 w-3" />
                                            {dentista.telefone}
                                        </div>
                                    )}
                                    {dentista.email && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="h-3 w-3" />
                                            {dentista.email}
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={dentista.ativo ? "default" : "secondary"}>
                                    {dentista.ativo ? 'Ativo' : 'Inativo'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(dentista)}
                                        title="Editar dentista"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onToggleStatus(dentista.id, dentista.ativo)}
                                        title={dentista.ativo ? 'Desativar dentista' : 'Ativar dentista'}
                                    >
                                        {dentista.ativo ? '🚫' : '✅'}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete(dentista.id)}
                                        className="text-destructive hover:text-destructive"
                                        title="Excluir dentista"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}