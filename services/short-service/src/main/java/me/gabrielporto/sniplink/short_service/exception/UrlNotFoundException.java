package me.gabrielporto.sniplink.short_service.exception;

public class UrlNotFoundException extends RuntimeException {

    public UrlNotFoundException(String shortCode) {
        super("Nenhuma URL encontrada para o código: " + shortCode);
    }

}
