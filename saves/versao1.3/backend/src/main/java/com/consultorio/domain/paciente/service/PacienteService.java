package com.consultorio.domain.paciente.service;

import com.consultorio.domain.paciente.DTOs.*;
import com.consultorio.domain.paciente.converter.PacienteConverter;
import com.consultorio.domain.paciente.entity.Paciente;
import com.consultorio.domain.paciente.entity.PlanoTratamento;
import com.consultorio.domain.paciente.Enums.StatusPaciente;
import com.consultorio.domain.paciente.Enums.StatusPlanoTratamento;
import com.consultorio.domain.paciente.erro.PacienteDuplicadoException;
import com.consultorio.domain.paciente.erro.PacienteNotFoundException;
import com.consultorio.domain.paciente.repository.PacienteRepository;
import com.consultorio.domain.paciente.repository.PlanoTratamentoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PacienteService {

    private final PacienteRepository repository;
    private final PlanoTratamentoRepository planoTratamentoRepository;
    private final PacienteConverter converter;

    // ========== OPERAÇÕES CRUD BÁSICAS ==========

    @Transactional
    public PacienteResponseDTO criar(PacienteCreateDTO createDTO) {
        log.info("Criando paciente: {}", createDTO.nome());

        validarUnicidadeCriacao(createDTO);
        Paciente paciente = converter.fromCreate(createDTO).toEntity();
        Paciente pacienteSalvo = repository.save(paciente);

        log.info("Paciente criado com ID: {}", pacienteSalvo.getId());
        return converter.fromEntity(pacienteSalvo).toResponse();
    }

    @Transactional(readOnly = true)
    public PacienteResponseDTO buscarPorId(Long id) {
        log.info("Buscando paciente por ID: {}", id);

        Paciente paciente = repository.findById(id)
                .orElseThrow(() -> new PacienteNotFoundException("Paciente não encontrado com ID: " + id));

        return converter.fromEntity(paciente).toResponse();
    }

    @Transactional
    public PacienteResponseDTO atualizar(Long id, PacienteUpdateDTO updateDTO) {
        log.info("Atualizando paciente ID: {}", id);

        validarUnicidadeAtualizacao(id, updateDTO);
        Paciente paciente = repository.findById(id)
                .orElseThrow(() -> new PacienteNotFoundException("Paciente não encontrado com ID: " + id));

        converter.fromUpdate(updateDTO).updateEntity(paciente);
        Paciente pacienteAtualizado = repository.save(paciente);

        log.info("Paciente ID: {} atualizado com sucesso", id);
        return converter.fromEntity(pacienteAtualizado).toResponse();
    }


    @Transactional
    public void excluir(Long id) {
        log.info("Excluindo paciente ID: {}", id);

        if (!repository.existsById(id)) {
            throw new PacienteNotFoundException("Paciente não encontrado com ID: " + id);
        }

        repository.deleteById(id);
        log.info("Paciente ID: {} excluído com sucesso", id);
    }

    // ========== STATUS ==========

    @Transactional
    public PacienteResponseDTO atualizarStatus(Long id, StatusUpdateDTO statusDTO) {
        log.info("Atualizando status do paciente ID: {} para {}", id, statusDTO.status());

        Paciente paciente = repository.findById(id)
                .orElseThrow(() -> new PacienteNotFoundException("Paciente não encontrado com ID: " + id));

        paciente.setStatus(statusDTO.status());
        Paciente pacienteAtualizado = repository.save(paciente);

        log.info("Status do paciente ID: {} atualizado para {}", id, statusDTO.status());
        return toResponseDTO(pacienteAtualizado);
    }

    // ========== CONSULTAS ==========

    @Transactional(readOnly = true)
    public List<PacienteListDTO> listarTodos() {
        log.info("Listando todos os pacientes");

        List<Paciente> pacientes = repository.findAllByOrderByDataCadastroDesc();
        return pacientes.stream()
                .map(this::toListDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<PacienteListDTO> listarPaginado(Pageable pageable) {
        log.info("Listando pacientes paginados - página: {}, tamanho: {}",
                pageable.getPageNumber(), pageable.getPageSize());

        return repository.findAllByOrderByDataCadastroDesc(pageable)
                .map(this::toListDTO);
    }

    @Transactional(readOnly = true)
    public List<PacienteListDTO> buscarPorNome(String nome) {
        log.info("Buscando pacientes por nome: {}", nome);

        if (nome == null || nome.trim().isEmpty()) {
            return listarTodos();
        }

        List<Paciente> pacientes = repository.findByNomeContainingIgnoreCaseOrderByNome(nome);
        return pacientes.stream()
                .map(this::toListDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PacienteResponseDTO buscarPorCpf(String cpf) {
        log.info("Buscando paciente por CPF: {}", cpf);

        Paciente paciente = repository.findByCpf(cpf)
                .orElseThrow(() -> new PacienteNotFoundException("Paciente não encontrado com CPF: " + cpf));

        return toResponseDTO(paciente);
    }

    @Transactional(readOnly = true)
    public List<PacienteListDTO> listarAtivos() {
        log.info("Listando pacientes ativos");

        List<Paciente> pacientes = repository.findByStatus(StatusPaciente.ATIVO);
        return pacientes.stream()
                .map(this::toListDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PacienteListDTO> buscarAvancado(String nome, String cpf, String telefone) {
        log.info("Buscando pacientes avançado - nome: {}, cpf: {}, telefone: {}", nome, cpf, telefone);

        List<Paciente> pacientes = repository.buscarAvancado(nome, cpf, telefone);
        return pacientes.stream()
                .map(this::toListDTO)
                .collect(Collectors.toList());
    }

    // ========== ANAMNESE ==========

    @Transactional
    public PacienteResponseDTO criarOuAtualizarAnamnese(Long id, AnamneseDTO anamneseDTO) {
        log.info("Criando/atualizando anamnese para paciente ID: {}", id);

        Paciente paciente = repository.findById(id)
                .orElseThrow(() -> new PacienteNotFoundException("Paciente não encontrado com ID: " + id));

        // Aqui você implementaria a lógica específica da anamnese
        // Por enquanto, vamos apenas retornar o paciente atualizado
        Paciente pacienteAtualizado = repository.save(paciente);

        log.info("Anamnese do paciente ID: {} atualizada", id);
        return toResponseDTO(pacienteAtualizado);
    }

    @Transactional(readOnly = true)
    public AnamneseDTO buscarAnamnesePorPacienteId(Long id) {
        log.info("Buscando anamnese do paciente ID: {}", id);

        Paciente paciente = repository.findById(id)
                .orElseThrow(() -> new PacienteNotFoundException("Paciente não encontrado com ID: " + id));

        // Implemente a lógica específica para buscar a anamnese
        return AnamneseDTO.builder().build();
    }

    // ========== PLANO DE TRATAMENTO ==========

    @Transactional
    public PlanoTratamentoResponseDTO criarPlanoTratamento(Long pacienteId, PlanoTratamentoCreateDTO createDTO) {
        log.info("Criando plano de tratamento para paciente ID: {}", pacienteId);

        Paciente paciente = repository.findById(pacienteId)
                .orElseThrow(() -> new PacienteNotFoundException("Paciente não encontrado com ID: " + pacienteId));

        PlanoTratamento planoTratamento = toPlanoTratamentoEntity(createDTO, paciente);
        PlanoTratamento planoSalvo = planoTratamentoRepository.save(planoTratamento);

        log.info("Plano de tratamento criado com ID: {}", planoSalvo.getId());
        return toPlanoTratamentoResponseDTO(planoSalvo);
    }

    @Transactional(readOnly = true)
    public List<PlanoTratamentoResponseDTO> listarPlanosTratamentoPorPaciente(Long pacienteId) {
        log.info("Listando planos de tratamento para paciente ID: {}", pacienteId);

        if (!repository.existsById(pacienteId)) {
            throw new PacienteNotFoundException("Paciente não encontrado com ID: " + pacienteId);
        }

        return planoTratamentoRepository.findByPacienteId(pacienteId)
                .stream()
                .map(this::toPlanoTratamentoResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PlanoTratamentoResponseDTO buscarPlanoTratamentoPorId(Long planoId) {
        log.info("Buscando plano de tratamento por ID: {}", planoId);

        PlanoTratamento planoTratamento = planoTratamentoRepository.findById(planoId)
                .orElseThrow(() -> new RuntimeException("Plano de tratamento não encontrado com ID: " + planoId));

        return toPlanoTratamentoResponseDTO(planoTratamento);
    }

    @Transactional
    public PlanoTratamentoResponseDTO atualizarPlanoTratamento(Long planoId, PlanoTratamentoUpdateDTO updateDTO) {
        log.info("Atualizando plano de tratamento ID: {}", planoId);

        PlanoTratamento planoTratamento = planoTratamentoRepository.findById(planoId)
                .orElseThrow(() -> new RuntimeException("Plano de tratamento não encontrado com ID: " + planoId));

        updatePlanoTratamentoFromDTO(planoTratamento, updateDTO);
        PlanoTratamento planoAtualizado = planoTratamentoRepository.save(planoTratamento);

        log.info("Plano de tratamento ID: {} atualizado", planoId);
        return toPlanoTratamentoResponseDTO(planoAtualizado);
    }

    @Transactional
    public void excluirPlanoTratamento(Long planoId) {
        log.info("Excluindo plano de tratamento ID: {}", planoId);

        if (!planoTratamentoRepository.existsById(planoId)) {
            throw new RuntimeException("Plano de tratamento não encontrado com ID: " + planoId);
        }

        planoTratamentoRepository.deleteById(planoId);
        log.info("Plano de tratamento ID: {} excluído", planoId);
    }

    @Transactional(readOnly = true)
    public PlanoTratamentoPacienteDTO obterResumoPlanosTratamento(Long pacienteId) {
        log.info("Obtendo resumo de planos de tratamento para paciente ID: {}", pacienteId);

        Paciente paciente = repository.findById(pacienteId)
                .orElseThrow(() -> new PacienteNotFoundException("Paciente não encontrado com ID: " + pacienteId));

        List<PlanoTratamento> planos = planoTratamentoRepository.findByPacienteId(pacienteId);

        Double valorTotalGeral = planos.stream()
                .mapToDouble(PlanoTratamento::getValorTotal)
                .sum();

        List<PlanoTratamentoResponseDTO> planosDTO = planos.stream()
                .map(this::toPlanoTratamentoResponseDTO)
                .collect(Collectors.toList());

        return PlanoTratamentoPacienteDTO.builder()
                .pacienteId(paciente.getId())
                .pacienteNome(paciente.getNome())
                .planosTratamento(planosDTO)
                .valorTotalGeral(valorTotalGeral)
                .build();
    }

    // ========== HISTÓRICO COMPLETO ==========

    @Transactional(readOnly = true)
    public PacienteHistoricoDTO obterHistoricoCompleto(Long id) {
        log.info("Obtendo histórico completo do paciente ID: {}", id);

        Paciente paciente = repository.findById(id)
                .orElseThrow(() -> new PacienteNotFoundException("Paciente não encontrado com ID: " + id));

        List<PlanoTratamentoResponseDTO> planos = listarPlanosTratamentoPorPaciente(id);
        AnamneseDTO anamnese = buscarAnamnesePorPacienteId(id);

        return PacienteHistoricoDTO.builder()
                .dadosPessoais(toResponseDTO(paciente))
                .anamnese(anamnese)
                .planosTratamento(planos)
                .dataCadastro(paciente.getDataCadastro())
                .dataUltimaAtualizacao(paciente.getDataAtualizacao())
                .build();
    }

    // ========== VALIDAÇÕES ==========

    private void validarUnicidadeCriacao(PacienteCreateDTO createDTO) {
        validarCpfUnico(createDTO.cpf(), null);
        validarProntuarioUnico(createDTO.prontuario(), null); // ✅ Agora funciona
    }

    private void validarUnicidadeAtualizacao(Long id, PacienteUpdateDTO updateDTO) {
        validarCpfUnico(updateDTO.cpf(), id);
        validarProntuarioUnico(updateDTO.prontuario(), id); // ✅ Agora funciona
    }

    private void validarCpfUnico(String cpf, Long idExcluir) {
        if (cpf != null && !cpf.trim().isEmpty()) {
            boolean cpfExiste = (idExcluir == null)
                    ? repository.existsByCpf(cpf)
                    : repository.existsByCpfAndIdNot(cpf, idExcluir);

            if (cpfExiste) {
                throw new PacienteDuplicadoException("Já existe um paciente com este CPF: " + cpf);
            }
        }
    }

    private void validarProntuarioUnico(String prontuario, Long idExcluir) {
        if (prontuario != null && !prontuario.trim().isEmpty()) {
            boolean prontuarioExiste = (idExcluir == null)
                    ? repository.existsByProntuario(prontuario)
                    : repository.existsByProntuarioAndIdNot(prontuario, idExcluir);

            if (prontuarioExiste) {
                throw new PacienteDuplicadoException("Já existe um paciente com este prontuário: " + prontuario);
            }
        }
    }

    // ========== MÉTODOS DE MAPEAMENTO ==========

    private Paciente toEntity(PacienteCreateDTO dto) {
        return Paciente.builder()
                .nome(dto.nome())
                .cpf(dto.cpf())
                .email(dto.email())
                .telefone(dto.telefone())
                .dataNascimento(dto.dataNascimento())
                .sexo(dto.sexo())
                .estadoCivil(dto.estadoCivil())
                .rg(dto.rg())
                .orgaoExpedidor(dto.orgaoExpedidor())
                .profissao(dto.profissao())
                .naturalidade(dto.naturalidade())
                .nacionalidade(dto.nacionalidade())
                .convenio(dto.convenio())
                .prontuario(dto.prontuario())
                .numeroCarteirinha(dto.numeroCarteirinha())
                .endereco(dto.endereco() != null ?
                        Paciente.Endereco.builder()
                                .logradouro(dto.endereco().logradouro())
                                .numero(dto.endereco().numero())
                                .complemento(dto.endereco().complemento())
                                .bairro(dto.endereco().bairro())
                                .cidade(dto.endereco().cidade())
                                .estado(dto.endereco().estado())
                                .cep(dto.endereco().cep())
                                .build() : null)
                .contatoEmergencia(dto.contatoEmergencia() != null ?
                        Paciente.ContatoEmergencia.builder()
                                .nome(dto.contatoEmergencia().nome())
                                .telefone(dto.contatoEmergencia().telefone())
                                .parentesco(dto.contatoEmergencia().parentesco())
                                .build() : null)
                .responsavel(dto.responsavel() != null ?
                        Paciente.Responsavel.builder()
                                .nome(dto.responsavel().nome())
                                .rg(dto.responsavel().rg())
                                .orgaoExpedidor(dto.responsavel().orgaoExpedidor())
                                .cpf(dto.responsavel().cpf())
                                .estadoCivil(dto.responsavel().estadoCivil())
                                .nomeConjuge(dto.responsavel().nomeConjuge())
                                .cpfConjuge(dto.responsavel().cpfConjuge())
                                .build() : null)
                .prontuario(dto.prontuario())
                .indicadoPor(dto.indicadoPor())
                .observacoesGerais(dto.observacoesGerais())
                .status(StatusPaciente.ATIVO)
                .build();
    }

    private void updateEntityFromDTO(Paciente entity, PacienteUpdateDTO dto) {
        entity.setNome(dto.nome());
        entity.setCpf(dto.cpf());
        entity.setEmail(dto.email());
        entity.setTelefone(dto.telefone());
        entity.setDataNascimento(dto.dataNascimento());
        entity.setSexo(dto.sexo());
        entity.setEstadoCivil(dto.estadoCivil());
        entity.setRg(dto.rg());
        entity.setOrgaoExpedidor(dto.orgaoExpedidor());
        entity.setProfissao(dto.profissao());
        entity.setNaturalidade(dto.naturalidade());
        entity.setNacionalidade(dto.nacionalidade());
        entity.setProntuario(dto.prontuario());
        entity.setConvenio(dto.convenio());
        entity.setNumeroCarteirinha(dto.numeroCarteirinha());

        if (dto.endereco() != null) {
            if (entity.getEndereco() == null) {
                entity.setEndereco(new Paciente.Endereco());
            }
            entity.getEndereco().setLogradouro(dto.endereco().logradouro());
            entity.getEndereco().setNumero(dto.endereco().numero());
            entity.getEndereco().setComplemento(dto.endereco().complemento());
            entity.getEndereco().setBairro(dto.endereco().bairro());
            entity.getEndereco().setCidade(dto.endereco().cidade());
            entity.getEndereco().setEstado(dto.endereco().estado());
            entity.getEndereco().setCep(dto.endereco().cep());
        }

        entity.setIndicadoPor(dto.indicadoPor());
        entity.setObservacoesGerais(dto.observacoesGerais());
    }

    private PacienteResponseDTO toResponseDTO(Paciente entity) {
        return PacienteResponseDTO.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .cpf(entity.getCpf())
                .email(entity.getEmail())
                .telefone(entity.getTelefone())
                .dataNascimento(entity.getDataNascimento())
                .sexo(entity.getSexo())
                .estadoCivil(entity.getEstadoCivil())
                .rg(entity.getRg())
                .orgaoExpedidor(entity.getOrgaoExpedidor())
                .profissao(entity.getProfissao())
                .naturalidade(entity.getNaturalidade())
                .nacionalidade(entity.getNacionalidade())
                .convenio(entity.getConvenio())
                .numeroCarteirinha(entity.getNumeroCarteirinha())
                .endereco(entity.getEndereco() != null ?
                        EnderecoDTO.builder()
                                .logradouro(entity.getEndereco().getLogradouro())
                                .numero(entity.getEndereco().getNumero())
                                .complemento(entity.getEndereco().getComplemento())
                                .bairro(entity.getEndereco().getBairro())
                                .cidade(entity.getEndereco().getCidade())
                                .estado(entity.getEndereco().getEstado())
                                .cep(entity.getEndereco().getCep())
                                .build() : null)
                .contatoEmergencia(entity.getContatoEmergencia() != null ?
                        ContatoEmergenciaDTO.builder()
                                .nome(entity.getContatoEmergencia().getNome())
                                .telefone(entity.getContatoEmergencia().getTelefone())
                                .parentesco(entity.getContatoEmergencia().getParentesco())
                                .build() : null)
                .responsavel(entity.getResponsavel() != null ?
                        ResponsavelDTO.builder()
                                .nome(entity.getResponsavel().getNome())
                                .rg(entity.getResponsavel().getRg())
                                .orgaoExpedidor(entity.getResponsavel().getOrgaoExpedidor())
                                .cpf(entity.getResponsavel().getCpf())
                                .estadoCivil(entity.getResponsavel().getEstadoCivil())
                                .nomeConjuge(entity.getResponsavel().getNomeConjuge())
                                .cpfConjuge(entity.getResponsavel().getCpfConjuge())
                                .build() : null)
                .prontuario(entity.getProntuario())
                .indicadoPor(entity.getIndicadoPor())
                .observacoesGerais(entity.getObservacoesGerais())
                .status(entity.getStatus())
                .dataCadastro(entity.getDataCadastro())
                .dataAtualizacao(entity.getDataAtualizacao())
                .build();
    }

    private PacienteListDTO toListDTO(Paciente entity) {
        return PacienteListDTO.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .telefone(entity.getTelefone())
                .email(entity.getEmail())
                .dataNascimento(entity.getDataNascimento())
                .status(entity.getStatus())
                .build();
    }

    private PlanoTratamento toPlanoTratamentoEntity(PlanoTratamentoCreateDTO dto, Paciente paciente) {
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

    private void updatePlanoTratamentoFromDTO(PlanoTratamento entity, PlanoTratamentoUpdateDTO dto) {
        entity.setDente(dto.dente());
        entity.setProcedimento(dto.procedimento());
        entity.setValor(dto.valor());
        entity.setObservacao(dto.observacao());
        entity.setValorTotal(dto.valorTotal());
    }

    private PlanoTratamentoResponseDTO toPlanoTratamentoResponseDTO(PlanoTratamento entity) {
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