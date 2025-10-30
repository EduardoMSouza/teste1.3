package com.consultorio.domain.paciente.DTOs;

import com.consultorio.domain.paciente.Enums.StatusPlanoTratamento;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record StatusPlanoTratamentoDTO(
        @NotNull(message = "Status é obrigatório")
        StatusPlanoTratamento status,

        String motivoCancelamento
) {}
