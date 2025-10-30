package com.consultorio.domain.paciente.entity;

import com.consultorio.domain.paciente.Enums.Dente;
import com.consultorio.domain.paciente.Enums.StatusPlanoTratamento;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "plano_tratamento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanoTratamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Dente dente;

    @Column(nullable = false, length = 200)
    private String procedimento;

    @Column(nullable = false)
    private Double valor;

    @Column(length = 500)
    private String observacao;

    @Column(nullable = false)
    private Double valorTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private StatusPlanoTratamento status = StatusPlanoTratamento.ORCAMENTO;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime dataCriacao;

    @UpdateTimestamp
    private LocalDateTime dataAtualizacao;

    @Column
    private LocalDateTime dataInicio;

    @Column
    private LocalDateTime dataConclusao;

    @Column
    private LocalDateTime dataCancelamento;

    @Column(length = 1000)
    private String motivoCancelamento;

    // Métodos utilitários
    public boolean isAtivo() {
        return status.isAtivo();
    }

    public boolean isConcluido() {
        return status.isConcluido();
    }

    public boolean isCancelado() {
        return status.isCancelado();
    }

    public boolean podeSerEditado() {
        return status.podeSerEditado();
    }

    public boolean podeSerConcluido() {
        return status.podeSerConcluido();
    }

    public boolean podeSerCancelado() {
        return status.podeSerCancelado();
    }

    public void concluir() {
        if (podeSerConcluido()) {
            this.status = StatusPlanoTratamento.CONCLUIDO;
            this.dataConclusao = LocalDateTime.now();
        } else {
            throw new IllegalStateException("Não é possível concluir um plano com status: " + status);
        }
    }

    public void cancelar(String motivo) {
        if (podeSerCancelado()) {
            this.status = StatusPlanoTratamento.CANCELADO;
            this.dataCancelamento = LocalDateTime.now();
            this.motivoCancelamento = motivo;
        } else {
            throw new IllegalStateException("Não é possível cancelar um plano com status: " + status);
        }
    }

    public void ativar() {
        this.status = StatusPlanoTratamento.ATIVO;
        this.dataInicio = LocalDateTime.now();
    }
}