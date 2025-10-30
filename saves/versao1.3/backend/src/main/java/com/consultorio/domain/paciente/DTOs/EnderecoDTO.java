package com.consultorio.domain.paciente.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record EnderecoDTO(

        @Size(max = 200, message = "Logradouro deve ter no máximo 200 caracteres")
        String logradouro,


        @Size(max = 10, message = "Número deve ter no máximo 10 caracteres")
        String numero,

        @Size(max = 100, message = "Complemento deve ter no máximo 100 caracteres")
        String complemento,


        @Size(max = 100, message = "Bairro deve ter no máximo 100 caracteres")
        String bairro,


        @Size(max = 100, message = "Cidade deve ter no máximo 100 caracteres")
        String cidade,


        @Size(min = 2, max = 2, message = "Estado deve ter 2 caracteres")
        String estado,

        @Pattern(regexp = "\\d{5}-\\d{3}", message = "CEP deve estar no formato 00000-000")
        @Size(min = 9, max = 9, message = "CEP deve ter 9 caracteres")
        String cep
) {}