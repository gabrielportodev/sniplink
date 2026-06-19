package me.gabrielporto.sniplink.short_service.controller;

import java.net.URI;
import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import me.gabrielporto.sniplink.short_service.dto.ClickEventMessage;
import me.gabrielporto.sniplink.short_service.service.ClickEventPublisher;
import me.gabrielporto.sniplink.short_service.service.UrlService;

@RestController
@RequiredArgsConstructor
public class RedirectController {

    private final UrlService urlService;
    private final ClickEventPublisher clickEventPublisher;

    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirect(@PathVariable String shortCode, HttpServletRequest request) {
        String originalUrl = urlService.resolveOriginalUrl(shortCode);

        clickEventPublisher.publish(new ClickEventMessage(
                shortCode,
                extractClientIp(request),
                request.getHeader("User-Agent"),
                LocalDateTime.now()
        ));

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(originalUrl))
                .build();
    }

    private String extractClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

}
