package com.consultorio.domain.paciente.DTOs;

import com.consultorio.domain.paciente.Enums.Dente;

import com.consultorio.domain.paciente.Enums.StatusPlanoTratamento;
import lombok.Builder;

@Builder
public record PlanoTratamentoListDTO(
        Long id,
        Long pacienteId,
        String pacienteNome,
        Dente dente,
        String procedimento,
        Double valor,
        Double valorTotal,
        String observacao,
        StatusPlanoTratamento status
) {}

