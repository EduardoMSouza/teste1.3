package com.consultorio.domain.paciente.erro;

public class PacienteDuplicadoException extends RuntimeException {
    public PacienteDuplicadoException(String message) {
        super(message);
    }
}
