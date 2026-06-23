package me.gabrielporto.sniplink.analytics_service.dto;

import java.util.List;

public record UrlAnalyticsResponse(
        String shortCode,
        long totalClicks,
        List<DailyClickResponse> clicksPerDay,
        List<DeviceStatsResponse> devices,
        List<DeviceStatsResponse> browsers,
        List<DeviceStatsResponse> countries
        ) {

}
