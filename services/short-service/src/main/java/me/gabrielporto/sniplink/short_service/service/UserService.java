package me.gabrielporto.sniplink.short_service.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import me.gabrielporto.sniplink.short_service.dto.UserResponse;
import me.gabrielporto.sniplink.short_service.entity.AuthProvider;
import me.gabrielporto.sniplink.short_service.entity.User;
import me.gabrielporto.sniplink.short_service.exception.InvalidCredentialsException;
import me.gabrielporto.sniplink.short_service.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public record AuthResult(String token, UserResponse user) {

    }

    @Transactional
    public AuthResult authenticateWithOAuth(AuthProvider provider, String providerId, String preferredUsername) {
        User user = userRepository.findByProviderAndProviderId(provider, providerId)
                .orElseGet(() -> createOAuthUser(provider, providerId, preferredUsername));

        return toAuthResult(user);
    }

    @Transactional(readOnly = true)
    public UserResponse me(UUID userId) {
        return userRepository.findById(userId)
                .map(this::toUserResponse)
                .orElseThrow(InvalidCredentialsException::new);
    }

    private User createOAuthUser(AuthProvider provider, String providerId, String preferredUsername) {
        User user = User.builder()
                .username(resolveUsername(preferredUsername, providerId))
                .provider(provider)
                .providerId(providerId)
                .build();

        return userRepository.save(user);
    }

    private String resolveUsername(String preferredUsername, String providerId) {
        String base = (preferredUsername == null || preferredUsername.isBlank())
                ? "user-" + providerId
                : preferredUsername;

        return userRepository.existsByUsername(base) ? base + "-" + providerId : base;
    }

    private AuthResult toAuthResult(User user) {
        String token = jwtService.generateToken(user.getId(), user.getUsername());
        return new AuthResult(token, toUserResponse(user));
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getCreatedAt());
    }

}
