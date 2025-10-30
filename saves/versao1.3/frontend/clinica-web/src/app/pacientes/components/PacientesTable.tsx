// app/pacientes/components/PacientesTable.tsx
"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Phone, Mail, User, Calendar } from "lucide-react"
import { formatadores } from "@/lib/formatadores"

interface Paciente {
    id: number;
    nome: string;
    cpf?: string;
    email?: string;
    telefone?: string;
    dataNascimento?: string;
    convenio?: string;
    dataCadastro: string;
    dataAtualizacao: string;
    status: string;
}

interface PacientesTableProps {
    pacientes: Paciente[]
    loading: boolean
    onEdit: (paciente: Paciente) => void
    onDelete: (id: number) => void
}

export default function PacientesTable({
                                           pacientes,
                                           loading,
                                           onEdit,
                                           onDelete
                                       }: PacientesTableProps) {

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (pacientes.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Nenhum paciente encontrado
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>CPF</TableHead>
                        <TableHead>Data Nasc.</TableHead>
                        <TableHead>Convênio</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pacientes.map((paciente) => (
                        <TableRow key={paciente.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{paciente.nome}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {paciente.email}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    {paciente.telefone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-3 w-3" />
                                            {paciente.telefone}
                                        </div>
                                    )}
                                    {paciente.email && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="h-3 w-3" />
                                            {paciente.email}
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                                {paciente.cpf || '-'}
                            </TableCell>
                            <TableCell>
                                {paciente.dataNascimento ? (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3 w-3" />
                                        {formatadores.dataDoBackend(paciente.dataNascimento)}
                                    </div>
                                ) : (
                                    '-'
                                )}
                            </TableCell>
                            <TableCell>
                                {paciente.convenio ? (
                                    <Badge variant="secondary">{paciente.convenio}</Badge>
                                ) : (
                                    '-'
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge variant={paciente.status === 'ATIVO' ? 'default' : 'secondary'}>
                                    {paciente.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(paciente)}
                                        title="Editar paciente"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete(paciente.id)}
                                        className="text-destructive hover:text-destructive"
                                        title="Excluir paciente"
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