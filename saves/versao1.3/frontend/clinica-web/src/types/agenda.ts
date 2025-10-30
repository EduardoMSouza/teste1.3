export interface Dentista {
    id: number;
    nome: string;
    especialidade: string;
    email?: string;
    telefone?: string;
}

export interface Paciente {
    id: number;
    nome: string;
    telefone?: string;
    email?: string;
}