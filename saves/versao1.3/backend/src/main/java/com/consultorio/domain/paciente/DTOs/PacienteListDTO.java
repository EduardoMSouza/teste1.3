package com.consultorio.domain.paciente.DTOs;

import com.consultorio.domain.paciente.Enums.StatusPaciente;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
public record PacienteListDTO(
        Long id,
        String nome,
        String telefone,
        String email,
        LocalDate dataNascimento,
        StatusPaciente status
) {}