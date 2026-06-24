package me.gabrielporto.sniplink.short_service.config;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.Base64;
import java.util.Optional;

import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CookieAuthorizationRequestRepository
        implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {

    static final String AUTH_REQUEST_COOKIE = "oauth2_auth_request";
    static final String REDIRECT_COOKIE = "oauth2_redirect";
    private static final int EXPIRE_SECONDS = 180;

    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
        return readCookie(request, AUTH_REQUEST_COOKIE)
                .map(this::deserialize)
                .orElse(null);
    }

    @Override
    public void saveAuthorizationRequest(OAuth2AuthorizationRequest authorizationRequest,
            HttpServletRequest request, HttpServletResponse response) {
        if (authorizationRequest == null) {
            removeCookie(response, AUTH_REQUEST_COOKIE);
            removeCookie(response, REDIRECT_COOKIE);
            return;
        }

        writeCookie(response, AUTH_REQUEST_COOKIE, serialize(authorizationRequest));

        String redirect = request.getParameter("redirect");
        if (redirect != null && !redirect.isBlank()) {
            writeCookie(response, REDIRECT_COOKIE, redirect);
        }
    }

    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(HttpServletRequest request,
            HttpServletResponse response) {
        return loadAuthorizationRequest(request);
    }

    void clearCookies(HttpServletRequest request, HttpServletResponse response) {
        removeCookie(response, AUTH_REQUEST_COOKIE);
        removeCookie(response, REDIRECT_COOKIE);
    }

    String readRedirect(HttpServletRequest request) {
        return readCookie(request, REDIRECT_COOKIE).orElse(null);
    }

    private Optional<String> readCookie(HttpServletRequest request, String name) {
        if (request.getCookies() == null) {
            return Optional.empty();
        }
        for (Cookie cookie : request.getCookies()) {
            if (name.equals(cookie.getName())) {
                return Optional.of(cookie.getValue());
            }
        }
        return Optional.empty();
    }

    private void writeCookie(HttpServletResponse response, String name, String value) {
        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(EXPIRE_SECONDS);
        response.addCookie(cookie);
    }

    private void removeCookie(HttpServletResponse response, String name) {
        Cookie cookie = new Cookie(name, "");
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    private String serialize(OAuth2AuthorizationRequest authorizationRequest) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream(); ObjectOutputStream objectOut = new ObjectOutputStream(out)) {
            objectOut.writeObject(authorizationRequest);
            return Base64.getUrlEncoder().encodeToString(out.toByteArray());
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to serialize authorization request", ex);
        }
    }

    private OAuth2AuthorizationRequest deserialize(String value) {
        try (ObjectInputStream objectIn = new ObjectInputStream(
                new ByteArrayInputStream(Base64.getUrlDecoder().decode(value)))) {
            return (OAuth2AuthorizationRequest) objectIn.readObject();
        } catch (Exception ex) {
            return null;
        }
    }

}
