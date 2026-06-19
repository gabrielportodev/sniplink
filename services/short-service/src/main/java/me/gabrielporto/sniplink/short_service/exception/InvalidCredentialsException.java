package me.gabrielporto.sniplink.short_service.exception;

public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException() {
        super("Nome de usuário ou senha inválidos");
    }

}
