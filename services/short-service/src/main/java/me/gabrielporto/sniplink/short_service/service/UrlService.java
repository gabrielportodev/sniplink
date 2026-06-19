package me.gabrielporto.sniplink.short_service.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import me.gabrielporto.sniplink.short_service.dto.CreateUrlRequest;
import me.gabrielporto.sniplink.short_service.dto.UrlResponse;
import me.gabrielporto.sniplink.short_service.entity.ShortenedUrl;
import me.gabrielporto.sniplink.short_service.exception.AliasAlreadyExistsException;
import me.gabrielporto.sniplink.short_service.exception.UrlNotFoundException;
import me.gabrielporto.sniplink.short_service.repository.UrlRepository;

@Service
@RequiredArgsConstructor
public class UrlService {

    private final UrlRepository urlRepository;
    private final ShortCodeGenerator shortCodeGenerator;

    @Value("${app.base-url}")
    private String baseUrl;

    @Transactional
    public UrlResponse createShortUrl(CreateUrlRequest request, UUID userId) {
        if (hasAlias(request)) {
            return createWithAlias(request, userId);
        }
        return createWithGeneratedCode(request, userId);
    }

    private boolean hasAlias(CreateUrlRequest request) {
        return request.alias() != null && !request.alias().isBlank();
    }

    private UrlResponse createWithAlias(CreateUrlRequest request, UUID userId) {
        String alias = request.alias();
        if (urlRepository.existsByShortCode(alias)) {
            throw new AliasAlreadyExistsException(alias);
        }
        return save(request, alias, userId);
    }

    private UrlResponse createWithGeneratedCode(CreateUrlRequest request, UUID userId) {
        String shortCode;
        do {
            shortCode = shortCodeGenerator.generateCode();
        } while (urlRepository.existsByShortCode(shortCode));

        return save(request, shortCode, userId);
    }

    private UrlResponse save(CreateUrlRequest request, String shortCode, UUID userId) {
        ShortenedUrl url = ShortenedUrl.builder()
                .originalUrl(request.originalUrl())
                .shortCode(shortCode)
                .userId(userId)
                .expiresAt(request.expiresAt())
                .build();

        return toResponse(urlRepository.save(url));
    }

    @Transactional(readOnly = true)
    public String resolveOriginalUrl(String shortCode) {
        ShortenedUrl url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException(shortCode));

        if (url.isExpired()) {
            throw new UrlNotFoundException(shortCode);
        }

        return url.getOriginalUrl();
    }

    @Transactional(readOnly = true)
    public List<UrlResponse> listByUser(UUID userId) {
        return urlRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    private UrlResponse toResponse(ShortenedUrl url) {
        return new UrlResponse(
                url.getId(),
                url.getOriginalUrl(),
                url.getShortCode(),
                baseUrl + "/" + url.getShortCode(),
                url.getCreatedAt(),
                url.getExpiresAt()
        );
    }

}
