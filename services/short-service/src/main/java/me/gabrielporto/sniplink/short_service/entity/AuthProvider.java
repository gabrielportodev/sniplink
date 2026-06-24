package me.gabrielporto.sniplink.short_service.entity;

public enum AuthProvider {
    GOOGLE("sub", "email", "name"),
    GITHUB("id", "login", "name");

    private final String idAttribute;
    private final String primaryNameAttribute;
    private final String fallbackNameAttribute;

    AuthProvider(String idAttribute, String primaryNameAttribute, String fallbackNameAttribute) {
        this.idAttribute = idAttribute;
        this.primaryNameAttribute = primaryNameAttribute;
        this.fallbackNameAttribute = fallbackNameAttribute;
    }

    public String idAttribute() {
        return idAttribute;
    }

    public String primaryNameAttribute() {
        return primaryNameAttribute;
    }

    public String fallbackNameAttribute() {
        return fallbackNameAttribute;
    }

    public static AuthProvider from(String registrationId) {
        return AuthProvider.valueOf(registrationId.toUpperCase());
    }
}
