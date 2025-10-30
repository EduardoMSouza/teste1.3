// hooks/useDentista.ts
import { useState, useCallback } from 'react';
import { dentistaService, DentistaCreateDTO, DentistaUpdateDTO, DentistaResponseDTO, DentistaListDTO } from '@/services/dentistaService';

export const useDentista = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const criarDentista = useCallback(async (dto: DentistaCreateDTO): Promise<DentistaResponseDTO> => {
        setLoading(true);
        setError(null);
        try {
            const response = await dentistaService.criar(dto);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao criar dentista';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const listarDentistas = useCallback(async (): Promise<DentistaListDTO[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await dentistaService.listar();
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao carregar dentistas';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const listarDentistasAtivos = useCallback(async (): Promise<DentistaListDTO[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await dentistaService.listarAtivos();
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao carregar dentistas ativos';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const buscarDentistaPorId = useCallback(async (id: number): Promise<DentistaResponseDTO> => {
        setLoading(true);
        setError(null);
        try {
            const response = await dentistaService.buscarPorId(id);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao buscar dentista';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const atualizarDentista = useCallback(async (id: number, dto: DentistaUpdateDTO): Promise<DentistaResponseDTO> => {
        setLoading(true);
        setError(null);
        try {
            const response = await dentistaService.atualizar(id, dto);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao atualizar dentista';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const deletarDentista = useCallback(async (id: number): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await dentistaService.deletar(id);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao excluir dentista';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const desativarDentista = useCallback(async (id: number): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await dentistaService.desativar(id);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao desativar dentista';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const verificarCroExistente = useCallback(async (cro: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await dentistaService.verificarCroExistente(cro);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao verificar CRO';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const verificarEmailExistente = useCallback(async (email: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await dentistaService.verificarEmailExistente(email);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao verificar email';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        criarDentista,
        listarDentistas,
        listarDentistasAtivos,
        buscarDentistaPorId,
        atualizarDentista,
        deletarDentista,
        desativarDentista,
        verificarCroExistente,
        verificarEmailExistente,
    };
};