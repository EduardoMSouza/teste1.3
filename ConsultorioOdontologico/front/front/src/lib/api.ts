import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const createProfessional = async (data: any) => {
    try {
        const response = await api.post('/profissionais', data);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar profissional:', error);
        throw error;
    }
};

export const getProfessionals = async () => {
    try {
        const response = await api.get('/profissionais');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar profissionais:', error);
        throw error;
    }
};

export const getProfessionalById = async (id: string) => {
    try {
        const response = await api.get(`/profissionais/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar profissional:', error);
        throw error;
    }
};

export const deleteProfessional = async (id: string) => {
    try {
        await api.delete(`/profissionais/${id}`);
    } catch (error) {
        console.error('Erro ao excluir profissional:', error);
        throw error;
    }
};

export const getPacientes = async () => {
    try {
        const response = await api.get('/pacientes');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
        throw error;
    }
};

export default api;