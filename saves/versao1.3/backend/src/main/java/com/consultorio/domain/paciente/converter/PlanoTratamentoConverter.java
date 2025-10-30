package com.consultorio.domain.paciente.converter;

import com.consultorio.domain.paciente.DTOs.*;
import com.consultorio.domain.paciente.entity.Paciente;
import com.consultorio.domain.paciente.entity.PlanoTratamento;
import com.consultorio.domain.paciente.Enums.StatusPlanoTratamento;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PlanoTratamentoConverter {

    // ========== CREATE ==========

    public PlanoTratamento fromCreate(PlanoTratamentoCreateDTO dto, Paciente paciente) {
        if (dto == null) return null;

        return PlanoTratamento.builder()
                .paciente(paciente)
                .dente(dto.dente())
                .procedimento(dto.procedimento())
                .valor(dto.valor())
                .observacao(dto.observacao())
                .valorTotal(dto.valorTotal())
                .status(StatusPlanoTratamento.ORCAMENTO)
                .build();
    }

    // ========== UPDATE ==========

    public void updateFromDTO(PlanoTratamento entity, PlanoTratamentoUpdateDTO dto) {
        if (dto == null || entity == null) return;

        if (dto.dente() != null) {
            entity.setDente(dto.dente());
        }
        if (dto.procedimento() != null) {
            entity.setProcedimento(dto.procedimento());
        }
        if (dto.valor() != null) {
            entity.setValor(dto.valor());
        }
        if (dto.observacao() != null) {
            entity.setObservacao(dto.observacao());
        }
        if (dto.valorTotal() != null) {
            entity.setValorTotal(dto.valorTotal());
        }
    }

    // ========== RESPONSE ==========

    public PlanoTratamentoResponseDTO toResponseDTO(PlanoTratamento entity) {
        if (entity == null) return null;

        return PlanoTratamentoResponseDTO.builder()
                .id(entity.getId())
                .pacienteId(entity.getPaciente() != null ? entity.getPaciente().getId() : null)
                .pacienteNome(entity.getPaciente() != null ? entity.getPaciente().getNome() : null)
                .dente(entity.getDente())
                .procedimento(entity.getProcedimento())
                .valor(entity.getValor())
                .observacao(entity.getObservacao())
                .valorTotal(entity.getValorTotal())
                .status(entity.getStatus())
                .dataInicio(entity.getDataInicio())
                .dataConclusao(entity.getDataConclusao())
                .dataCancelamento(entity.getDataCancelamento())
                .motivoCancelamento(entity.getMotivoCancelamento())
                .dataCriacao(entity.getDataCriacao())
                .dataAtualizacao(entity.getDataAtualizacao())
                .build();
    }

    // ========== LIST ==========

    public PlanoTratamentoListDTO toListDTO(PlanoTratamento entity) {
        if (entity == null) return null;

        return PlanoTratamentoListDTO.builder()
                .id(entity.getId())
                .pacienteId(entity.getPaciente() != null ? entity.getPaciente().getId() : null)
                .pacienteNome(entity.getPaciente() != null ? entity.getPaciente().getNome() : null)
                .dente(entity.getDente())
                .procedimento(entity.getProcedimento())
                .valor(entity.getValor())
                .valorTotal(entity.getValorTotal())
                .observacao(entity.getObservacao())
                .status(entity.getStatus())
                .build();
    }

    // ========== BULK OPERATIONS ==========

    public PlanoTratamentoPacienteDTO toPlanoTratamentoPacienteDTO(Paciente paciente, java.util.List<PlanoTratamento> planos) {
        if (paciente == null) return null;

        Double valorTotalGeral = planos.stream()
                .mapToDouble(PlanoTratamento::getValorTotal)
                .sum();

        java.util.List<PlanoTratamentoResponseDTO> planosDTO = planos.stream()
                .map(this::toResponseDTO)
                .toList();

        return PlanoTratamentoPacienteDTO.builder()
                .pacienteId(paciente.getId())
                .pacienteNome(paciente.getNome())
                .planosTratamento(planosDTO)
                .valorTotalGeral(valorTotalGeral)
                .build();
    }

    // ========== STATUS UPDATE ==========

    public void updateStatusFromDTO(PlanoTratamento entity, StatusPlanoTratamentoDTO dto) {
        if (entity == null || dto == null) return;

        entity.setStatus(dto.status());

        // Atualiza datas conforme o status
        if (dto.status() == StatusPlanoTratamento.ATIVO && entity.getDataInicio() == null) {
            entity.setDataInicio(java.time.LocalDateTime.now());
        } else if (dto.status() == StatusPlanoTratamento.CONCLUIDO) {
            entity.setDataConclusao(java.time.LocalDateTime.now());
        } else if (dto.status() == StatusPlanoTratamento.CANCELADO) {
            entity.setDataCancelamento(java.time.LocalDateTime.now());
            entity.setMotivoCancelamento(dto.motivoCancelamento());
        }
    }

    // ========== PARTIAL UPDATES ==========

    public void applyPartialUpdate(PlanoTratamento entity, PlanoTratamentoUpdateDTO dto) {
        if (entity == null || dto == null) return;

        if (dto.dente() != null) {
            entity.setDente(dto.dente());
        }
        if (dto.procedimento() != null) {
            entity.setProcedimento(dto.procedimento());
        }
        if (dto.valor() != null) {
            entity.setValor(dto.valor());
        }
        if (dto.observacao() != null) {
            entity.setObservacao(dto.observacao());
        }
        if (dto.valorTotal() != null) {
            entity.setValorTotal(dto.valorTotal());
        }
    }

    // ========== VALIDATION ==========

    public void validateCreateDTO(PlanoTratamentoCreateDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("DTO de criação não pode ser nulo");
        }
        if (dto.dente() == null) {
            throw new IllegalArgumentException("Dente é obrigatório");
        }
        if (dto.procedimento() == null || dto.procedimento().trim().isEmpty()) {
            throw new IllegalArgumentException("Procedimento é obrigatório");
        }
        if (dto.valor() == null || dto.valor() <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero");
        }
        if (dto.valorTotal() == null || dto.valorTotal() <= 0) {
            throw new IllegalArgumentException("Valor total deve ser maior que zero");
        }
    }

    public void validateUpdateDTO(PlanoTratamentoUpdateDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("DTO de atualização não pode ser nulo");
        }
        if (dto.dente() == null) {
            throw new IllegalArgumentException("Dente é obrigatório");
        }
        if (dto.procedimento() == null || dto.procedimento().trim().isEmpty()) {
            throw new IllegalArgumentException("Procedimento é obrigatório");
        }
        if (dto.valor() == null || dto.valor() <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero");
        }
        if (dto.valorTotal() == null || dto.valorTotal() <= 0) {
            throw new IllegalArgumentException("Valor total deve ser maior que zero");
        }
    }

    // ========== SUMMARY ==========

    public PlanoTratamentoResumoDTO toResumoDTO(java.util.List<PlanoTratamento> planos) {
        if (planos == null || planos.isEmpty()) {
            return PlanoTratamentoResumoDTO.builder()
                    .totalPlanos(0L)
                    .planosAtivos(0L)
                    .planosConcluidos(0L)
                    .valorTotalAtivos(0.0)
                    .valorTotalConcluidos(0.0)
                    .procedimentoMaisComum("Nenhum")
                    .build();
        }

        long totalPlanos = planos.size();
        long planosAtivos = planos.stream()
                .filter(p -> p.getStatus() == StatusPlanoTratamento.ATIVO)
                .count();
        long planosConcluidos = planos.stream()
                .filter(p -> p.getStatus() == StatusPlanoTratamento.CONCLUIDO)
                .count();

        double valorTotalAtivos = planos.stream()
                .filter(p -> p.getStatus() == StatusPlanoTratamento.ATIVO)
                .mapToDouble(PlanoTratamento::getValorTotal)
                .sum();

        double valorTotalConcluidos = planos.stream()
                .filter(p -> p.getStatus() == StatusPlanoTratamento.CONCLUIDO)
                .mapToDouble(PlanoTratamento::getValorTotal)
                .sum();

        // Encontra o procedimento mais comum
        String procedimentoMaisComum = planos.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        PlanoTratamento::getProcedimento,
                        java.util.stream.Collectors.counting()
                ))
                .entrySet()
                .stream()
                .max(java.util.Map.Entry.comparingByValue())
                .map(java.util.Map.Entry::getKey)
                .orElse("Nenhum");

        return PlanoTratamentoResumoDTO.builder()
                .totalPlanos(totalPlanos)
                .planosAtivos(planosAtivos)
                .planosConcluidos(planosConcluidos)
                .valorTotalAtivos(valorTotalAtivos)
                .valorTotalConcluidos(valorTotalConcluidos)
                .procedimentoMaisComum(procedimentoMaisComum)
                .build();
    }

    // ========== BATCH OPERATIONS ==========

    public java.util.List<PlanoTratamento> fromCreateDTOs(java.util.List<PlanoTratamentoCreateDTO> dtos, Paciente paciente) {
        if (dtos == null || paciente == null) return java.util.Collections.emptyList();

        return dtos.stream()
                .map(dto -> fromCreate(dto, paciente))
                .toList();
    }

    public java.util.List<PlanoTratamentoResponseDTO> toResponseDTOs(java.util.List<PlanoTratamento> entities) {
        if (entities == null) return java.util.Collections.emptyList();

        return entities.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public java.util.List<PlanoTratamentoListDTO> toListDTOs(java.util.List<PlanoTratamento> entities) {
        if (entities == null) return java.util.Collections.emptyList();

        return entities.stream()
                .map(this::toListDTO)
                .toList();
    }
}