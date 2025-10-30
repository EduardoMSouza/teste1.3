package com.consultorio.domain.paciente.DTOs;

import com.consultorio.domain.paciente.Enums.StatusPaciente;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record StatusUpdateDTO(
        @NotNull(message = "Status é obrigatório")
        StatusPaciente status
) {}

