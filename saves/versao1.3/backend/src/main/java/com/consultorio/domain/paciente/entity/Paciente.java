package com.consultorio.domain.paciente.entity;

import com.consultorio.domain.paciente.Enums.EstadoCivil;
import com.consultorio.domain.paciente.Enums.Sexo;
import com.consultorio.domain.paciente.Enums.StatusPaciente;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pacientes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // === DADOS PESSOAIS BÁSICOS ===
    @Column(nullable = false, length = 100)
    private String nome;

    @Column(unique = true, length = 14)
    private String cpf;

    @Column(length = 20)
    private String rg;

    @Column(length = 50)
    private String orgaoExpedidor;

    @Column(unique = true, length = 100)
    private String email;

    @Column(length = 20)
    private String telefone;

    @Column(nullable = false)
    private LocalDate dataNascimento;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Sexo sexo;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private EstadoCivil estadoCivil;

    // === ENDEREÇO ===
    @Embedded
    private Endereco endereco;

    // === PROFISSIONAL ===
    @Column(length = 100)
    private String profissao;

    @Column(length = 50)
    private String naturalidade;

    @Column(length = 50)
    private String nacionalidade;

    // === CONVÊNIO ===
    @Column(length = 100)
    private String convenio;

    @Column(length = 50)
    private String numeroCarteirinha;

    // === CONTATO DE EMERGÊNCIA ===
    @Embedded
    private ContatoEmergencia contatoEmergencia;

    // === RESPONSÁVEL (para menores ou dependentes) ===
    @Embedded
    private Responsavel responsavel;

    // === ANAMNESE ===
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "anamnese_id")
    private Anamnese anamnese;

    // === DADOS DE CONTROLE ===
    @Column(length = 20)
    private String prontuario;

    @Column(length = 100)
    private String indicadoPor;

    @Column(length = 1000)
    private String observacoesGerais;

    // === TIMESTAMPS ===
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime dataCadastro;

    @UpdateTimestamp
    private LocalDateTime dataAtualizacao;

    // === STATUS ===
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private StatusPaciente status;

    // === MÉTODOS ÚTEIS ===
    public int getIdade() {
        if (dataNascimento == null) return 0;
        return LocalDate.now().getYear() - dataNascimento.getYear();
    }

    public boolean isMenorDeIdade() {
        return getIdade() < 18;
    }

    // === CLASSES EMBUTIDAS ===

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Endereco {
        @Column(name = "endereco_logradouro", length = 200)  // Adicionei prefixo
        private String logradouro;

        @Column(name = "endereco_numero", length = 10)       // Adicionei prefixo
        private String numero;

        @Column(name = "endereco_complemento", length = 100) // Adicionei prefixo
        private String complemento;

        @Column(name = "endereco_bairro", length = 100)      // Adicionei prefixo
        private String bairro;

        @Column(name = "endereco_cidade", length = 100)      // Adicionei prefixo
        private String cidade;

        @Column(name = "endereco_estado", length = 2)        // Adicionei prefixo
        private String estado;

        @Column(name = "endereco_cep", length = 9)           // Adicionei prefixo
        private String cep;
    }

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ContatoEmergencia {
        @Column(name = "contato_emergencia_nome", length = 100)
        private String nome;

        @Column(name = "contato_emergencia_telefone", length = 20)
        private String telefone;

        @Column(name = "contato_emergencia_parentesco", length = 50)
        private String parentesco;
    }

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Responsavel {
        @Column(name = "responsavel_nome", length = 100)
        private String nome;

        @Column(name = "responsavel_rg", length = 20)
        private String rg;

        @Column(name = "responsavel_orgao_expedidor", length = 50)
        private String orgaoExpedidor;

        @Column(name = "responsavel_cpf", length = 14)
        private String cpf;

        @Enumerated(EnumType.STRING)
        @Column(name = "responsavel_estado_civil", length = 20)
        private EstadoCivil estadoCivil;

        @Column(name = "responsavel_nome_conjuge", length = 100)
        private String nomeConjuge;

        @Column(name = "responsavel_cpf_conjuge", length = 14)
        private String cpfConjuge;
    }
}