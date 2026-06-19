package me.gabrielporto.sniplink.short_service.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import me.gabrielporto.sniplink.short_service.entity.ShortenedUrl;

public interface UrlRepository extends JpaRepository<ShortenedUrl, UUID> {

    Optional<ShortenedUrl> findByShortCode(String shortCode);

    boolean existsByShortCode(String shortCode);

    List<ShortenedUrl> findByUserId(UUID userId);

}
