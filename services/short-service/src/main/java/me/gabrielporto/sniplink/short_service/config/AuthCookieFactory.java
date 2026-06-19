package me.gabrielporto.sniplink.short_service.config;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class AuthCookieFactory {

    private final String name;
    private final boolean secure;
    private final String sameSite;
    private final Duration maxAge;

    public AuthCookieFactory(
            @Value("${security.cookie.name:access_token}") String name,
            @Value("${security.cookie.secure:false}") boolean secure,
            @Value("${security.cookie.same-site:Lax}") String sameSite,
            @Value("${security.jwt.expiration}") long jwtExpirationMs) {
        this.name = name;
        this.secure = secure;
        this.sameSite = sameSite;
        this.maxAge = Duration.ofMillis(jwtExpirationMs);
    }

    public String name() {
        return name;
    }

    public ResponseCookie create(String token) {
        return base(token).maxAge(maxAge).build();
    }

    public ResponseCookie clear() {
        return base("").maxAge(0).build();
    }

    private ResponseCookie.ResponseCookieBuilder base(String value) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .sameSite(sameSite);
    }

}
