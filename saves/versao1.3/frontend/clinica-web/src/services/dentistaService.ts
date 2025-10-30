// services/dentistaService.ts
import api from '../lib/api';

export interface DentistaCreateDTO {
    nome: string;
    cro: string;
    especialidade?: string;
    telefone?: string;
    email?: string;
    ativo?: boolean;
}

export interface DentistaUpdateDTO {
    nome?: string;
    cro?: string;
    especialidade?: string;
    telefone?: string;
    email?: string;
    ativo?: boolean;
}

export interface DentistaResponseDTO {
    id: number;
    nome: string;
    cro: string;
    especialidade?: string;
    telefone?: string;
    email?: string;
    ativo: boolean;
}

export interface DentistaListDTO {
    id: number;
    nome: string;
    cro: string;
    especialidade?: string;
    telefone?: string;
    email?: string;
    ativo: boolean;
}

class DentistaService {
    async criar(dto: DentistaCreateDTO): Promise<DentistaResponseDTO> {
        const response = await api.post('/dentistas', dto);
        return response.data;
    }

    async listar(): Promise<DentistaListDTO[]> {
        const response = await api.get('/dentistas');
        return response.data;
    }

    async listarAtivos(): Promise<DentistaListDTO[]> {
        const response = await api.get('/dentistas/ativos');
        return response.data;
    }

    async buscarPorId(id: number): Promise<DentistaResponseDTO> {
        const response = await api.get(`/dentistas/${id}`);
        return response.data;
    }

    async buscarPorCro(cro: string): Promise<DentistaResponseDTO> {
        const response = await api.get(`/dentistas/cro/${cro}`);
        return response.data;
    }

    async buscarPorEmail(email: string): Promise<DentistaResponseDTO> {
        const response = await api.get(`/dentistas/email/${email}`);
        return response.data;
    }

    async listarPorEspecialidade(especialidade: string): Promise<DentistaListDTO[]> {
        const response = await api.get(`/dentistas/especialidade/${especialidade}`);
        return response.data;
    }

    async listarPorNome(nome: string): Promise<DentistaListDTO[]> {
        const response = await api.get(`/dentistas/nome/${nome}`);
        return response.data;
    }

    async atualizar(id: number, dto: DentistaUpdateDTO): Promise<DentistaResponseDTO> {
        const response = await api.put(`/dentistas/${id}`, dto);
        return response.data;
    }

    async deletar(id: number): Promise<void> {
        await api.delete(`/dentistas/${id}`);
    }

    async desativar(id: number): Promise<void> {
        await api.patch(`/dentistas/${id}/desativar`);
    }

    async verificarCroExistente(cro: string): Promise<boolean> {
        const response = await api.get(`/dentistas/exists/cro/${cro}`);
        return response.data;
    }

    async verificarEmailExistente(email: string): Promise<boolean> {
        const response = await api.get(`/dentistas/exists/email/${email}`);
        return response.data;
    }
}

export const dentistaService = new DentistaService();