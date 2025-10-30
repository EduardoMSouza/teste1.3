// AgendaResponseDTO.java
package com.consultorio.domain.agenda.dto;

import com.consultorio.domain.agenda.Agenda;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record AgendaResponseDTO(
        Long id,
        Long pacienteId,
        String pacienteNome,
        Long dentistaId,
        String dentistaNome,

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        LocalDateTime dataHora,

        Agenda.StatusAgendamento status,
        String observacoes,
        String telefone,
        String email,

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        LocalDateTime dataCadastro
) {}