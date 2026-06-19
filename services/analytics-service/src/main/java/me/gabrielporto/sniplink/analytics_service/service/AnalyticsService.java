package me.gabrielporto.sniplink.analytics_service.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import me.gabrielporto.sniplink.analytics_service.dto.AnalyticsSummaryResponse;
import me.gabrielporto.sniplink.analytics_service.dto.DailyClickResponse;
import me.gabrielporto.sniplink.analytics_service.dto.DeviceStatsResponse;
import me.gabrielporto.sniplink.analytics_service.repository.ClickEventRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final ClickEventRepository repository;

    public AnalyticsSummaryResponse summary(String shortCode, int days) {
        LocalDateTime since = since(days);
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();

        long totalClicks = repository.countByShortCodeAndClickedAtGreaterThanEqual(shortCode, since);
        long clicksToday = repository.countByShortCodeAndClickedAtGreaterThanEqual(shortCode, startOfToday);
        long uniqueCountries = repository.countDistinctCountries(shortCode, since);

        return new AnalyticsSummaryResponse(totalClicks, clicksToday, uniqueCountries);
    }

    public List<DailyClickResponse> daily(String shortCode, int days) {
        return repository.findDailyClicks(shortCode, since(days));
    }

    public List<DeviceStatsResponse> browsers(String shortCode, int days) {
        return repository.findBrowserStats(shortCode, since(days));
    }

    public List<DeviceStatsResponse> devices(String shortCode, int days) {
        return repository.findDeviceStats(shortCode, since(days));
    }

    public List<DeviceStatsResponse> countries(String shortCode, int days) {
        return repository.findCountryStats(shortCode, since(days));
    }

    private LocalDateTime since(int days) {
        return LocalDateTime.now().minusDays(days);
    }

}
