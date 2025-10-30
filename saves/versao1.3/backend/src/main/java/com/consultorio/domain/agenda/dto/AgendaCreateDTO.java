// AgendaCreateDTO.java
package com.consultorio.domain.agenda.dto;

import com.consultorio.domain.agenda.Agenda;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record AgendaCreateDTO(
        @NotNull(message = "ID do paciente é obrigatório")
        Long pacienteId,

        @NotBlank(message = "Nome do paciente é obrigatório")
        String pacienteNome,

        @NotNull(message = "ID do dentista é obrigatório")
        Long dentistaId,

        @NotBlank(message = "Nome do dentista é obrigatório")
        String dentistaNome,

        @NotNull(message = "Data e hora são obrigatórias")
        LocalDateTime dataHora,

        Agenda.StatusAgendamento status,

        String observacoes,

        String telefone,

        @Email(message = "Email deve ser válido")
        String email
) {}