// AgendaService.java
package com.consultorio.domain.agenda;

import com.consultorio.domain.agenda.dto.*;
import com.consultorio.domain.agenda.exception.AgendamentoNotFoundException;
import com.consultorio.domain.agenda.exception.ConflitoAgendamentoException;
import com.consultorio.domain.dentista.Dentista;
import com.consultorio.domain.dentista.DentistaRepository;
import com.consultorio.domain.dentista.exception.DentistaNotFoundException;
import com.consultorio.domain.paciente.entity.Paciente;
import com.consultorio.domain.paciente.erro.PacienteNotFoundException;
import com.consultorio.domain.paciente.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AgendaService {

    private final AgendaRepository repository;
    private final AgendaConverter converter;
    private final DentistaRepository dentistaRepository;
    private final PacienteRepository pacienteRepository;

    @Transactional
    public AgendaResponseDTO criar(AgendaCreateDTO dto) {
        log.info("Criando novo agendamento para paciente: {}", dto.pacienteNome());

        validarDisponibilidade(dto.dentistaId(), dto.dataHora(), null);

        Agenda agenda = converter.toEntity(dto);

        Long pacienteId = normalizePacienteId(dto.pacienteId());
        agenda.setPacienteId(pacienteId);
        agenda.setPacienteNome(resolvePacienteNome(pacienteId, dto.pacienteNome()));
        agenda.setDentistaNome(resolveDentistaNome(dto.dentistaId()));
        Agenda saved = repository.save(agenda);

        log.info("Agendamento criado com ID: {}", saved.getId());
        return converter.toResponseDTO(saved);
    }

    public List<AgendaListDTO> listar() {
        log.info("Listando todos os agendamentos");
        return repository.findAll().stream()
                .map(converter::toListDTO)
                .collect(Collectors.toList());
    }

    public List<AgendaListDTO> listarPorDentista(Long dentistaId) {
        log.info("Listando agendamentos para dentista ID: {}", dentistaId);
        return repository.findByDentistaIdOrderByDataHoraDesc(dentistaId).stream()
                .map(converter::toListDTO)
                .collect(Collectors.toList());
    }

    public List<AgendaListDTO> listarPorPaciente(Long pacienteId) {
        log.info("Listando agendamentos para paciente ID: {}", pacienteId);
        return repository.findByPacienteIdOrderByDataHoraDesc(pacienteId).stream()
                .map(converter::toListDTO)
                .collect(Collectors.toList());
    }

    public List<AgendaListDTO> listarPorStatus(Agenda.StatusAgendamento status) {
        log.info("Listando agendamentos com status: {}", status);
        return repository.findByStatusOrderByDataHoraDesc(status).stream()
                .map(converter::toListDTO)
                .collect(Collectors.toList());
    }

    public AgendaResponseDTO buscarPorId(Long id) {
        log.info("Buscando agendamento por ID: {}", id);
        Agenda agenda = repository.findById(id)
                .orElseThrow(() -> new AgendamentoNotFoundException("Agendamento não encontrado com ID: " + id));
        return converter.toResponseDTO(agenda);
    }

    @Transactional
    public AgendaResponseDTO atualizar(Long id, AgendaUpdateDTO dto) {
        log.info("Atualizando agendamento ID: {}", id);

        Agenda agenda = repository.findById(id)
                .orElseThrow(() -> new AgendamentoNotFoundException("Agendamento não encontrado com ID: " + id));

        // Validar disponibilidade se data/hora ou dentista foram alterados
        if ((dto.dataHora() != null && !dto.dataHora().equals(agenda.getDataHora())) ||
                (dto.dentistaId() != null && !dto.dentistaId().equals(agenda.getDentistaId()))) {

            Long dentistaId = dto.dentistaId() != null ? dto.dentistaId() : agenda.getDentistaId();
            LocalDateTime dataHora = dto.dataHora() != null ? dto.dataHora() : agenda.getDataHora();

            validarDisponibilidade(dentistaId, dataHora, id);
        }

        converter.updateEntityFromDTO(agenda, dto);

        if (dto.pacienteId() != null) {
            Long pacienteId = normalizePacienteId(dto.pacienteId());
            agenda.setPacienteId(pacienteId);
            if (pacienteId != null) {
                agenda.setPacienteNome(resolvePacienteNome(pacienteId, null));
            }
        }

        if (dto.dentistaId() != null) {
            agenda.setDentistaNome(resolveDentistaNome(agenda.getDentistaId()));
        }
        Agenda updated = repository.save(agenda);

        log.info("Agendamento ID: {} atualizado com sucesso", id);
        return converter.toResponseDTO(updated);
    }

    @Transactional
    public AgendaResponseDTO atualizarStatus(Long id, AgendaStatusUpdateDTO dto) {
        log.info("Atualizando status do agendamento ID: {} para {}", id, dto.status());

        Agenda agenda = repository.findById(id)
                .orElseThrow(() -> new AgendamentoNotFoundException("Agendamento não encontrado com ID: " + id));

        validarTransicaoStatus(agenda.getStatus(), dto.status());

        agenda.setStatus(dto.status());
        Agenda updated = repository.save(agenda);

        log.info("Status do agendamento ID: {} atualizado para {}", id, dto.status());
        return converter.toResponseDTO(updated);
    }

    @Transactional
    public void deletar(Long id) {
        log.info("Deletando agendamento ID: {}", id);

        if (!repository.existsById(id)) {
            throw new AgendamentoNotFoundException("Agendamento não encontrado com ID: " + id);
        }

        repository.deleteById(id);
        log.info("Agendamento ID: {} deletado com sucesso", id);
    }

    public List<LocalDateTime> verificarDisponibilidade(DisponibilidadeRequestDTO dto) {
        log.info("Verificando disponibilidade para dentista ID: {} em {}", dto.dentistaId(), dto.data());

        LocalDateTime inicioDia = LocalDateTime.of(dto.data(), LocalTime.MIN);
        LocalDateTime fimDia = LocalDateTime.of(dto.data(), LocalTime.MAX);

        // Buscar horários ocupados
        List<LocalDateTime> horariosOcupados = repository.findHorariosOcupadosNoDia(dto.dentistaId(), inicioDia);

        // Gerar todos os horários possíveis no intervalo
        List<LocalDateTime> todosHorarios = gerarHorariosNoIntervalo(dto.horaInicio(), dto.horaFim(), dto.data());

        // Filtrar horários disponíveis
        return todosHorarios.stream()
                .filter(horario -> !horariosOcupados.contains(horario))
                .collect(Collectors.toList());
    }

    public ProximoHorarioResponseDTO buscarProximoHorario(Long dentistaId) {
        log.info("Buscando próximo horário para dentista ID: {}", dentistaId);

        LocalDateTime agora = LocalDateTime.now();

        // Buscar próximo agendamento existente
        List<Agenda> proximosAgendamentos = repository.findProximoAgendamento(dentistaId, agora);

        if (!proximosAgendamentos.isEmpty()) {
            Agenda proximo = proximosAgendamentos.get(0);
            return converter.toProximoHorarioDTO(proximo);
        }

        // Se não há agendamentos futuros, calcular próximo horário disponível
        LocalDateTime proximoHorarioDisponivel = calcularProximoHorarioDisponivel(dentistaId, agora);

        return ProximoHorarioResponseDTO.builder()
                .dataHora(proximoHorarioDisponivel)
                .dentistaNome("Dentista " + dentistaId) // Em uma implementação real, busque o nome do dentista
                .pacienteNome("Horário Disponível")
                .build();
    }

    public List<AgendaResponseDTO> buscarPorPeriodo(LocalDateTime inicio, LocalDateTime fim) {
        log.info("Buscando agendamentos no período de {} a {}", inicio, fim);
        return repository.findByDataHoraBetweenOrderByDataHoraAsc(inicio, fim).stream()
                .map(converter::toResponseDTO)
                .collect(Collectors.toList());
    }

    private Long normalizePacienteId(Long pacienteId) {
        return (pacienteId != null && pacienteId > 0) ? pacienteId : null;
    }

    private String resolvePacienteNome(Long pacienteId, String nomeInformado) {
        if (pacienteId != null) {
            Paciente paciente = pacienteRepository.findById(pacienteId)
                    .orElseThrow(() -> new PacienteNotFoundException("Paciente não encontrado com ID: " + pacienteId));
            return paciente.getNome();
        }

        if (nomeInformado == null || nomeInformado.isBlank()) {
            throw new IllegalArgumentException("Nome do paciente é obrigatório quando o paciente não está cadastrado.");
        }

        return nomeInformado.trim();
    }

    private String resolveDentistaNome(Long dentistaId) {
        Dentista dentista = dentistaRepository.findById(dentistaId)
                .orElseThrow(() -> new DentistaNotFoundException("Dentista não encontrado com ID: " + dentistaId));
        return dentista.getNome();
    }

    private void validarDisponibilidade(Long dentistaId, LocalDateTime dataHora, Long idExcluir) {
        boolean conflito;

        if (idExcluir != null) {
            conflito = repository.existsByDentistaIdAndDataHoraAndStatusNotCanceladoAndIdNot(
                    dentistaId, dataHora, idExcluir);
        } else {
            conflito = repository.existsByDentistaIdAndDataHoraAndStatusNotCancelado(dentistaId, dataHora);
        }

        if (conflito) {
            throw new ConflitoAgendamentoException(
                    "Já existe um agendamento para o dentista no horário selecionado");
        }
    }

    private void validarTransicaoStatus(Agenda.StatusAgendamento atual, Agenda.StatusAgendamento novo) {
        if (atual == Agenda.StatusAgendamento.CONCLUIDO || atual == Agenda.StatusAgendamento.CANCELADO) {
            throw new IllegalStateException(
                    "Não é possível alterar o status de um agendamento " + atual.toString().toLowerCase());
        }

        log.debug("Transição de status válida: {} -> {}", atual, novo);
    }

    private List<LocalDateTime> gerarHorariosNoIntervalo(LocalTime inicio, LocalTime fim, LocalDate data) {
        List<LocalDateTime> horarios = new ArrayList<>();
        LocalDateTime horarioAtual = LocalDateTime.of(data, inicio);

        while (!horarioAtual.toLocalTime().isAfter(fim.minusMinutes(30))) {
            horarios.add(horarioAtual);
            horarioAtual = horarioAtual.plusMinutes(30);
        }

        return horarios;
    }

    private LocalDateTime calcularProximoHorarioDisponivel(Long dentistaId, LocalDateTime dataBase) {
        LocalDateTime proximoHorario = dataBase.plusDays(1)
                .withHour(8)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);

        // Ajustar para o próximo horário comercial válido (segunda a sexta, 8h-18h)
        while (proximoHorario.getDayOfWeek().getValue() > 6) { // Fim de semana
            proximoHorario = proximoHorario.plusDays(1);
        }

        // Verificar disponibilidade
        while (repository.existsByDentistaIdAndDataHoraAndStatusNotCancelado(dentistaId, proximoHorario)) {
            proximoHorario = proximoHorario.plusMinutes(60);

            // Se passou do horário comercial, ir para o próximo dia
            if (proximoHorario.toLocalTime().isAfter(LocalTime.of(17, 30))) {
                proximoHorario = proximoHorario.plusDays(1)
                        .withHour(8)
                        .withMinute(0);

                // Pular fins de semana
                while (proximoHorario.getDayOfWeek().getValue() > 5) {
                    proximoHorario = proximoHorario.plusDays(1);
                }
            }
        }

        return proximoHorario;
    }
}