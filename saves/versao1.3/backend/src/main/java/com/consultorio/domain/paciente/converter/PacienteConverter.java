package com.consultorio.domain.paciente.converter;

import com.consultorio.domain.paciente.DTOs.*;
import com.consultorio.domain.paciente.entity.Paciente;
import org.springframework.stereotype.Component;

@Component
public class PacienteConverter {

    // ========== ENTRADAS ==========

    public PacienteConvert fromEntity(Paciente paciente) {
        return new PacienteConvert(paciente);
    }

    public PacienteConvert fromCreate(PacienteCreateDTO dto) {
        return new PacienteConvert(dto);
    }

    public PacienteConvert fromUpdate(PacienteUpdateDTO dto) {
        return new PacienteConvert(dto);
    }

    // ========== CLASSE DE CONVERSÃO ==========

    public static class PacienteConvert {
        private Paciente paciente;
        private PacienteCreateDTO createDTO;
        private PacienteUpdateDTO updateDTO;

        // Constructor para Entity → DTO
        public PacienteConvert(Paciente paciente) {
            this.paciente = paciente;
        }

        // Constructor para CreateDTO → Entity
        public PacienteConvert(PacienteCreateDTO createDTO) {
            this.createDTO = createDTO;
        }

        // Constructor para UpdateDTO → Entity
        public PacienteConvert(PacienteUpdateDTO updateDTO) {
            this.updateDTO = updateDTO;
        }

        // ========== CONVERSÕES PARA DTO ==========

        public PacienteResponseDTO toResponse() {
            validateEntity();

            return PacienteResponseDTO.builder()
                    .id(paciente.getId())
                    .nome(paciente.getNome())
                    .cpf(paciente.getCpf())
                    .email(paciente.getEmail())
                    .telefone(paciente.getTelefone())
                    .dataNascimento(paciente.getDataNascimento())
                    .sexo(paciente.getSexo())
                    .estadoCivil(paciente.getEstadoCivil())
                    .rg(paciente.getRg())
                    .orgaoExpedidor(paciente.getOrgaoExpedidor())
                    .profissao(paciente.getProfissao())
                    .naturalidade(paciente.getNaturalidade())
                    .nacionalidade(paciente.getNacionalidade())
                    .prontuario(paciente.getProntuario())
                    .convenio(paciente.getConvenio())
                    .numeroCarteirinha(paciente.getNumeroCarteirinha())
                    .endereco(paciente.getEndereco() != null ?
                            EnderecoDTO.builder()
                                    .logradouro(paciente.getEndereco().getLogradouro())
                                    .numero(paciente.getEndereco().getNumero())
                                    .complemento(paciente.getEndereco().getComplemento())
                                    .bairro(paciente.getEndereco().getBairro())
                                    .cidade(paciente.getEndereco().getCidade())
                                    .estado(paciente.getEndereco().getEstado())
                                    .cep(paciente.getEndereco().getCep())
                                    .build() : null)
                    .contatoEmergencia(paciente.getContatoEmergencia() != null ?
                            ContatoEmergenciaDTO.builder()
                                    .nome(paciente.getContatoEmergencia().getNome())
                                    .telefone(paciente.getContatoEmergencia().getTelefone())
                                    .parentesco(paciente.getContatoEmergencia().getParentesco())
                                    .build() : null)
                    .responsavel(paciente.getResponsavel() != null ?
                            ResponsavelDTO.builder()
                                    .nome(paciente.getResponsavel().getNome())
                                    .rg(paciente.getResponsavel().getRg())
                                    .orgaoExpedidor(paciente.getResponsavel().getOrgaoExpedidor())
                                    .cpf(paciente.getResponsavel().getCpf())
                                    .estadoCivil(paciente.getResponsavel().getEstadoCivil())
                                    .nomeConjuge(paciente.getResponsavel().getNomeConjuge())
                                    .cpfConjuge(paciente.getResponsavel().getCpfConjuge())
                                    .build() : null)
                    .indicadoPor(paciente.getIndicadoPor())
                    .observacoesGerais(paciente.getObservacoesGerais())
                    .status(paciente.getStatus())
                    .dataCadastro(paciente.getDataCadastro())
                    .dataAtualizacao(paciente.getDataAtualizacao())
                    .build();
        }

        public PacienteListDTO toList() {
            validateEntity();

            return PacienteListDTO.builder()
                    .id(paciente.getId())
                    .nome(paciente.getNome())
                    .telefone(paciente.getTelefone())
                    .email(paciente.getEmail())
                    .dataNascimento(paciente.getDataNascimento())
                    .status(paciente.getStatus())
                    .build();
        }

        // ========== CONVERSÕES PARA ENTITY ==========

        public Paciente toEntity() {
            if (createDTO != null) {
                return fromCreateDTO();
            }
            throw new IllegalStateException("Nenhum DTO disponível para conversão");
        }

        public void updateEntity(Paciente paciente) {
            if (updateDTO == null) {
                throw new IllegalStateException("UpdateDTO não disponível");
            }

            if (updateDTO.nome() != null) paciente.setNome(updateDTO.nome());
            if (updateDTO.cpf() != null) paciente.setCpf(updateDTO.cpf());
            if (updateDTO.telefone() != null) paciente.setTelefone(updateDTO.telefone());
            if (updateDTO.email() != null) paciente.setEmail(updateDTO.email());
            if (updateDTO.dataNascimento() != null) paciente.setDataNascimento(updateDTO.dataNascimento());
            if (updateDTO.sexo() != null) paciente.setSexo(updateDTO.sexo());
            if (updateDTO.estadoCivil() != null) paciente.setEstadoCivil(updateDTO.estadoCivil());
            if (updateDTO.rg() != null) paciente.setRg(updateDTO.rg());
            if (updateDTO.orgaoExpedidor() != null) paciente.setOrgaoExpedidor(updateDTO.orgaoExpedidor());
            if (updateDTO.profissao() != null) paciente.setProfissao(updateDTO.profissao());
            if (updateDTO.naturalidade() != null) paciente.setNaturalidade(updateDTO.naturalidade());
            if (updateDTO.nacionalidade() != null) paciente.setNacionalidade(updateDTO.nacionalidade());
            if (updateDTO.prontuario() != null) paciente.setProntuario(updateDTO.prontuario());
            if (updateDTO.convenio() != null) paciente.setConvenio(updateDTO.convenio());
            if (updateDTO.numeroCarteirinha() != null) paciente.setNumeroCarteirinha(updateDTO.numeroCarteirinha());
            if (updateDTO.indicadoPor() != null) paciente.setIndicadoPor(updateDTO.indicadoPor());
            if (updateDTO.observacoesGerais() != null) paciente.setObservacoesGerais(updateDTO.observacoesGerais());

            // Atualizar endereço
            if (updateDTO.endereco() != null) {
                if (paciente.getEndereco() == null) {
                    paciente.setEndereco(new Paciente.Endereco());
                }
                paciente.getEndereco().setLogradouro(updateDTO.endereco().logradouro());
                paciente.getEndereco().setNumero(updateDTO.endereco().numero());
                paciente.getEndereco().setComplemento(updateDTO.endereco().complemento());
                paciente.getEndereco().setBairro(updateDTO.endereco().bairro());
                paciente.getEndereco().setCidade(updateDTO.endereco().cidade());
                paciente.getEndereco().setEstado(updateDTO.endereco().estado());
                paciente.getEndereco().setCep(updateDTO.endereco().cep());
            }

            // Atualizar contato de emergência
            if (updateDTO.contatoEmergencia() != null) {
                if (paciente.getContatoEmergencia() == null) {
                    paciente.setContatoEmergencia(new Paciente.ContatoEmergencia());
                }
                paciente.getContatoEmergencia().setNome(updateDTO.contatoEmergencia().nome());
                paciente.getContatoEmergencia().setTelefone(updateDTO.contatoEmergencia().telefone());
                paciente.getContatoEmergencia().setParentesco(updateDTO.contatoEmergencia().parentesco());
            }

            // Atualizar responsável
            if (updateDTO.responsavel() != null) {
                if (paciente.getResponsavel() == null) {
                    paciente.setResponsavel(new Paciente.Responsavel());
                }
                paciente.getResponsavel().setNome(updateDTO.responsavel().nome());
                paciente.getResponsavel().setRg(updateDTO.responsavel().rg());
                paciente.getResponsavel().setOrgaoExpedidor(updateDTO.responsavel().orgaoExpedidor());
                paciente.getResponsavel().setCpf(updateDTO.responsavel().cpf());
                paciente.getResponsavel().setEstadoCivil(updateDTO.responsavel().estadoCivil());
                paciente.getResponsavel().setNomeConjuge(updateDTO.responsavel().nomeConjuge());
                paciente.getResponsavel().setCpfConjuge(updateDTO.responsavel().cpfConjuge());
            }
        }

        // ========== MÉTODOS PRIVADOS ==========

        private Paciente fromCreateDTO() {
            return Paciente.builder()
                    .nome(createDTO.nome())
                    .cpf(createDTO.cpf())
                    .email(createDTO.email())
                    .telefone(createDTO.telefone())
                    .dataNascimento(createDTO.dataNascimento())
                    .sexo(createDTO.sexo())
                    .estadoCivil(createDTO.estadoCivil())
                    .rg(createDTO.rg())
                    .orgaoExpedidor(createDTO.orgaoExpedidor())
                    .profissao(createDTO.profissao())
                    .naturalidade(createDTO.naturalidade())
                    .nacionalidade(createDTO.nacionalidade())
                    .prontuario(createDTO.prontuario())
                    .convenio(createDTO.convenio())
                    .numeroCarteirinha(createDTO.numeroCarteirinha())
                    .endereco(createDTO.endereco() != null ?
                            Paciente.Endereco.builder()
                                    .logradouro(createDTO.endereco().logradouro())
                                    .numero(createDTO.endereco().numero())
                                    .complemento(createDTO.endereco().complemento())
                                    .bairro(createDTO.endereco().bairro())
                                    .cidade(createDTO.endereco().cidade())
                                    .estado(createDTO.endereco().estado())
                                    .cep(createDTO.endereco().cep())
                                    .build() : null)
                    .contatoEmergencia(createDTO.contatoEmergencia() != null ?
                            Paciente.ContatoEmergencia.builder()
                                    .nome(createDTO.contatoEmergencia().nome())
                                    .telefone(createDTO.contatoEmergencia().telefone())
                                    .parentesco(createDTO.contatoEmergencia().parentesco())
                                    .build() : null)
                    .responsavel(createDTO.responsavel() != null ?
                            Paciente.Responsavel.builder()
                                    .nome(createDTO.responsavel().nome())
                                    .rg(createDTO.responsavel().rg())
                                    .orgaoExpedidor(createDTO.responsavel().orgaoExpedidor())
                                    .cpf(createDTO.responsavel().cpf())
                                    .estadoCivil(createDTO.responsavel().estadoCivil())
                                    .nomeConjuge(createDTO.responsavel().nomeConjuge())
                                    .cpfConjuge(createDTO.responsavel().cpfConjuge())
                                    .build() : null)
                    .indicadoPor(createDTO.indicadoPor())
                    .observacoesGerais(createDTO.observacoesGerais())
                    .build();
        }

        private void validateEntity() {
            if (paciente == null) {
                throw new IllegalStateException("Entidade Paciente não disponível para conversão");
            }
        }
    }
}