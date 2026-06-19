package me.gabrielporto.sniplink.short_service.dto;

import java.time.LocalDateTime;

import org.hibernate.validator.constraints.URL;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CreateUrlRequest(
        @NotBlank(message = "originalUrl é obrigatório!")
        @URL(message = "originalUrl deve ser uma URL válida!")
        String originalUrl,
        @Pattern(
                regexp = "^[a-zA-Z0-9_-]{3,30}$",
                message = "alias deve ter de 3 a 30 caracteres (letras, números, '-' ou '_')"
        )
        String alias,
        LocalDateTime expiresAt
        ) {

}
