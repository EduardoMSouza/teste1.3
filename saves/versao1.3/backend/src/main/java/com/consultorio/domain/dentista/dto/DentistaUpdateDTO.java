// DentistaUpdateDTO.java
package com.consultorio.domain.dentista.dto;

import jakarta.validation.constraints.Email;
import lombok.Builder;

@Builder
public record DentistaUpdateDTO(
        String nome,
        String cro,
        String especialidade,
        String telefone,

        @Email(message = "Email deve ser válido")
        String email,

        Boolean ativo
) {}