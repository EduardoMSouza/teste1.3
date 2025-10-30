// AgendaRequestDTO.java
package com.consultorio.domain.agenda.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record AgendaRequestDTO(
        Long pacienteId,

        String pacienteNome,

        @NotNull(message = "ID do dentista é obrigatório")
        Long dentistaId,

        @NotNull(message = "Data e hora são obrigatórias")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        LocalDateTime dataHora,

        String observacoes,

        String telefone,

        @Email(message = "Email deve ser válido")
        String email
) {}