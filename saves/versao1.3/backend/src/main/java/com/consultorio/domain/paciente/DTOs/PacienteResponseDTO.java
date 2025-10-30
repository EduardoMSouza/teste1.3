package com.consultorio.domain.paciente.DTOs;

import com.consultorio.domain.paciente.Enums.EstadoCivil;
import com.consultorio.domain.paciente.Enums.Sexo;
import com.consultorio.domain.paciente.Enums.StatusPaciente;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
public record PacienteResponseDTO(
        Long id,
        String nome,
        String cpf,
        String email,
        String telefone,
        LocalDate dataNascimento,
        Sexo sexo,
        EstadoCivil estadoCivil,
        String rg,
        String orgaoExpedidor,
        String profissao,
        String naturalidade,
        String nacionalidade,
        String prontuario,
        String convenio,
        String numeroCarteirinha,
        EnderecoDTO endereco,
        ContatoEmergenciaDTO contatoEmergencia,
        ResponsavelDTO responsavel,
        AnamneseDTO anamnese,
        String indicadoPor,
        String observacoesGerais,
        StatusPaciente status,
        LocalDateTime dataCadastro,
        LocalDateTime dataAtualizacao
) {}