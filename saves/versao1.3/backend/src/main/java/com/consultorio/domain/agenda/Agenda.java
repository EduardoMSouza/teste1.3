package com.consultorio.domain.agenda;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "agendamentos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "paciente_id")
    private Long pacienteId;

    @Column(name = "paciente_nome", nullable = false)
    private String pacienteNome;

    @Column(name = "dentista_id", nullable = false)
    private Long dentistaId;

    @Column(name = "dentista_nome", nullable = false)
    private String dentistaNome;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusAgendamento status;

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "telefone")
    private String telefone;

    @Column(name = "email")
    private String email;

    @CreationTimestamp
    @Column(name = "data_cadastro", nullable = false, updatable = false)
    private LocalDateTime dataCadastro;

    public enum StatusAgendamento {
        AGENDADO, CONFIRMADO, CONCLUIDO, CANCELADO
    }
}