// DentistaCreateDTO.java
package com.consultorio.domain.dentista.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record DentistaCreateDTO(
        @NotBlank(message = "Nome é obrigatório")
        String nome,

        @NotBlank(message = "CRO é obrigatório")
        String cro,

        String especialidade,

        String telefone,

        @Email(message = "Email deve ser válido")
        String email,

        Boolean ativo
) {}