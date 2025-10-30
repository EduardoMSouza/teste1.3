package com.consultorio.domain.paciente.controller;

import com.consultorio.domain.paciente.DTOs.*;
import com.consultorio.domain.paciente.service.PacienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pacientes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PacienteController {

    private final PacienteService service;

    // ========== OPERAÇÕES BÁSICAS ==========

    @PostMapping
    public ResponseEntity<PacienteResponseDTO> criar(@Valid @RequestBody PacienteCreateDTO createDTO) {
        PacienteResponseDTO response = service.criar(createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<PacienteListDTO>> listarTodos() {
        List<PacienteListDTO> pacientes = service.listarTodos();
        return ResponseEntity.ok(pacientes);
    }

    @GetMapping("/paginado")
    public ResponseEntity<Page<PacienteListDTO>> listarPaginado(Pageable pageable) {
        Page<PacienteListDTO> pacientes = service.listarPaginado(pageable);
        return ResponseEntity.ok(pacientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PacienteResponseDTO> buscarPorId(@PathVariable Long id) {
        PacienteResponseDTO paciente = service.buscarPorId(id);
        return ResponseEntity.ok(paciente);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<PacienteListDTO>> buscarPorNome(@RequestParam String nome) {
        List<PacienteListDTO> pacientes = service.buscarPorNome(nome);
        return ResponseEntity.ok(pacientes);
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<PacienteResponseDTO> buscarPorCpf(@PathVariable String cpf) {
        PacienteResponseDTO paciente = service.buscarPorCpf(cpf);
        return ResponseEntity.ok(paciente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PacienteResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody PacienteUpdateDTO updateDTO) {
        PacienteResponseDTO response = service.atualizar(id, updateDTO);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PacienteResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateDTO statusDTO) {
        PacienteResponseDTO response = service.atualizarStatus(id, statusDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }

    // ========== ANAMNESE ==========

    @PostMapping("/{id}/anamnese")
    public ResponseEntity<PacienteResponseDTO> criarAnamnese(
            @PathVariable Long id,
            @Valid @RequestBody AnamneseDTO anamneseDTO) {
        PacienteResponseDTO response = service.criarOuAtualizarAnamnese(id, anamneseDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}/anamnese")
    public ResponseEntity<AnamneseDTO> buscarAnamnese(@PathVariable Long id) {
        AnamneseDTO anamnese = service.buscarAnamnesePorPacienteId(id);
        return ResponseEntity.ok(anamnese);
    }

    @PutMapping("/{id}/anamnese")
    public ResponseEntity<PacienteResponseDTO> atualizarAnamnese(
            @PathVariable Long id,
            @Valid @RequestBody AnamneseDTO anamneseDTO) {
        PacienteResponseDTO response = service.criarOuAtualizarAnamnese(id, anamneseDTO);
        return ResponseEntity.ok(response);
    }

    // ========== PLANO DE TRATAMENTO ==========

    @PostMapping("/{id}/plano-tratamento")
    public ResponseEntity<PlanoTratamentoResponseDTO> criarPlanoTratamento(
            @PathVariable Long id,
            @Valid @RequestBody PlanoTratamentoCreateDTO createDTO) {
        PlanoTratamentoResponseDTO response = service.criarPlanoTratamento(id, createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}/plano-tratamento")
    public ResponseEntity<List<PlanoTratamentoResponseDTO>> listarPlanosTratamento(@PathVariable Long id) {
        List<PlanoTratamentoResponseDTO> planos = service.listarPlanosTratamentoPorPaciente(id);
        return ResponseEntity.ok(planos);
    }

    @GetMapping("/{id}/plano-tratamento/{planoId}")
    public ResponseEntity<PlanoTratamentoResponseDTO> buscarPlanoTratamentoPorId(
            @PathVariable Long id,
            @PathVariable Long planoId) {
        PlanoTratamentoResponseDTO plano = service.buscarPlanoTratamentoPorId(planoId);
        return ResponseEntity.ok(plano);
    }

    @PutMapping("/{id}/plano-tratamento/{planoId}")
    public ResponseEntity<PlanoTratamentoResponseDTO> atualizarPlanoTratamento(
            @PathVariable Long id,
            @PathVariable Long planoId,
            @Valid @RequestBody PlanoTratamentoUpdateDTO updateDTO) {
        PlanoTratamentoResponseDTO response = service.atualizarPlanoTratamento(planoId, updateDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/plano-tratamento/{planoId}")
    public ResponseEntity<Void> excluirPlanoTratamento(
            @PathVariable Long id,
            @PathVariable Long planoId) {
        service.excluirPlanoTratamento(planoId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/plano-tratamento/resumo")
    public ResponseEntity<PlanoTratamentoPacienteDTO> obterResumoPlanosTratamento(@PathVariable Long id) {
        PlanoTratamentoPacienteDTO resumo = service.obterResumoPlanosTratamento(id);
        return ResponseEntity.ok(resumo);
    }

    // ========== ENDPOINTS ADICIONAIS ==========

    @GetMapping("/ativos")
    public ResponseEntity<List<PacienteListDTO>> listarAtivos() {
        List<PacienteListDTO> pacientes = service.listarAtivos();
        return ResponseEntity.ok(pacientes);
    }

    @GetMapping("/buscar-avancado")
    public ResponseEntity<List<PacienteListDTO>> buscarAvancado(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cpf,
            @RequestParam(required = false) String telefone) {
        List<PacienteListDTO> pacientes = service.buscarAvancado(nome, cpf, telefone);
        return ResponseEntity.ok(pacientes);
    }

    @GetMapping("/{id}/historico")
    public ResponseEntity<PacienteHistoricoDTO> obterHistoricoCompleto(@PathVariable Long id) {
        PacienteHistoricoDTO historico = service.obterHistoricoCompleto(id);
        return ResponseEntity.ok(historico);
    }
}