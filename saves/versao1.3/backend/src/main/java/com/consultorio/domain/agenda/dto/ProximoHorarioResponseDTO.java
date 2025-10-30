// ProximoHorarioResponseDTO.java
package com.consultorio.domain.agenda.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ProximoHorarioResponseDTO(
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        LocalDateTime dataHora,
        String dentistaNome,
        String pacienteNome
) {}