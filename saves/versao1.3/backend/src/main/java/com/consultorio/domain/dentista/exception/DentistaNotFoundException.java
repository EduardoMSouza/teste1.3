// DentistaNotFoundException.java
package com.consultorio.domain.dentista.exception;

public class DentistaNotFoundException extends RuntimeException {
    public DentistaNotFoundException(String message) {
        super(message);
    }
}