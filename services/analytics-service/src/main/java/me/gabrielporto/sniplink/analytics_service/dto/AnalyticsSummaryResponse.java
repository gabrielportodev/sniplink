package me.gabrielporto.sniplink.analytics_service.dto;

public record AnalyticsSummaryResponse(
        long totalClicks,
        long clicksToday,
        long uniqueCountries
        ) {

}
