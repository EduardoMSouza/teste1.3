// services/agendaService.ts
import api from '../lib/api';

export interface AgendaCreateDTO {
    pacienteId: number;
    pacienteNome: string;
    dentistaId: number;
    dentistaNome: string;
    dataHora: string; // ISO string
    status?: 'AGENDADO' | 'CONFIRMADO' | 'CONCLUIDO' | 'CANCELADO';
    observacoes?: string;
    telefone?: string;
    email?: string;
}

export interface AgendaUpdateDTO {
    pacienteId: number;
    dentistaId: number;
    dataHora: string; // ISO string
    observacoes?: string;
    telefone?: string;
    email?: string;
}

export interface AgendaStatusUpdateDTO {
    status: 'AGENDADO' | 'CONFIRMADO' | 'CONCLUIDO' | 'CANCELADO';
}

export interface AgendaResponseDTO {
    id: number;
    pacienteId: number;
    pacienteNome: string;
    dentistaId: number;
    dentistaNome: string;
    dataHora: string;
    status: 'AGENDADO' | 'CONFIRMADO' | 'CONCLUIDO' | 'CANCELADO';
    observacoes?: string;
    telefone?: string;
    email?: string;
    dataCadastro: string;
}

export interface AgendaListDTO {
    id: number;
    pacienteNome: string;
    dentistaNome: string;
    dataHora: string;
    status: 'AGENDADO' | 'CONFIRMADO' | 'CONCLUIDO' | 'CANCELADO';
    telefone?: string;
}

export interface ProximoHorarioResponseDTO {
    dataHora: string;
    dentistaNome: string;
    pacienteNome: string;
}

export interface DisponibilidadeRequestDTO {
    dentistaId: number;
    data: string; // yyyy-MM-dd
    horaInicio: string; // HH:mm
    horaFim: string; // HH:mm
}

// Interfaces para compatibilidade com componentes
export interface Agenda {
    id: number;
    pacienteId?: number;
    pacienteNome: string;
    dentistaId: number;
    dentistaNome: string;
    dataHora: string;
    status: 'AGENDADO' | 'CONFIRMADO' | 'CONCLUIDO' | 'CANCELADO';
    observacoes?: string;
    telefone?: string;
    email?: string;
    dataCadastro?: string;
}

export interface AgendaRequest {
    pacienteId?: number;
    pacienteNome?: string;
    dentistaId: number;
    dataHora: string;
    observacoes?: string;
    telefone?: string;
    email?: string;
}

export interface Paciente {
    id: number;
    nome: string;
    telefone?: string;
    email?: string;
}

export interface Dentista {
    id: number;
    nome: string;
    especialidade: string;
    email?: string;
    telefone?: string;
}

class AgendaService {
    // Métodos originais do backend
    async criar(dto: AgendaCreateDTO): Promise<AgendaResponseDTO> {
        const response = await api.post('/agendamentos', dto);
        return response.data;
    }

    async listar(): Promise<AgendaListDTO[]> {
        const response = await api.get('/agendamentos');
        return response.data;
    }

    async listarPorDentista(dentistaId: number): Promise<AgendaListDTO[]> {
        const response = await api.get(`/agendamentos/dentista/${dentistaId}`);
        return response.data;
    }

    async listarPorPaciente(pacienteId: number): Promise<AgendaListDTO[]> {
        const response = await api.get(`/agendamentos/paciente/${pacienteId}`);
        return response.data;
    }

    async listarPorStatus(status: string): Promise<AgendaListDTO[]> {
        const response = await api.get(`/agendamentos/status/${status}`);
        return response.data;
    }

    async buscarPorId(id: number): Promise<AgendaResponseDTO> {
        const response = await api.get(`/agendamentos/${id}`);
        return response.data;
    }

    async atualizar(id: number, dto: AgendaUpdateDTO): Promise<AgendaResponseDTO> {
        const response = await api.put(`/agendamentos/${id}`, dto);
        return response.data;
    }

    async atualizarStatus(id: number, dto: AgendaStatusUpdateDTO): Promise<AgendaResponseDTO> {
        const response = await api.patch(`/agendamentos/${id}/status`, dto);
        return response.data;
    }

    async deletar(id: number): Promise<void> {
        await api.delete(`/agendamentos/${id}`);
    }

    async desativar(id: number): Promise<void> {
        await api.patch(`/agendamentos/${id}/desativar`);
    }

    async verificarDisponibilidade(dto: DisponibilidadeRequestDTO): Promise<string[]> {
        try {
            const response = await api.post('/agendamentos/disponibilidade', dto);
            return response.data;
        } catch (error: any) {
            console.error('Erro ao verificar disponibilidade:', error);
            // Retorna horários padrão em caso de erro
            return ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
        }
    }

    async buscarProximoHorario(dentistaId: number): Promise<ProximoHorarioResponseDTO | null> {
        try {
            const response = await api.get(`/agendamentos/dentista/${dentistaId}/proximo-horario`);
            return response.data;
        } catch (error) {
            return null;
        }
    }

    // Métodos compatíveis com os componentes - CORRIGIDOS
    async getAgendamentos(): Promise<Agenda[]> {
        const response = await api.get('/agendamentos');
        return response.data;
    }

    async createAgendamento(dto: AgendaRequest): Promise<Agenda> {
        // CORREÇÃO: Converte para o formato exato do Java DTO
        const backendDto: AgendaCreateDTO = {
            pacienteId: dto.pacienteId || 0, // Obrigatório no Java
            pacienteNome: dto.pacienteNome || 'Paciente Não Cadastrado', // Obrigatório no Java
            dentistaId: dto.dentistaId,
            dentistaNome: 'Dentista', // Obrigatório no Java - será preenchido pelo backend
            dataHora: this.formatDateTimeForBackend(dto.dataHora), // Converte para formato correto
            status: 'AGENDADO',
            observacoes: dto.observacoes,
            telefone: dto.telefone,
            email: dto.email
        };

        console.log('Enviando agendamento:', backendDto);
        const response = await api.post('/agendamentos', backendDto);
        return response.data;
    }

    async updateAgendamento(id: number, dto: AgendaRequest): Promise<Agenda> {
        // CORREÇÃO: Usa AgendaUpdateDTO do Java que tem campos diferentes
        const backendDto: AgendaUpdateDTO = {
            pacienteId: dto.pacienteId || 0, // Obrigatório no Java
            dentistaId: dto.dentistaId,
            dataHora: this.formatDateTimeForBackend(dto.dataHora), // Converte para formato correto
            observacoes: dto.observacoes,
            telefone: dto.telefone,
            email: dto.email
        };

        console.log('Atualizando agendamento:', backendDto);
        const response = await api.put(`/agendamentos/${id}`, backendDto);
        return response.data;
    }

    async updateStatus(id: number, status: string): Promise<Agenda> {
        // CORREÇÃO: Usa StatusUpdateDTO do Java que tem campo "status"
        const dto = { status };

        console.log('Atualizando status:', dto);
        const response = await api.patch(`/agendamentos/${id}/status`, dto);
        return response.data;
    }

    async deleteAgendamento(id: number): Promise<void> {
        await api.delete(`/agendamentos/${id}`);
    }

    async getPacientes(search?: string): Promise<Paciente[]> {
        const params = search ? { search } : {};
        const response = await api.get('/pacientes', { params });
        return response.data;
    }

    async getProximoHorarioDisponivel(dentistaId: number): Promise<string> {
        try {
            const response = await this.buscarProximoHorario(dentistaId);
            return response?.dataHora || this.getFallbackDate();
        } catch (error) {
            return this.getFallbackDate();
        }
    }

    async verificarDisponibilidadeHorario(dentistaId: number, dataHora: string, agendamentoId?: number): Promise<boolean> {
        try {
            // CORREÇÃO: Formata corretamente para o Java DTO
            const dataObj = new Date(dataHora);
            const dto: DisponibilidadeRequestDTO = {
                dentistaId,
                data: dataObj.toISOString().split('T')[0], // yyyy-MM-dd
                horaInicio: '08:00', // HH:mm
                horaFim: '17:00'    // HH:mm
            };

            console.log('Verificando disponibilidade:', dto);
            const horariosDisponiveis = await this.verificarDisponibilidade(dto);
            const horaSelecionada = dataObj.toTimeString().slice(0, 5); // HH:MM

            const disponivel = horariosDisponiveis.includes(horaSelecionada);
            console.log(`Horário ${horaSelecionada} disponível: ${disponivel}`);

            return disponivel;
        } catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
            return true; // Assume disponível em caso de erro
        }
    }

    async getDentistas(): Promise<Dentista[]> {
        try {
            const response = await api.get('/dentistas');
            return response.data;
        } catch (error) {
            console.error('Erro ao carregar dentistas:', error);
            return [];
        }
    }

    // Método auxiliar para converter data para formato do backend
    private formatDateTimeForBackend(dateTimeString: string): string {
        if (!dateTimeString) return '';

        const date = new Date(dateTimeString);
        // Formato: yyyy-MM-ddTHH:mm (compatível com LocalDateTime do Java)
        return date.toISOString().slice(0, 16);
    }

    // Método auxiliar para fallback date
    private getFallbackDate(): string {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 1);
        nextDate.setHours(8, 0, 0, 0);
        return this.formatDateTimeForBackend(nextDate.toISOString());
    }
}

export const agendaService = new AgendaService();