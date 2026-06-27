package me.gabrielporto.sniplink.short_service.service;

import org.springframework.stereotype.Service;

import me.gabrielporto.sniplink.short_service.exception.RateLimitExceededException;

@Service
public class RateLimiter {

    private static final long CAPACITY = 3;
    private static final long REFILL_MILLIS = 60000;

    private final TokenBucket bucket = new TokenBucket(CAPACITY, REFILL_MILLIS);

    public void consume() {
        if (!bucket.tryConsume()) {
            throw new RateLimitExceededException();
        }
    }

}
