package com.consultorio.domain.paciente.controller;

import com.consultorio.domain.paciente.DTOs.*;
import com.consultorio.domain.paciente.Enums.StatusPlanoTratamento;
import com.consultorio.domain.paciente.service.PlanoTratamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes/{pacienteId}/plano-tratamento")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PlanoTratamentoController {

    private final PlanoTratamentoService planoTratamentoService;

    @PostMapping
    public ResponseEntity<PlanoTratamentoResponseDTO> criar(
            @PathVariable Long pacienteId,
            @Valid @RequestBody PlanoTratamentoCreateDTO dto) {
        PlanoTratamentoResponseDTO response = planoTratamentoService.criar(pacienteId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<PlanoTratamentoResponseDTO>> listarPorPaciente(@PathVariable Long pacienteId) {
        List<PlanoTratamentoResponseDTO> response = planoTratamentoService.listarPorPaciente(pacienteId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{planoId}")
    public ResponseEntity<PlanoTratamentoResponseDTO> buscarPorId(
            @PathVariable Long pacienteId,
            @PathVariable Long planoId) {
        PlanoTratamentoResponseDTO response = planoTratamentoService.buscarPorId(planoId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{planoId}")
    public ResponseEntity<PlanoTratamentoResponseDTO> atualizar(
            @PathVariable Long pacienteId,
            @PathVariable Long planoId,
            @Valid @RequestBody PlanoTratamentoUpdateDTO dto) {
        PlanoTratamentoResponseDTO response = planoTratamentoService.atualizar(planoId, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{planoId}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long pacienteId,
            @PathVariable Long planoId) {
        planoTratamentoService.deletar(planoId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/resumo")
    public ResponseEntity<PlanoTratamentoPacienteDTO> obterResumo(@PathVariable Long pacienteId) {
        PlanoTratamentoPacienteDTO response = planoTratamentoService.obterResumoPorPaciente(pacienteId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{planoId}/status")
    public ResponseEntity<PlanoTratamentoResponseDTO> atualizarStatus(
            @PathVariable Long pacienteId,
            @PathVariable Long planoId,
            @Valid @RequestBody StatusPlanoTratamentoDTO statusDTO) {
        PlanoTratamentoResponseDTO response = planoTratamentoService.atualizarStatus(planoId, statusDTO);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{planoId}/concluir")
    public ResponseEntity<PlanoTratamentoResponseDTO> concluirPlano(
            @PathVariable Long pacienteId,
            @PathVariable Long planoId) {
        PlanoTratamentoResponseDTO response = planoTratamentoService.concluirPlano(planoId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{planoId}/cancelar")
    public ResponseEntity<PlanoTratamentoResponseDTO> cancelarPlano(
            @PathVariable Long pacienteId,
            @PathVariable Long planoId,
            @RequestParam String motivo) {
        PlanoTratamentoResponseDTO response = planoTratamentoService.cancelarPlano(planoId, motivo);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{planoId}/ativar")
    public ResponseEntity<PlanoTratamentoResponseDTO> ativarPlano(
            @PathVariable Long pacienteId,
            @PathVariable Long planoId) {
        PlanoTratamentoResponseDTO response = planoTratamentoService.ativarPlano(planoId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PlanoTratamentoResponseDTO>> listarPorStatus(
            @PathVariable Long pacienteId,
            @PathVariable StatusPlanoTratamento status) {
        List<PlanoTratamentoResponseDTO> response = planoTratamentoService.listarPorStatus(status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/valor-total")
    public ResponseEntity<Double> obterValorTotal(@PathVariable Long pacienteId) {
        Double valorTotal = planoTratamentoService.obterValorTotalPorPaciente(pacienteId);
        return ResponseEntity.ok(valorTotal);
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<PlanoTratamentoResponseDTO>> listarAtivos(@PathVariable Long pacienteId) {
        List<PlanoTratamentoResponseDTO> response = planoTratamentoService.listarAtivos();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar/procedimento")
    public ResponseEntity<List<PlanoTratamentoResponseDTO>> buscarPorProcedimento(
            @PathVariable Long pacienteId,
            @RequestParam String procedimento) {
        List<PlanoTratamentoResponseDTO> response = planoTratamentoService.buscarPorProcedimento(procedimento);
        return ResponseEntity.ok(response);
    }
}