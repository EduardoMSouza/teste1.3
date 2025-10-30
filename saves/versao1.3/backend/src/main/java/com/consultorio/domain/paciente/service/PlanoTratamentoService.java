package com.consultorio.domain.paciente.service;

import com.consultorio.domain.paciente.DTOs.*;
import com.consultorio.domain.paciente.entity.Paciente;
import com.consultorio.domain.paciente.entity.PlanoTratamento;
import com.consultorio.domain.paciente.repository.PacienteRepository;
import com.consultorio.domain.paciente.repository.PlanoTratamentoRepository;
import com.consultorio.domain.paciente.Enums.Dente;
import com.consultorio.domain.paciente.Enums.StatusPlanoTratamento;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlanoTratamentoService {

    private final PlanoTratamentoRepository planoTratamentoRepository;
    private final PacienteRepository pacienteRepository;

    @Transactional
    public PlanoTratamentoResponseDTO criar(Long pacienteId, PlanoTratamentoCreateDTO createDTO) {
        log.info("Criando plano de tratamento para paciente ID: {}", pacienteId);

        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado com ID: " + pacienteId));

        PlanoTratamento planoTratamento = toEntity(createDTO, paciente);
        PlanoTratamento planoSalvo = planoTratamentoRepository.save(planoTratamento);

        log.info("Plano de tratamento criado com ID: {}", planoSalvo.getId());
        return toResponseDTO(planoSalvo);
    }

    @Transactional(readOnly = true)
    public List<PlanoTratamentoResponseDTO> listarPorPaciente(Long pacienteId) {
        log.info("Listando planos de tratamento para paciente ID: {}", pacienteId);

        if (!pacienteRepository.existsById(pacienteId)) {
            throw new RuntimeException("Paciente não encontrado com ID: " + pacienteId);
        }

        return planoTratamentoRepository.findByPacienteId(pacienteId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PlanoTratamentoResponseDTO buscarPorId(Long planoId) {
        log.info("Buscando plano de tratamento com ID: {}", planoId);

        PlanoTratamento planoTratamento = planoTratamentoRepository.findById(planoId)
                .orElseThrow(() -> new RuntimeException("Plano de tratamento não encontrado com ID: " + planoId));

        return toResponseDTO(planoTratamento);
    }

    @Transactional
    public PlanoTratamentoResponseDTO atualizar(Long planoId, PlanoTratamentoUpdateDTO updateDTO) {
        log.info("Atualizando plano de tratamento com ID: {}", planoId);

        PlanoTratamento planoTratamento = planoTratamentoRepository.findById(planoId)
                .orElseThrow(() -> new RuntimeException("Plano de tratamento não encontrado com ID: " + planoId));

        updateEntityFromDTO(planoTratamento, updateDTO);
        PlanoTratamento planoAtualizado = planoTratamentoRepository.save(planoTratamento);

        log.info("Plano de tratamento atualizado com ID: {}", planoAtualizado.getId());
        return toResponseDTO(planoAtualizado);
    }

    @Transactional
    public void deletar(Long planoId) {
        log.info("Deletando plano de tratamento com ID: {}", planoId);

        if (!planoTratamentoRepository.existsById(planoId)) {
            throw new RuntimeException("Plano de tratamento não encontrado com ID: " + planoId);
        }

        planoTratamentoRepository.deleteById(planoId);
        log.info("Plano de tratamento deletado com ID: {}", planoId);
    }

    @Transactional(readOnly = true)
    public PlanoTratamentoPacienteDTO obterResumoPorPaciente(Long pacienteId) {
        log.info("Obtendo resumo de planos de tratamento para paciente ID: {}", pacienteId);

        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado com ID: " + pacienteId));

        List<PlanoTratamento> planos = planoTratamentoRepository.findByPacienteId(pacienteId);

        Double valorTotalGeral = planos.stream()
                .mapToDouble(PlanoTratamento::getValorTotal)
                .sum();

        List<PlanoTratamentoResponseDTO> planosDTO = planos.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());

        return PlanoTratamentoPacienteDTO.builder()
                .pacienteId(paciente.getId())
                .pacienteNome(paciente.getNome())
                .planosTratamento(planosDTO)
                .valorTotalGeral(valorTotalGeral)
                .build();
    }

    @Transactional(readOnly = true)
    public List<PlanoTratamentoResponseDTO> listarAtivos() {
        log.info("Listando planos de tratamento ativos");

        return planoTratamentoRepository.findByStatus(StatusPlanoTratamento.ATIVO)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PlanoTratamentoResponseDTO> buscarPorProcedimento(String procedimento) {
        log.info("Buscando planos de tratamento por procedimento: {}", procedimento);

        return planoTratamentoRepository.findByProcedimentoContainingIgnoreCase(procedimento)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PlanoTratamentoResponseDTO atualizarStatus(Long planoId, StatusPlanoTratamentoDTO statusDTO) {
        log.info("Atualizando status do plano de tratamento ID: {} para {}", planoId, statusDTO.status());

        PlanoTratamento planoTratamento = planoTratamentoRepository.findById(planoId)
                .orElseThrow(() -> new RuntimeException("Plano de tratamento não encontrado com ID: " + planoId));

        planoTratamento.setStatus(statusDTO.status());

        // Atualizar datas conforme o status
        if (statusDTO.status() == StatusPlanoTratamento.ATIVO && planoTratamento.getDataInicio() == null) {
            planoTratamento.setDataInicio(java.time.LocalDateTime.now());
        } else if (statusDTO.status() == StatusPlanoTratamento.CONCLUIDO) {
            planoTratamento.setDataConclusao(java.time.LocalDateTime.now());
        } else if (statusDTO.status() == StatusPlanoTratamento.CANCELADO) {
            planoTratamento.setDataCancelamento(java.time.LocalDateTime.now());
            planoTratamento.setMotivoCancelamento(statusDTO.motivoCancelamento());
        }

        PlanoTratamento planoAtualizado = planoTratamentoRepository.save(planoTratamento);

        log.info("Status do plano de tratamento ID: {} atualizado para {}", planoId, statusDTO.status());
        return toResponseDTO(planoAtualizado);
    }

    @Transactional(readOnly = true)
    public Double obterValorTotalPorPaciente(Long pacienteId) {
        log.info("Calculando valor total dos planos para paciente ID: {}", pacienteId);

        if (!pacienteRepository.existsById(pacienteId)) {
            throw new RuntimeException("Paciente não encontrado com ID: " + pacienteId);
        }

        return planoTratamentoRepository.calcularValorTotalPorPaciente(pacienteId);
    }

    @Transactional
    public PlanoTratamentoResponseDTO concluirPlano(Long planoId) {
        log.info("Concluindo plano de tratamento ID: {}", planoId);

        PlanoTratamento planoTratamento = planoTratamentoRepository.findById(planoId)
                .orElseThrow(() -> new RuntimeException("Plano de tratamento não encontrado com ID: " + planoId));

        planoTratamento.concluir();
        PlanoTratamento planoConcluido = planoTratamentoRepository.save(planoTratamento);

        log.info("Plano de tratamento ID: {} concluído com sucesso", planoId);
        return toResponseDTO(planoConcluido);
    }

    @Transactional
    public PlanoTratamentoResponseDTO cancelarPlano(Long planoId, String motivo) {
        log.info("Cancelando plano de tratamento ID: {} - Motivo: {}", planoId, motivo);

        PlanoTratamento planoTratamento = planoTratamentoRepository.findById(planoId)
                .orElseThrow(() -> new RuntimeException("Plano de tratamento não encontrado com ID: " + planoId));

        planoTratamento.cancelar(motivo);
        PlanoTratamento planoCancelado = planoTratamentoRepository.save(planoTratamento);

        log.info("Plano de tratamento ID: {} cancelado", planoId);
        return toResponseDTO(planoCancelado);
    }

    @Transactional
    public PlanoTratamentoResponseDTO ativarPlano(Long planoId) {
        log.info("Ativando plano de tratamento ID: {}", planoId);

        PlanoTratamento planoTratamento = planoTratamentoRepository.findById(planoId)
                .orElseThrow(() -> new RuntimeException("Plano de tratamento não encontrado com ID: " + planoId));

        planoTratamento.ativar();
        PlanoTratamento planoAtivado = planoTratamentoRepository.save(planoTratamento);

        log.info("Plano de tratamento ID: {} ativado", planoId);
        return toResponseDTO(planoAtivado);
    }

    @Transactional(readOnly = true)
    public List<PlanoTratamentoResponseDTO> listarPorStatus(StatusPlanoTratamento status) {
        log.info("Listando planos de tratamento com status: {}", status);

        return planoTratamentoRepository.findByStatus(status)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // === MÉTODOS DE MAPEAMENTO ===

    private PlanoTratamento toEntity(PlanoTratamentoCreateDTO dto, Paciente paciente) {
        return PlanoTratamento.builder()
                .paciente(paciente)
                .dente(dto.dente()) // Já é do tipo Dente enum
                .procedimento(dto.procedimento())
                .valor(dto.valor())
                .observacao(dto.observacao())
                .valorTotal(dto.valorTotal())
                .status(StatusPlanoTratamento.ORCAMENTO) // Status inicial como orçamento
                .build();
    }

    private void updateEntityFromDTO(PlanoTratamento entity, PlanoTratamentoUpdateDTO dto) {
        entity.setDente(dto.dente()); // Já é do tipo Dente enum
        entity.setProcedimento(dto.procedimento());
        entity.setValor(dto.valor());
        entity.setObservacao(dto.observacao());
        entity.setValorTotal(dto.valorTotal());
    }

    private PlanoTratamentoResponseDTO toResponseDTO(PlanoTratamento entity) {
        return PlanoTratamentoResponseDTO.builder()
                .id(entity.getId())
                .pacienteId(entity.getPaciente().getId())
                .pacienteNome(entity.getPaciente().getNome())
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
}