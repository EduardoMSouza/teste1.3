// AgendaController.java
package com.consultorio.domain.agenda;

import com.consultorio.domain.agenda.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/agendamentos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AgendaController {

    private final AgendaService service;

    @PostMapping
    public ResponseEntity<AgendaResponseDTO> criar(@Valid @RequestBody AgendaCreateDTO dto) {
        log.info("POST /api/agendamentos - Criando novo agendamento");
        AgendaResponseDTO response = service.criar(dto);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @GetMapping
    public ResponseEntity<List<AgendaListDTO>> listar() {
        log.info("GET /api/agendamentos - Listando todos os agendamentos");
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/dentista/{dentistaId}")
    public ResponseEntity<List<AgendaListDTO>> listarPorDentista(@PathVariable Long dentistaId) {
        log.info("GET /api/agendamentos/dentista/{} - Listando por dentista", dentistaId);
        return ResponseEntity.ok(service.listarPorDentista(dentistaId));
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<AgendaListDTO>> listarPorPaciente(@PathVariable Long pacienteId) {
        log.info("GET /api/agendamentos/paciente/{} - Listando por paciente", pacienteId);
        return ResponseEntity.ok(service.listarPorPaciente(pacienteId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<AgendaListDTO>> listarPorStatus(@PathVariable Agenda.StatusAgendamento status) {
        log.info("GET /api/agendamentos/status/{} - Listando por status", status);
        return ResponseEntity.ok(service.listarPorStatus(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgendaResponseDTO> buscarPorId(@PathVariable Long id) {
        log.info("GET /api/agendamentos/{} - Buscando por ID", id);
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgendaResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody AgendaUpdateDTO dto) {
        log.info("PUT /api/agendamentos/{} - Atualizando agendamento", id);
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AgendaResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @Valid @RequestBody AgendaStatusUpdateDTO dto) {
        log.info("PATCH /api/agendamentos/{}/status - Atualizando status", id);
        return ResponseEntity.ok(service.atualizarStatus(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        log.info("DELETE /api/agendamentos/{} - Deletando agendamento", id);
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/disponibilidade")
    public ResponseEntity<List<LocalDateTime>> verificarDisponibilidade(
            @Valid @RequestBody DisponibilidadeRequestDTO dto) {
        log.info("POST /api/agendamentos/disponibilidade - Verificando disponibilidade");
        return ResponseEntity.ok(service.verificarDisponibilidade(dto));
    }

    @GetMapping("/dentista/{dentistaId}/proximo-horario")
    public ResponseEntity<ProximoHorarioResponseDTO> buscarProximoHorario(@PathVariable Long dentistaId) {
        log.info("GET /api/agendamentos/dentista/{}/proximo-horario - Buscando próximo horário", dentistaId);
        ProximoHorarioResponseDTO response = service.buscarProximoHorario(dentistaId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/periodo")
    public ResponseEntity<List<AgendaResponseDTO>> buscarPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim) {
        log.info("GET /api/agendamentos/periodo - Buscando por período: {} a {}", inicio, fim);
        return ResponseEntity.ok(service.buscarPorPeriodo(inicio, fim));
    }
}