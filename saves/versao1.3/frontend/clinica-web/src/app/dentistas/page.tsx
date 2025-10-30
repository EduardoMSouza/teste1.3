// app/dentistas/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { dentistaService } from '@/services/dentistaService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';
import DentistasTable from './components/DentistaTable';
import DialogDentista from './components/DialogDentista';

interface Dentista {
    id: number;
    nome: string;
    cro: string;
    especialidade?: string;
    telefone?: string;
    email?: string;
    ativo: boolean;
}

export default function DentistasPage() {
    const [dentistas, setDentistas] = useState<Dentista[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [editingDentista, setEditingDentista] = useState<Dentista | null>(null);

    // Carregar dentistas
    useEffect(() => {
        carregarDentistas();
    }, []);

    const carregarDentistas = async () => {
        try {
            setLoading(true);
            setError(null);
            const dados = await dentistaService.listar();
            setDentistas(dados);
        } catch (error: any) {
            setError(error.message || 'Erro ao carregar dentistas');
        } finally {
            setLoading(false);
        }
    };

    // Filtrar dentistas
    const filteredDentistas = dentistas.filter(dentista => {
        const matchesSearch = dentista.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dentista.cro.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dentista.especialidade?.toLowerCase().includes(searchTerm.toLowerCase());

        if (statusFilter === 'all') return matchesSearch;
        if (statusFilter === 'active') return matchesSearch && dentista.ativo;
        return matchesSearch && !dentista.ativo;
    });

    // Abrir modal para novo dentista
    const handleNovoDentista = () => {
        setEditingDentista(null);
        setShowDialog(true);
    };

    // Abrir modal para edição
    const handleEdit = (dentista: Dentista) => {
        setEditingDentista(dentista);
        setShowDialog(true);
    };

    // Fechar modal
    const handleCloseDialog = () => {
        setShowDialog(false);
        setEditingDentista(null);
    };

    // Callback quando o dentista é salvo com sucesso
    const handleDentistaSalvo = () => {
        carregarDentistas();
        handleCloseDialog();
    };

    // Excluir dentista
    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este dentista?')) return;

        try {
            setLoading(true);
            await dentistaService.deletar(id);
            await carregarDentistas();
        } catch (error: any) {
            setError(error.message || 'Erro ao excluir dentista');
        } finally {
            setLoading(false);
        }
    };

    // Alternar status do dentista
    const handleToggleStatus = async (id: number, ativo: boolean) => {
        try {
            setLoading(true);
            if (ativo) {
                await dentistaService.desativar(id);
            } else {
                await dentistaService.atualizar(id, { ativo: true });
            }
            await carregarDentistas();
        } catch (error: any) {
            setError(error.message || 'Erro ao alterar status do dentista');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dentistas</h1>
                    <p className="text-muted-foreground">
                        Gerencie os dentistas do consultório
                    </p>
                </div>
                <Button
                    onClick={handleNovoDentista}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Novo Dentista
                </Button>
            </div>

            {/* Mensagem de erro */}
            {error && (
                <div className="bg-destructive/15 text-destructive p-4 rounded-md">
                    {error}
                </div>
            )}

            {/* Filtros e Busca */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome, CRO ou especialidade..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filtrar por status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="active">Ativos</SelectItem>
                                <SelectItem value="inactive">Inativos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Tabela de Dentistas */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Dentistas</CardTitle>
                    <CardDescription>
                        {filteredDentistas.length} dentista(s) encontrado(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DentistasTable
                        dentistas={filteredDentistas}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleStatus={handleToggleStatus}
                    />
                </CardContent>
            </Card>

            {/* Modal de Cadastro/Edição */}
            <DialogDentista
                open={showDialog}
                onOpenChange={handleCloseDialog}
                dentistaEdit={editingDentista}
                onSuccess={handleDentistaSalvo}
            />
        </div>
    );
}