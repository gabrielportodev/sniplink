package me.gabrielporto.sniplink.short_service.exception;

public class AliasAlreadyExistsException extends RuntimeException {

    public AliasAlreadyExistsException(String alias) {
        super("Alias já está em uso: " + alias);
    }

}
