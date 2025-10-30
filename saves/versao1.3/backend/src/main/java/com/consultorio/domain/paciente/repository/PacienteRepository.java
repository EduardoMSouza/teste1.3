package com.consultorio.domain.paciente.repository;

import com.consultorio.domain.paciente.entity.Paciente;
import com.consultorio.domain.paciente.Enums.StatusPaciente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    // Consultas básicas
    List<Paciente> findAllByOrderByDataCadastroDesc();
    Page<Paciente> findAllByOrderByDataCadastroDesc(Pageable pageable);
    List<Paciente> findByNomeContainingIgnoreCaseOrderByNome(String nome);
    Optional<Paciente> findByCpf(String cpf);
    List<Paciente> findByStatus(StatusPaciente status);

    // Validações de unicidade
    boolean existsByCpf(String cpf);
    boolean existsByCpfAndIdNot(String cpf, Long id);
    boolean existsByProntuario(String prontuario);
    boolean existsByProntuarioAndIdNot(String prontuario, Long id);

    // Busca avançada
    @Query("SELECT p FROM Paciente p WHERE " +
            "(:nome IS NULL OR LOWER(p.nome) LIKE LOWER(CONCAT('%', :nome, '%'))) AND " +
            "(:cpf IS NULL OR p.cpf = :cpf) AND " +
            "(:telefone IS NULL OR p.telefone LIKE CONCAT('%', :telefone, '%')) " +
            "ORDER BY p.nome")
    List<Paciente> buscarAvancado(@Param("nome") String nome,
                                  @Param("cpf") String cpf,
                                  @Param("telefone") String telefone);
}