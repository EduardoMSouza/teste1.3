package com.consultorio.domain.paciente.DTOs;

import com.consultorio.domain.paciente.Enums.Dente;
import com.consultorio.domain.paciente.Enums.StatusPlanoTratamento;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record PlanoTratamentoResponseDTO(
        Long id,
        Long pacienteId,
        String pacienteNome,
        Dente dente,
        String procedimento,
        Double valor,
        String observacao,
        Double valorTotal,
        StatusPlanoTratamento status,
        LocalDateTime dataInicio,
        LocalDateTime dataConclusao,
        LocalDateTime dataCancelamento,
        String motivoCancelamento,
        LocalDateTime dataCriacao,
        LocalDateTime dataAtualizacao
) {}