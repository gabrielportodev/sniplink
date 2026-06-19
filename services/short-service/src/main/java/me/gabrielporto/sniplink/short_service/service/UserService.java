package me.gabrielporto.sniplink.short_service.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import me.gabrielporto.sniplink.short_service.dto.AuthResponse;
import me.gabrielporto.sniplink.short_service.dto.LoginRequest;
import me.gabrielporto.sniplink.short_service.dto.RegisterRequest;
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

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new UsernameAlreadyExistsException(request.username());
        }

        User user = User.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .build();

        user = userRepository.save(user);
        return new AuthResponse(jwtService.generateToken(user.getId(), user.getUsername()));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        return new AuthResponse(jwtService.generateToken(user.getId(), user.getUsername()));
    }

}
