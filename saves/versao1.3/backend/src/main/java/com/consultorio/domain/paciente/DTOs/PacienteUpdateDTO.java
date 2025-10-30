package com.consultorio.domain.paciente.DTOs;

import com.consultorio.domain.paciente.Enums.EstadoCivil;
import com.consultorio.domain.paciente.Enums.Sexo;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record PacienteUpdateDTO(
        // === DADOS PESSOAIS OBRIGATÓRIOS ===
        @NotBlank(message = "Nome é obrigatório")
        @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
        String nome,

        @Pattern(regexp = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}", message = "CPF deve estar no formato 000.000.000-00")
        @Size(min = 14, max = 14, message = "CPF deve ter 14 caracteres")
        String cpf, // ✅ ADICIONADO


        @Pattern(regexp = "\\(\\d{2}\\)\\s\\d{4,5}-\\d{4}", message = "Telefone deve estar no formato (00) 00000-0000")
        @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres")
        String telefone,

        @NotNull(message = "Data de nascimento é obrigatória")
        @Past(message = "Data de nascimento deve ser uma data passada")
        LocalDate dataNascimento,


        Sexo sexo,


        EstadoCivil estadoCivil,

        // === DADOS PESSOAIS OPCIONAIS ===
        @Email(message = "Email deve ser válido")
        @Size(max = 100, message = "Email deve ter no máximo 100 caracteres")
        String email,

        @Size(max = 20, message = "RG deve ter no máximo 20 caracteres")
        String rg,

        @Size(max = 50, message = "Órgão expedidor deve ter no máximo 50 caracteres")
        String orgaoExpedidor,

        @Size(max = 100, message = "Profissão deve ter no máximo 100 caracteres")
        String profissao,

        @Size(max = 50, message = "Naturalidade deve ter no máximo 50 caracteres")
        String naturalidade,

        @Size(max = 50, message = "Nacionalidade deve ter no máximo 50 caracteres")
        String nacionalidade,

        // === PRONTUÁRIO ===
        @Size(max = 50, message = "Prontuário deve ter no máximo 50 caracteres")
        String prontuario,

        // === CONVÊNIO ===
        @Size(max = 100, message = "Convênio deve ter no máximo 100 caracteres")
        String convenio,

        @Size(max = 50, message = "Número da carteirinha deve ter no máximo 50 caracteres")
        String numeroCarteirinha,

        // === ENDEREÇO ===
        @Valid
        EnderecoDTO endereco,

        // === CONTATO DE EMERGÊNCIA ===
        @Valid
        ContatoEmergenciaDTO contatoEmergencia,

        // === RESPONSÁVEL (opcional) ===
        @Valid
        ResponsavelDTO responsavel,

        // === DADOS ADICIONAIS ===
        @Size(max = 100, message = "Indicado por deve ter no máximo 100 caracteres")
        String indicadoPor,

        @Size(max = 1000, message = "Observações gerais deve ter no máximo 1000 caracteres")
        String observacoesGerais
) {}