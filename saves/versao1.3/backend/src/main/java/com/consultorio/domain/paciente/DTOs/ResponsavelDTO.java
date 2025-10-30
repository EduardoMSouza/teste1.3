package com.consultorio.domain.paciente.DTOs;

import com.consultorio.domain.paciente.Enums.EstadoCivil;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record ResponsavelDTO(

        @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
        String nome,

        @Size(max = 20, message = "RG deve ter no máximo 20 caracteres")
        String rg,

        @Size(max = 50, message = "Órgão expedidor deve ter no máximo 50 caracteres")
        String orgaoExpedidor,

        @Pattern(regexp = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}", message = "CPF deve estar no formato 000.000.000-00")
        @Size(min = 14, max = 14, message = "CPF deve ter 14 caracteres")
        String cpf,

        EstadoCivil estadoCivil,

        @Size(max = 100, message = "Nome do cônjuge deve ter no máximo 100 caracteres")
        String nomeConjuge,

        @Pattern(regexp = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}", message = "CPF do cônjuge deve estar no formato 000.000.000-00")
        @Size(min = 14, max = 14, message = "CPF do cônjuge deve ter 14 caracteres")
        String cpfConjuge
) {}