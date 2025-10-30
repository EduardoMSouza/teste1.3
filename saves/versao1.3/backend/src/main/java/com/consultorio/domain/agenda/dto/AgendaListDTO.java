// AgendaListDTO.java
package com.consultorio.domain.agenda.dto;

import com.consultorio.domain.agenda.Agenda;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record AgendaListDTO(
        Long id,
        String pacienteNome,
        String dentistaNome,
        LocalDateTime dataHora,
        Agenda.StatusAgendamento status,
        String telefone
) {}