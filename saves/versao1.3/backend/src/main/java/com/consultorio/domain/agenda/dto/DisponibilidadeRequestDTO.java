// DisponibilidadeRequestDTO.java
package com.consultorio.domain.agenda.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalTime;

@Builder
public record DisponibilidadeRequestDTO(
        @NotNull(message = "ID do dentista é obrigatório")
        Long dentistaId,

        @NotNull(message = "Data é obrigatória")
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate data,

        @NotNull(message = "Hora inicial é obrigatória")
        @JsonFormat(pattern = "HH:mm")
        LocalTime horaInicio,

        @NotNull(message = "Hora final é obrigatória")
        @JsonFormat(pattern = "HH:mm")
        LocalTime horaFim
) {}