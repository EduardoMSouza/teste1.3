// app/pacientes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePaciente } from '@/hooks/usePaciente';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import PacientesTable from './components/PacientesTable';
import DialogPaciente from './components/DialogPaciente';
import FiltrosPacientes from './components/FiltrosPacientes';

export default function PacientesPage() {
    const {
        pacientes,
        loading,
        error,
        criarPaciente,
        atualizarPaciente,
        deletarPaciente,
        listarPacientes
    } = usePaciente();

    const [showDialog, setShowDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [editingPaciente, setEditingPaciente] = useState<any>(null);

    // Carregar pacientes
    useEffect(() => {
        listarPacientes();
    }, [listarPacientes]);

    // Filtrar pacientes
    const filteredPacientes = pacientes.filter(paciente => {
        const matchesSearch = paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            paciente.cpf?.includes(searchTerm) ||
            paciente.email?.toLowerCase().includes(searchTerm.toLowerCase());

        if (statusFilter === 'all') return matchesSearch;
        return matchesSearch; // Todos estão ativos por padrão
    });

    // Abrir modal para novo paciente
    const handleNovoPaciente = () => {
        setEditingPaciente(null);
        setShowDialog(true);
    };

    // Abrir modal para edição
    const handleEdit = (paciente: any) => {
        setEditingPaciente(paciente);
        setShowDialog(true);
    };

    // Fechar modal
    const handleCloseDialog = () => {
        setShowDialog(false);
        setEditingPaciente(null);
    };

    // Callback quando o paciente é salvo com sucesso
    const handlePacienteSalvo = () => {
        listarPacientes();
        handleCloseDialog();
    };

    // Excluir paciente
    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este paciente?')) return;

        try {
            await deletarPaciente(id);
            listarPacientes();
        } catch (error) {
            console.error('Erro ao excluir paciente:', error);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
                    <p className="text-muted-foreground">
                        Gerencie os pacientes do consultório
                    </p>
                </div>
                <Button
                    onClick={handleNovoPaciente}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Novo Paciente
                </Button>
            </div>

            {/* Mensagem de erro */}
            {error && (
                <div className="bg-destructive/15 text-destructive p-4 rounded-md">
                    {error}
                </div>
            )}

            {/* Filtros e Busca */}
            <FiltrosPacientes
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
            />

            {/* Tabela de Pacientes */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Pacientes</CardTitle>
                    <CardDescription>
                        {filteredPacientes.length} paciente(s) encontrado(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PacientesTable
                        pacientes={filteredPacientes}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            {/* Modal de Cadastro/Edição */}
            <DialogPaciente
                open={showDialog}
                onOpenChange={handleCloseDialog}
                pacienteEdit={editingPaciente}
                onSuccess={handlePacienteSalvo}
                onCreate={criarPaciente}
                onUpdate={atualizarPaciente}
                loading={loading}
            />
        </div>
    );
}