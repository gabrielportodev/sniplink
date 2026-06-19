package me.gabrielporto.sniplink.short_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "username é obrigatório!")
        @Size(min = 3, max = 50, message = "username deve ter entre 3 e 50 caracteres")
        String username,
        @NotBlank(message = "password é obrigatório!")
        @Size(min = 6, max = 100, message = "password deve ter no mínimo 6 caracteres")
        String password
        ) {

}
