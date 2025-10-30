import { useState, useCallback } from 'react';
import { pacienteService } from '@/services/pacienteService';
import { PacienteListDTO, PacienteResponseDTO, PacienteCreateDTO, PacienteUpdateDTO } from '@/types/paciente';

export const usePaciente = () => {
    const [pacientes, setPacientes] = useState<PacienteListDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const listarPacientes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await pacienteService.listarTodos();
            setPacientes(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao carregar pacientes');
            console.error('Erro ao carregar pacientes:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const criarPaciente = async (data: PacienteCreateDTO): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await pacienteService.criar(data);
            await listarPacientes();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao criar paciente';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const atualizarPaciente = async (id: number, data: PacienteUpdateDTO): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await pacienteService.atualizar(id, data);
            await listarPacientes();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao atualizar paciente';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const deletarPaciente = async (id: number): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await pacienteService.excluir(id);
            await listarPacientes();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao excluir paciente';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        pacientes,
        loading,
        error,
        criarPaciente,
        atualizarPaciente,
        deletarPaciente,
        listarPacientes,
    };
};