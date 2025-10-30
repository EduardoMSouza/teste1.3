package com.consultorio.domain.paciente.DTOs;

import lombok.Builder;

@Builder
public record PlanoTratamentoResumoDTO(
        Long totalPlanos,
        Long planosAtivos,
        Long planosConcluidos,
        Double valorTotalAtivos,
        Double valorTotalConcluidos,
        String procedimentoMaisComum
) {}