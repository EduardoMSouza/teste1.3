package com.consultorio.domain.paciente.repository;

import com.consultorio.domain.paciente.entity.PlanoTratamento;
import com.consultorio.domain.paciente.Enums.StatusPlanoTratamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlanoTratamentoRepository extends JpaRepository<PlanoTratamento, Long> {

    List<PlanoTratamento> findByPacienteId(Long pacienteId);

    List<PlanoTratamento> findByStatus(StatusPlanoTratamento status);

    @Query("SELECT pt FROM PlanoTratamento pt WHERE pt.status = 'ATIVO'")
    List<PlanoTratamento> findByStatusAtivo();

    List<PlanoTratamento> findByProcedimentoContainingIgnoreCase(String procedimento);

    @Query("SELECT SUM(pt.valorTotal) FROM PlanoTratamento pt WHERE pt.paciente.id = :pacienteId")
    Double calcularValorTotalPorPaciente(@Param("pacienteId") Long pacienteId);

    @Query("SELECT COUNT(pt) FROM PlanoTratamento pt WHERE pt.paciente.id = :pacienteId AND pt.status = 'ATIVO'")
    Long countPlanosAtivosPorPaciente(@Param("pacienteId") Long pacienteId);

    boolean existsByPacienteIdAndDenteAndStatus(Long pacienteId, String dente, StatusPlanoTratamento status);
}