// AgendaStatusUpdateDTO.java
package com.consultorio.domain.agenda.dto;

import com.consultorio.domain.agenda.Agenda;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record AgendaStatusUpdateDTO(
        @NotNull(message = "Status é obrigatório")
        Agenda.StatusAgendamento status
) {}