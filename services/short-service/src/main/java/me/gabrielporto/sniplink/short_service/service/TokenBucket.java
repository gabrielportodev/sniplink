package me.gabrielporto.sniplink.short_service.service;

public class TokenBucket {

    private final long capacity;
    private final long refillMillis;

    private double tokens;
    private long lastRefill = System.currentTimeMillis();

    public TokenBucket(long capacity, long refillMillis) {
        this.capacity = capacity;
        this.refillMillis = refillMillis;
        this.tokens = capacity;
    }

    public synchronized boolean tryConsume() {
        refill();
        if (tokens < 1) {
            return false;
        }
        tokens -= 1;
        return true;
    }

    private void refill() {
        long now = System.currentTimeMillis();
        double refilled = (double) (now - lastRefill) / refillMillis * capacity;
        if (refilled > 0) {
            tokens = Math.min(capacity, tokens + refilled);
            lastRefill = now;
        }
    }

}
