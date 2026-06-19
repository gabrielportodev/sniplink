package me.gabrielporto.sniplink.short_service.exception;

public class UsernameAlreadyExistsException extends RuntimeException {

    public UsernameAlreadyExistsException(String username) {
        super("Nome de usuário já está em uso: " + username);
    }

}
