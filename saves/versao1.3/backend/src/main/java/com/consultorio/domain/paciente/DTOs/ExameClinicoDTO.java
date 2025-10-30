package com.consultorio.domain.paciente.DTOs;

import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record ExameClinicoDTO(
        @Size(max = 200, message = "Descrição da língua deve ter no máximo 200 caracteres")
        String lingua,

        @Size(max = 200, message = "Descrição da mucosa deve ter no máximo 200 caracteres")
        String mucosa,

        @Size(max = 200, message = "Descrição do palato deve ter no máximo 200 caracteres")
        String palato,

        @Size(max = 200, message = "Descrição dos lábios deve ter no máximo 200 caracteres")
        String labios,

        @Size(max = 200, message = "Descrição das gengivas deve ter no máximo 200 caracteres")
        String gengivas,

        @Size(max = 200, message = "Descrição da face deve ter no máximo 200 caracteres")
        String face,

        @Size(max = 200, message = "Descrição dos gânglios deve ter no máximo 200 caracteres")
        String ganglios,

        @Size(max = 200, message = "Descrição das glândulas salivares deve ter no máximo 200 caracteres")
        String glandulasSalivares,

        Boolean alteracaoOclusao,

        @Size(max = 500, message = "Detalhes da oclusão deve ter no máximo 500 caracteres")
        String detalhesOclusao,

        @Size(max = 1000, message = "Observações deve ter no máximo 1000 caracteres")
        String observacoes
) {}