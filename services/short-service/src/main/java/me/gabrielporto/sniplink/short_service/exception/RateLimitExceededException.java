package me.gabrielporto.sniplink.short_service.exception;

public class RateLimitExceededException extends RuntimeException {

    public RateLimitExceededException() {
        super("Muitas requisições. Tente novamente mais tarde.");
    }

}
