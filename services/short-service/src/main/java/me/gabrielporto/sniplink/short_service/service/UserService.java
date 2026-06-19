package me.gabrielporto.sniplink.short_service.service;

import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import me.gabrielporto.sniplink.short_service.dto.LoginRequest;
import me.gabrielporto.sniplink.short_service.dto.RegisterRequest;
import me.gabrielporto.sniplink.short_service.dto.UserResponse;
import me.gabrielporto.sniplink.short_service.entity.User;
import me.gabrielporto.sniplink.short_service.exception.InvalidCredentialsException;
import me.gabrielporto.sniplink.short_service.exception.UsernameAlreadyExistsException;
import me.gabrielporto.sniplink.short_service.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public record AuthResult(String token, UserResponse user) {

    }

    @Transactional
    public AuthResult register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new UsernameAlreadyExistsException(request.username());
        }

        User user = User.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .build();

        return toAuthResult(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public AuthResult login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        return toAuthResult(user);
    }

    @Transactional(readOnly = true)
    public UserResponse me(UUID userId) {
        return userRepository.findById(userId)
                .map(this::toUserResponse)
                .orElseThrow(InvalidCredentialsException::new);
    }

    private AuthResult toAuthResult(User user) {
        String token = jwtService.generateToken(user.getId(), user.getUsername());
        return new AuthResult(token, toUserResponse(user));
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getCreatedAt());
    }

}
