package com.consultorio.domain.paciente.DTOs;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record PacienteHistoricoDTO(
        PacienteResponseDTO dadosPessoais,
        AnamneseDTO anamnese,
        List<PlanoTratamentoResponseDTO> planosTratamento,
        List<ConsultaResumoDTO> ultimasConsultas,
        LocalDateTime dataCadastro,
        LocalDateTime dataUltimaAtualizacao
) {}


