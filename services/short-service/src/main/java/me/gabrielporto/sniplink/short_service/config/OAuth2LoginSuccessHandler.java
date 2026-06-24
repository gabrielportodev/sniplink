package me.gabrielporto.sniplink.short_service.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import me.gabrielporto.sniplink.short_service.entity.AuthProvider;
import me.gabrielporto.sniplink.short_service.service.UserService;
import me.gabrielporto.sniplink.short_service.service.UserService.AuthResult;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserService userService;
    private final AuthCookieFactory authCookieFactory;
    private final CookieAuthorizationRequestRepository authorizationRequestRepository;

    @Value("${app.oauth2.redirect-uri}")
    private String frontendBaseUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        AuthProvider provider = AuthProvider.from(token.getAuthorizedClientRegistrationId());
        OAuth2User principal = token.getPrincipal();

        String providerId = attribute(principal, provider.idAttribute());
        String username = firstNonBlank(
                attribute(principal, provider.primaryNameAttribute()),
                attribute(principal, provider.fallbackNameAttribute()));

        AuthResult result = userService.authenticateWithOAuth(provider, providerId, username);
        response.addHeader(HttpHeaders.SET_COOKIE, authCookieFactory.create(result.token()).toString());

        String target = buildTarget(authorizationRequestRepository.readRedirect(request));
        authorizationRequestRepository.clearCookies(request, response);

        getRedirectStrategy().sendRedirect(request, response, target);
    }

    private String attribute(OAuth2User principal, String name) {
        Object value = principal.getAttributes().get(name);
        return value == null ? null : value.toString();
    }

    private String firstNonBlank(String first, String second) {
        return first != null && !first.isBlank() ? first : second;
    }

    private String buildTarget(String redirectPath) {
        boolean safe = redirectPath != null
                && redirectPath.startsWith("/")
                && !redirectPath.startsWith("//");
        return frontendBaseUri + (safe ? redirectPath : "/dashboard");
    }

}
