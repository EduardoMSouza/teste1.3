// AgendamentoNotFoundException.java
package com.consultorio.domain.agenda.exception;

public class AgendamentoNotFoundException extends RuntimeException {
    public AgendamentoNotFoundException(String message) {
        super(message);
    }
}