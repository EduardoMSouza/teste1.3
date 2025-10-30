package com.consultorio.domain.paciente.DTOs;

import jakarta.validation.constraints.Size;
import lombok.Builder;

import java.util.ArrayList;
import java.util.List;

@Builder
public record AnamneseDTO(
        // === HISTÓRICO MÉDICO ===
        List<@Size(max = 100, message = "Doença deve ter no máximo 100 caracteres") String> doencasPreexistentes,

        List<@Size(max = 100, message = "Alergia deve ter no máximo 100 caracteres") String> alergias,

        List<@Size(max = 100, message = "Medicamento deve ter no máximo 100 caracteres") String> medicamentosEmUso,

        // === HÁBITOS ===
        Boolean fumante,
        Integer cigarrosPorDia,
        Integer anosFumando,

        Boolean consomeAlcool,
        @Size(max = 50, message = "Frequência do álcool deve ter no máximo 50 caracteres")
        String frequenciaAlcool,

        // === HISTÓRICO CIRÚRGICO ===
        Boolean historicoCirurgico,
        @Size(max = 500, message = "Detalhes das cirurgias deve ter no máximo 500 caracteres")
        String detalhesCirurgias,

        // === PROBLEMAS ESPECÍFICOS ===
        Boolean problemasCardiacos,
        Boolean problemasRenais,
        Boolean problemasHepaticos,
        Boolean problemasRespiratorios,
        Boolean diabetes,
        Boolean hipertensao,
        Boolean problemasCoagulacao,

        // === QUEIXA PRINCIPAL ===
        @Size(max = 500, message = "Queixa principal deve ter no máximo 500 caracteres")
        String queixaPrincipal,

        @Size(max = 1000, message = "Evolução da doença atual deve ter no máximo 1000 caracteres")
        String evolucaoDoencaAtual,

        // === EXAME CLÍNICO ===
        ExameClinicoDTO exameClinico
) {
    public AnamneseDTO {
        // Inicializa listas vazias se forem nulas
        if (doencasPreexistentes == null) doencasPreexistentes = new ArrayList<>();
        if (alergias == null) alergias = new ArrayList<>();
        if (medicamentosEmUso == null) medicamentosEmUso = new ArrayList<>();
    }
}