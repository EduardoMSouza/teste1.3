export interface PlanoTratamento {
    id: number;
    pacienteId: number;
    descricao: string;
    procedimentos: string[];
    valorTotal: number;
    valorEntrada?: number;
    numeroParcelas?: number;
    dataInicio: string;
    dataTermino?: string;
    status: 'ATIVO' | 'CONCLUIDO' | 'CANCELADO' | 'SUSPENSO';
    observacoes?: string;
    dataCriacao: string;
    dataAtualizacao: string;
}

export interface PlanoTratamentoCreateDTO {
    descricao: string;
    procedimentos: string[];
    valorTotal: number;
    valorEntrada?: number;
    numeroParcelas?: number;
    dataInicio: string;
    dataTermino?: string;
    observacoes?: string;
}

export interface PlanoTratamentoUpdateDTO extends Partial<PlanoTratamentoCreateDTO> {}

export interface PlanoTratamentoResponseDTO extends PlanoTratamento {}

export interface StatusPlanoTratamentoDTO {
    status: 'ATIVO' | 'CONCLUIDO' | 'CANCELADO' | 'SUSPENSO';
}