package com.consultorio.domain.paciente.DTOs;


import lombok.Builder;

import java.util.List;

@Builder
public record PlanoTratamentoPacienteDTO(
        Long pacienteId,
        String pacienteNome,
        List<PlanoTratamentoResponseDTO> planosTratamento,
        Double valorTotalGeral
) {}