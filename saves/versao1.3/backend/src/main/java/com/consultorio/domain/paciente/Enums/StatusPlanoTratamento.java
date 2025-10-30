package com.consultorio.domain.paciente.Enums;


public enum StatusPlanoTratamento {
    /**
     * Plano ativo e em andamento
     */
    ATIVO("Ativo", "Plano em andamento"),

    /**
     * Plano concluído com sucesso
     */
    CONCLUIDO("Concluído", "Todos os procedimentos foram finalizados"),

    /**
     * Plano cancelado antes da conclusão
     */
    CANCELADO("Cancelado", "Plano cancelado antes da conclusão"),

    /**
     * Plano aguardando início do tratamento
     */
    AGUARDANDO_INICIO("Aguardando Início", "Aguardando início do tratamento"),

    /**
     * Plano em aprovação pelo convênio
     */
    EM_APROVACAO("Em Aprovação", "Aguardando aprovação do convênio"),

    /**
     * Plano suspenso temporariamente
     */
    SUSPENSO("Suspenso", "Plano suspenso temporariamente"),

    /**
     * Plano aguardando pagamento
     */
    AGUARDANDO_PAGAMENTO("Aguardando Pagamento", "Aguardando confirmação de pagamento"),

    /**
     * Plano em fase de orçamento
     */
    ORCAMENTO("Orçamento", "Em fase de orçamento e planejamento");

    private final String descricao;
    private final String detalhes;

    StatusPlanoTratamento(String descricao, String detalhes) {
        this.descricao = descricao;
        this.detalhes = detalhes;
    }

    // Métodos utilitários
    public boolean isAtivo() {
        return this == ATIVO;
    }

    public boolean isConcluido() {
        return this == CONCLUIDO;
    }

    public boolean isCancelado() {
        return this == CANCELADO;
    }

    public boolean isAguardandoInicio() {
        return this == AGUARDANDO_INICIO;
    }

    public boolean isEmAprovacao() {
        return this == EM_APROVACAO;
    }

    public boolean isSuspenso() {
        return this == SUSPENSO;
    }

    public boolean isAguardandoPagamento() {
        return this == AGUARDANDO_PAGAMENTO;
    }

    public boolean isOrcamento() {
        return this == ORCAMENTO;
    }

    public boolean podeSerEditado() {
        return this == ATIVO ||
                this == AGUARDANDO_INICIO ||
                this == EM_APROVACAO ||
                this == ORCAMENTO;
    }

    public boolean podeSerConcluido() {
        return this == ATIVO;
    }

    public boolean podeSerCancelado() {
        return this != CONCLUIDO && this != CANCELADO;
    }

    /**
     * Retorna os status considerados "ativos" para relatórios
     */
    public static StatusPlanoTratamento[] getStatusAtivos() {
        return new StatusPlanoTratamento[]{
                ATIVO,
                AGUARDANDO_INICIO,
                EM_APROVACAO,
                AGUARDANDO_PAGAMENTO
        };
    }

    /**
     * Retorna os status considerados "finalizados" para relatórios
     */
    public static StatusPlanoTratamento[] getStatusFinalizados() {
        return new StatusPlanoTratamento[]{CONCLUIDO, CANCELADO};
    }

    /**
     * Retorna os status que permitem edição
     */
    public static StatusPlanoTratamento[] getStatusEditaveis() {
        return new StatusPlanoTratamento[]{
                ATIVO,
                AGUARDANDO_INICIO,
                EM_APROVACAO,
                ORCAMENTO
        };
    }
}