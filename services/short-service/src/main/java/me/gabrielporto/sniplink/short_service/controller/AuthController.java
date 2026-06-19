package me.gabrielporto.sniplink.short_service.controller;

import java.util.UUID;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.gabrielporto.sniplink.short_service.config.AuthCookieFactory;
import me.gabrielporto.sniplink.short_service.dto.LoginRequest;
import me.gabrielporto.sniplink.short_service.dto.RegisterRequest;
import me.gabrielporto.sniplink.short_service.dto.UserResponse;
import me.gabrielporto.sniplink.short_service.service.UserService;
import me.gabrielporto.sniplink.short_service.service.UserService.AuthResult;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthCookieFactory authCookieFactory;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResult result = userService.register(request);
        return authenticated(HttpStatus.CREATED, result);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResult result = userService.login(request);
        return authenticated(HttpStatus.OK, result);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, authCookieFactory.clear().toString())
                .build();
    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal UUID userId) {
        return userService.me(userId);
    }

    private ResponseEntity<UserResponse> authenticated(HttpStatus status, AuthResult result) {
        return ResponseEntity.status(status)
                .header(HttpHeaders.SET_COOKIE, authCookieFactory.create(result.token()).toString())
                .body(result.user());
    }

}
