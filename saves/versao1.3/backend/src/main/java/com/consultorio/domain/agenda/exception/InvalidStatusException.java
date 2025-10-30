// InvalidStatusException.java
package com.consultorio.domain.agenda.exception;

public class InvalidStatusException extends RuntimeException {
    public InvalidStatusException(String message) {
        super(message);
    }
}