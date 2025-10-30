import axios from "axios";

const API_URL = "http://localhost:8080/pacientes";

// 🔹 Tipos (ajuste conforme seus DTOs reais)
export interface PacienteRequest {
    nome: string;
    cpf: string;
    rg?: string;
    email?: string;
    dataNascimento?: string;
    sexo?: string;
    telefone?: string;
    celular?: string;
    endereco?: string;
    [key: string]: any;
}

export interface PacienteResponse {
    id: number;
    nome: string;
    cpf: string;
    email: string;
    dataNascimento?: string;
    celular?: string;
    endereco?: string;
    [key: string]: any;
}

// 🔹 CRUD BÁSICO
export const createPaciente = async (data: PacienteRequest): Promise<PacienteResponse> => {
    const response = await axios.post(API_URL, data);
    return response.data;
};

export const getAllPacientes = async (): Promise<PacienteResponse[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getPacienteById = async (id: number): Promise<PacienteResponse> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const updatePaciente = async (id: number, data: PacienteRequest): Promise<PacienteResponse> => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
};

export const deletePaciente = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};

// 🔹 BUSCAS PERSONALIZADAS
export const searchPacienteByNome = async (nome: string): Promise<PacienteResponse[]> => {
    const response = await axios.get(`${API_URL}/buscar/nome`, { params: { nome } });
    return response.data;
};

export const searchPacienteByCpf = async (cpf: string): Promise<PacienteResponse[]> => {
    const response = await axios.get(`${API_URL}/buscar/cpf`, { params: { cpf } });
    return response.data;
};

export const searchPacienteByRg = async (rg: string): Promise<PacienteResponse[]> => {
    const response = await axios.get(`${API_URL}/buscar/rg`, { params: { rg } });
    return response.data;
};

export const searchPacienteByEmail = async (email: string): Promise<PacienteResponse[]> => {
    const response = await axios.get(`${API_URL}/buscar/email`, { params: { email } });
    return response.data;
};

export const searchPacienteByDataNascimento = async (data: string): Promise<PacienteResponse[]> => {
    const response = await axios.get(`${API_URL}/buscar/data-nascimento`, { params: { data } });
    return response.data;
};

// 🔹 BUSCA GENÉRICA (/search?query=...)
export const searchPacientes = async (query: string): Promise<PacienteResponse[]> => {
    const response = await axios.get(`${API_URL}/search`, { params: { query } });
    return response.data;
};
