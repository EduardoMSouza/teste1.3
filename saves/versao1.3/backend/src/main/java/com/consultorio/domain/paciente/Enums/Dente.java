package com.consultorio.domain.paciente.Enums;

import lombok.Getter;
import lombok.Setter;

@Getter
public enum Dente {
    // Dentes Permanentes
    DENTE_11("11 - Incisivo Central Superior Direito"),
    DENTE_12("12 - Incisivo Lateral Superior Direito"),
    DENTE_13("13 - Canino Superior Direito"),
    DENTE_14("14 - Primeiro Pré-Molar Superior Direito"),
    DENTE_15("15 - Segundo Pré-Molar Superior Direito"),
    DENTE_16("16 - Primeiro Molar Superior Direito"),
    DENTE_17("17 - Segundo Molar Superior Direito"),
    DENTE_18("18 - Terceiro Molar Superior Direito"),

    DENTE_21("21 - Incisivo Central Superior Esquerdo"),
    DENTE_22("22 - Incisivo Lateral Superior Esquerdo"),
    DENTE_23("23 - Canino Superior Esquerdo"),
    DENTE_24("24 - Primeiro Pré-Molar Superior Esquerdo"),
    DENTE_25("25 - Segundo Pré-Molar Superior Esquerdo"),
    DENTE_26("26 - Primeiro Molar Superior Esquerdo"),
    DENTE_27("27 - Segundo Molar Superior Esquerdo"),
    DENTE_28("28 - Terceiro Molar Superior Esquerdo"),

    DENTE_31("31 - Incisivo Central Inferior Esquerdo"),
    DENTE_32("32 - Incisivo Lateral Inferior Esquerdo"),
    DENTE_33("33 - Canino Inferior Esquerdo"),
    DENTE_34("34 - Primeiro Pré-Molar Inferior Esquerdo"),
    DENTE_35("35 - Segundo Pré-Molar Inferior Esquerdo"),
    DENTE_36("36 - Primeiro Molar Inferior Esquerdo"),
    DENTE_37("37 - Segundo Molar Inferior Esquerdo"),
    DENTE_38("38 - Terceiro Molar Inferior Esquerdo"),

    DENTE_41("41 - Incisivo Central Inferior Direito"),
    DENTE_42("42 - Incisivo Lateral Inferior Direito"),
    DENTE_43("43 - Canino Inferior Direito"),
    DENTE_44("44 - Primeiro Pré-Molar Inferior Direito"),
    DENTE_45("45 - Segundo Pré-Molar Inferior Direito"),
    DENTE_46("46 - Primeiro Molar Inferior Direito"),
    DENTE_47("47 - Segundo Molar Inferior Direito"),
    DENTE_48("48 - Terceiro Molar Inferior Direito"),

    // Dentes Decíduos (de leite)
    DENTE_51("51 - Incisivo Central Superior Direito Decíduo"),
    DENTE_52("52 - Incisivo Lateral Superior Direito Decíduo"),
    DENTE_53("53 - Canino Superior Direito Decíduo"),
    DENTE_54("54 - Primeiro Molar Superior Direito Decíduo"),
    DENTE_55("55 - Segundo Molar Superior Direito Decíduo"),

    DENTE_61("61 - Incisivo Central Superior Esquerdo Decíduo"),
    DENTE_62("62 - Incisivo Lateral Superior Esquerdo Decíduo"),
    DENTE_63("63 - Canino Superior Esquerdo Decíduo"),
    DENTE_64("64 - Primeiro Molar Superior Esquerdo Decíduo"),
    DENTE_65("65 - Segundo Molar Superior Esquerdo Decíduo"),

    DENTE_71("71 - Incisivo Central Inferior Esquerdo Decíduo"),
    DENTE_72("72 - Incisivo Lateral Inferior Esquerdo Decíduo"),
    DENTE_73("73 - Canino Inferior Esquerdo Decíduo"),
    DENTE_74("74 - Primeiro Molar Inferior Esquerdo Decíduo"),
    DENTE_75("75 - Segundo Molar Inferior Esquerdo Decíduo"),

    DENTE_81("81 - Incisivo Central Inferior Direito Decíduo"),
    DENTE_82("82 - Incisivo Lateral Inferior Direito Decíduo"),
    DENTE_83("83 - Canino Inferior Direito Decíduo"),
    DENTE_84("84 - Primeiro Molar Inferior Direito Decíduo"),
    DENTE_85("85 - Segundo Molar Inferior Direito Decíduo"),

    // Outros
    PROTESE_TOTAL("Prótese Total"),
    PROTESE_PARCIAL("Prótese Parcial"),
    IMPLANTE("Implante"),
    OUTRO("Outro");

    private final String descricao;

    Dente(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
