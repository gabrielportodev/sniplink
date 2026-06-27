package me.gabrielporto.sniplink.short_service.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.gabrielporto.sniplink.short_service.dto.CreateUrlRequest;
import me.gabrielporto.sniplink.short_service.dto.UrlResponse;
import me.gabrielporto.sniplink.short_service.service.RateLimiter;
import me.gabrielporto.sniplink.short_service.service.UrlService;

@RestController
@RequestMapping("/api/url")
@RequiredArgsConstructor
public class UrlController {

    private final UrlService urlService;
    private final RateLimiter rateLimiter;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UrlResponse create(@Valid @RequestBody CreateUrlRequest request,
            @AuthenticationPrincipal UUID userId) {
        rateLimiter.consume();
        return urlService.createShortUrl(request, userId);
    }

    @GetMapping
    public List<UrlResponse> list(@AuthenticationPrincipal UUID userId) {
        return urlService.listByUser(userId);
    }

}
