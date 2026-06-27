package me.gabrielporto.sniplink.short_service.config;

import java.io.IOException;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import me.gabrielporto.sniplink.short_service.service.TokenBucket;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class GlobalRateLimitFilter extends OncePerRequestFilter {

    private static final long CAPACITY = 60;
    private static final long REFILL_MILLIS = 60000;
    private static final long BLOCK_MILLIS = 300000;
    private static final String TOO_MANY_REQUESTS_BODY = "{\"detail\":\"Muitas requisições. Tente novamente mais tarde.\"}";

    private final TokenBucket bucket = new TokenBucket(CAPACITY, REFILL_MILLIS);
    private long blockedUntil = 0;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        if (!allowed()) {
            reject(response);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private synchronized boolean allowed() {
        if (System.currentTimeMillis() < blockedUntil) {
            return false;
        }
        if (bucket.tryConsume()) {
            return true;
        }
        blockedUntil = System.currentTimeMillis() + BLOCK_MILLIS;
        return false;
    }

    private void reject(HttpServletResponse response) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(TOO_MANY_REQUESTS_BODY);
    }

}
