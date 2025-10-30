// AgendaConverter.java (REFATORADO)
package com.consultorio.domain.agenda;

import com.consultorio.domain.agenda.dto.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AgendaConverter {

    // ========== TO DTO ==========

    public AgendaResponseDTO toResponseDTO(Agenda agenda) {
        return AgendaResponseDTO.builder()
                .id(agenda.getId())
                .pacienteId(agenda.getPacienteId())
                .pacienteNome(agenda.getPacienteNome())
                .dentistaId(agenda.getDentistaId())
                .dentistaNome(agenda.getDentistaNome())
                .dataHora(agenda.getDataHora())
                .status(agenda.getStatus())
                .observacoes(agenda.getObservacoes())
                .telefone(agenda.getTelefone())
                .email(agenda.getEmail())
                .dataCadastro(agenda.getDataCadastro())
                .build();
    }

    public AgendaListDTO toListDTO(Agenda agenda) {
        return AgendaListDTO.builder()
                .id(agenda.getId())
                .pacienteNome(agenda.getPacienteNome())
                .dentistaNome(agenda.getDentistaNome())
                .dataHora(agenda.getDataHora())
                .status(agenda.getStatus())
                .telefone(agenda.getTelefone())
                .build();
    }

    public ProximoHorarioResponseDTO toProximoHorarioDTO(Agenda agenda) {
        return ProximoHorarioResponseDTO.builder()
                .dataHora(agenda.getDataHora())
                .dentistaNome(agenda.getDentistaNome())
                .pacienteNome(agenda.getPacienteNome())
                .build();
    }

    // ========== TO ENTITY ==========

    public Agenda toEntity(AgendaCreateDTO dto) {
        return Agenda.builder()
                .pacienteId(dto.pacienteId())
                .pacienteNome(dto.pacienteNome())
                .dentistaId(dto.dentistaId())
                .dentistaNome(dto.dentistaNome())
                .dataHora(dto.dataHora())
                .status(dto.status() != null ? dto.status() : Agenda.StatusAgendamento.AGENDADO)
                .observacoes(dto.observacoes())
                .telefone(dto.telefone())
                .email(dto.email())
                .build();
    }

    public Agenda toEntity(AgendaRequestDTO dto) {
        return Agenda.builder()
                .pacienteId(dto.pacienteId())
                .pacienteNome(dto.pacienteNome())
                .dentistaId(dto.dentistaId())
                .dataHora(dto.dataHora())
                .status(Agenda.StatusAgendamento.AGENDADO) // Status padrão
                .observacoes(dto.observacoes())
                .telefone(dto.telefone())
                .email(dto.email())
                .build();
    }

    // ========== UPDATE ENTITY ==========

    public void updateEntityFromDTO(Agenda agenda, AgendaUpdateDTO dto) {
        if (dto.pacienteId() != null) {
            agenda.setPacienteId(dto.pacienteId());
        }
        if (dto.dentistaId() != null) {
            agenda.setDentistaId(dto.dentistaId());
        }
        if (dto.dataHora() != null) {
            agenda.setDataHora(dto.dataHora());
        }
        if (dto.observacoes() != null) {
            agenda.setObservacoes(dto.observacoes());
        }
        if (dto.telefone() != null) {
            agenda.setTelefone(dto.telefone());
        }
        if (dto.email() != null) {
            agenda.setEmail(dto.email());
        }
    }

    public void updateStatusFromDTO(Agenda agenda, AgendaStatusUpdateDTO dto) {
        if (dto.status() != null) {
            agenda.setStatus(dto.status());
        }
    }

    // ========== BATCH CONVERSIONS ==========

    public List<AgendaResponseDTO> toResponseDTOList(List<Agenda> agendas) {
        return agendas.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<AgendaListDTO> toListDTOList(List<Agenda> agendas) {
        return agendas.stream()
                .map(this::toListDTO)
                .collect(Collectors.toList());
    }
}