// AgendaRepository.java
package com.consultorio.domain.agenda;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AgendaRepository extends JpaRepository<Agenda, Long> {

    // Buscar agendamentos por dentista em um período
    @Query("SELECT a FROM Agenda a WHERE a.dentistaId = :dentistaId AND a.dataHora BETWEEN :inicio AND :fim")
    List<Agenda> findByDentistaIdAndDataHoraBetween(
            @Param("dentistaId") Long dentistaId,
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim);

    // Buscar por paciente
    List<Agenda> findByPacienteIdOrderByDataHoraDesc(Long pacienteId);

    // Buscar por dentista
    List<Agenda> findByDentistaIdOrderByDataHoraDesc(Long dentistaId);

    // Buscar por status
    List<Agenda> findByStatusOrderByDataHoraDesc(Agenda.StatusAgendamento status);

    // Buscar por período
    List<Agenda> findByDataHoraBetweenOrderByDataHoraAsc(LocalDateTime inicio, LocalDateTime fim);

    // Buscar próximo agendamento existente
    @Query("SELECT a FROM Agenda a WHERE a.dentistaId = :dentistaId AND a.dataHora > :dataHora AND a.status != 'CANCELADO' ORDER BY a.dataHora ASC")
    List<Agenda> findProximoAgendamento(
            @Param("dentistaId") Long dentistaId,
            @Param("dataHora") LocalDateTime dataHora);

    // Verificar conflito de agendamento
    @Query("SELECT COUNT(a) > 0 FROM Agenda a WHERE a.dentistaId = :dentistaId AND a.dataHora = :dataHora AND a.status != 'CANCELADO'")
    boolean existsByDentistaIdAndDataHoraAndStatusNotCancelado(
            @Param("dentistaId") Long dentistaId,
            @Param("dataHora") LocalDateTime dataHora);

    // Verificar conflito excluindo um ID específico (para updates)
    @Query("SELECT COUNT(a) > 0 FROM Agenda a WHERE a.dentistaId = :dentistaId AND a.dataHora = :dataHora AND a.status != 'CANCELADO' AND a.id != :excludeId")
    boolean existsByDentistaIdAndDataHoraAndStatusNotCanceladoAndIdNot(
            @Param("dentistaId") Long dentistaId,
            @Param("dataHora") LocalDateTime dataHora,
            @Param("excludeId") Long excludeId);

    // Buscar horários ocupados de um dentista em um dia
    @Query("SELECT a.dataHora FROM Agenda a WHERE a.dentistaId = :dentistaId AND CAST(a.dataHora AS localdate) = CAST(:data AS localdate) AND a.status != 'CANCELADO'")
    List<LocalDateTime> findHorariosOcupadosNoDia(
            @Param("dentistaId") Long dentistaId,
            @Param("data") LocalDateTime data);
}