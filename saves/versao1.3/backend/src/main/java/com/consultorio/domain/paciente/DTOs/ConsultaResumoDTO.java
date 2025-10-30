package com.consultorio.domain.paciente.DTOs;

import java.time.LocalDateTime;

// DTO auxiliar para resumo de consultas
record ConsultaResumoDTO(
        Long id,
        LocalDateTime dataHora,
        String dentistaNome,
        String procedimento,
        String status
) {}
