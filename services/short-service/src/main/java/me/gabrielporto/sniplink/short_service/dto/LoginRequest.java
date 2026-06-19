package me.gabrielporto.sniplink.short_service.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "username é obrigatório!")
        String username,
        @NotBlank(message = "password é obrigatório!")
        String password
        ) {

}
