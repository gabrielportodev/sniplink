package me.gabrielporto.sniplink.short_service.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import me.gabrielporto.sniplink.short_service.entity.AuthProvider;
import me.gabrielporto.sniplink.short_service.entity.User;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByProviderAndProviderId(AuthProvider provider, String providerId);

    boolean existsByUsername(String username);

}
