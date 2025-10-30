// Dentista.java
package com.consultorio.domain.dentista;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dentistas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dentista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private String nome;

    @Column(unique = true, nullable = true)
    private String cro;

    @Column(nullable = true)
    private String especialidade;
    @Column(nullable = true)
    private String telefone;
    @Column(nullable = true)
    private String email;

    @Builder.Default
    private Boolean ativo = true;

    public Dentista(Long id) {
        this.id = id;
    }
}