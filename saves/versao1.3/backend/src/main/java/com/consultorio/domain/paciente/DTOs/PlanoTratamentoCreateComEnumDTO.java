package com.consultorio.domain.paciente.DTOs;

import com.consultorio.domain.paciente.Enums.Dente;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

@Builder
public record PlanoTratamentoCreateComEnumDTO(
        @NotNull(message = "ID do paciente é obrigatório")
        Long pacienteId,

        @NotNull(message = "Dente é obrigatório")
        Dente dente,

        @NotBlank(message = "Procedimento é obrigatório")
        String procedimento,


        @Positive(message = "Valor deve ser maior que zero")
        Double valor,

        String observacao,


        @Positive(message = "Valor total deve ser maior que zero")
        Double valorTotal
) {}
