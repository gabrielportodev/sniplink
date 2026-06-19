package me.gabrielporto.sniplink.analytics_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import me.gabrielporto.sniplink.analytics_service.dto.AnalyticsSummaryResponse;
import me.gabrielporto.sniplink.analytics_service.dto.DailyClickResponse;
import me.gabrielporto.sniplink.analytics_service.dto.DeviceStatsResponse;
import me.gabrielporto.sniplink.analytics_service.service.AnalyticsService;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/{shortCode}/summary")
    public AnalyticsSummaryResponse summary(@PathVariable String shortCode,
                                            @RequestParam(defaultValue = "30") int days) {
        return analyticsService.summary(shortCode, days);
    }

    @GetMapping("/{shortCode}/daily")
    public List<DailyClickResponse> daily(@PathVariable String shortCode,
                                          @RequestParam(defaultValue = "30") int days) {
        return analyticsService.daily(shortCode, days);
    }

    @GetMapping("/{shortCode}/browsers")
    public List<DeviceStatsResponse> browsers(@PathVariable String shortCode,
                                              @RequestParam(defaultValue = "30") int days) {
        return analyticsService.browsers(shortCode, days);
    }

    @GetMapping("/{shortCode}/devices")
    public List<DeviceStatsResponse> devices(@PathVariable String shortCode,
                                             @RequestParam(defaultValue = "30") int days) {
        return analyticsService.devices(shortCode, days);
    }

    @GetMapping("/{shortCode}/countries")
    public List<DeviceStatsResponse> countries(@PathVariable String shortCode,
                                               @RequestParam(defaultValue = "30") int days) {
        return analyticsService.countries(shortCode, days);
    }

}
