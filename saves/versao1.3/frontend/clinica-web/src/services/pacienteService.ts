import api from "@/lib/api";
import {
    Paciente,
    PacienteCreateDTO,
    PacienteUpdateDTO,
    PacienteResponseDTO,
    PacienteListDTO,
    StatusUpdateDTO
} from '@/types/paciente';


export const pacienteService = {
    // Operações básicas
    criar: async (data: PacienteCreateDTO): Promise<PacienteResponseDTO> => {
        const response = await api.post('/pacientes', data);
        return response.data;
    },

    listarTodos: async (): Promise<PacienteListDTO[]> => {
        const response = await api.get('/pacientes');
        return response.data;
    },

    buscarPorId: async (id: number): Promise<PacienteResponseDTO> => {
        const response = await api.get(`/pacientes/${id}`);
        return response.data;
    },

    buscarPorNome: async (nome: string): Promise<PacienteListDTO[]> => {
        const response = await api.get('/pacientes/buscar', { params: { nome } });
        return response.data;
    },

    atualizar: async (id: number, data: PacienteUpdateDTO): Promise<PacienteResponseDTO> => {
        const response = await api.put(`/pacientes/${id}`, data);
        return response.data;
    },

    atualizarStatus: async (id: number, data: StatusUpdateDTO): Promise<PacienteResponseDTO> => {
        const response = await api.patch(`/pacientes/${id}/status`, data);
        return response.data;
    },

    excluir: async (id: number): Promise<void> => {
        await api.delete(`/pacientes/${id}`);
    },

    // Endpoints adicionais
    listarAtivos: async (): Promise<PacienteListDTO[]> => {
        const response = await api.get('/pacientes/ativos');
        return response.data;
    },
};